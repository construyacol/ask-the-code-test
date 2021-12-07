import { WebService } from "../actions/API/WebService";
import { appLoadLabelAction } from "../actions/loader";
import { updateAllCurrenciesAction } from "../actions/dataModelActions";
import {
  loadLabels,
  LOCAL_CURRENCIES_URL,
  CURRENCIES_URL,
  ADD_RESTORE_ID_URL,
  GET_PROFILE_URL,
  ADD_PROFILE_URL,
  TWO_FACTOR_URL,
  TWO_FACTOR_BASE_URL,
  TRANSACTION_SECURITY
} from "../const/const";
import { matchItem } from "../utils";
import { coins } from "../components/api/ui/api.json";

export class TransactionService extends WebService {
  async fetchAllCurrencies() {
    await this.dispatch(
      appLoadLabelAction(loadLabels.OBTENIENDO_TODAS_LAS_DIVISAS)
    );

    const response = await this.Get(CURRENCIES_URL);
    let new_currencies = [];

    // en caso de que ocurra un error en esta petición cargaremos con datos harcodeados el modelo
    if (!response) {
      this.dispatch(updateAllCurrenciesAction(new_currencies));
      return coins;
    }

    // let updateState = true;
    // if (
    //   this.isCached("fetchAllCurrencies_", response, false) &&
    //   this.globalState.modelData.currencies
    // ) {
    //   updateState = false;
    // }

    const currencies = response.reduce((result, currency) => {
      const split = currency.node_url && currency.node_url.split("api");
      result.push({
        currency_type: currency.currency_type,
        id: currency.id,
        type: "coins",
        name: currency.currency,
        code: currency.symbol.toLowerCase(),
        selection: false,
        is_token: currency.is_token,
        min_amount: currency.deposit_min_amount,
        ...currency,
        node_url: split && split[0],
      });
      return result;
    }, []);
    // updateState && (await this.dispatch(updateAllCurrenciesAction(currencies)));
    await this.dispatch(updateAllCurrenciesAction(currencies))
    return currencies;
  }

  async userHasTransactionSecurity(userId) {

    const url = `${TWO_FACTOR_BASE_URL}users/${userId}/transactionSecurity`;
    const response = await this.Get(url);

    if (!response || response === 465 || (response && !response.length)) {
      return false;
    }

    for (const scope of response) {
      TRANSACTION_SECURITY[scope.type] = {
        enabled:scope.enabled,
        id:scope.id
      }
    }
    console.log(TRANSACTION_SECURITY, response)
    
    return TRANSACTION_SECURITY

  }

  async getNew2faSecretCode() {
    const body = {
      data: {
        country: this.user.country,
      },
    };
    const response = await this.Post(`${TWO_FACTOR_URL}/get-new-2fa-secret-code`, body);
    if (response === 465 || !response) {
      return false;
    }

    return response;
  }

  async addNewTransactionSecurity(type, twofa_token) {

    let user = JSON.parse(JSON.stringify(this.user))
    const transactionSecurity = JSON.parse(JSON.stringify(user.security_center.transactionSecurity))

    const body = {
      data: {
        country: user.country,
        enabled: true,
        type,
        twofa_token,
      },
    };
    const response = await this.Post(`${TWO_FACTOR_URL}/add-new-transaction-security`, body);
    // console.log('response', response)
    // console.log('body', body)
    // debugger
    if (response === 465 || !response) {
      return false;
    }

    const { data } = response

    transactionSecurity[data.type] = {
      enabled:data.enabled,
      id:data.id
    }

    let updatedUser = {
      ...user,
      security_center: {
          ...user.security_center,
        transactionSecurity,
        authenticator: {
          ...user.security_center.authenticator,
          auth: transactionSecurity[type]?.enabled,
          withdraw: transactionSecurity[type]?.enabled
        },
      }
    };
    await this.updateUser(updatedUser)
    // console.log('TRANSACTION_SECURITY', TRANSACTION_SECURITY)
    // console.log('updatedUser', updatedUser.security_center)
    // debugger
    return transactionSecurity
  }

  async disableTransactionSecutiry(type, token) {
    // const { transaction_security_id } = await this.userHasTransactionSecurity(this.user.id)
    let user = this.user
    const transactionSecurity = JSON.parse(JSON.stringify(user.security_center.transactionSecurity))

    const body = {
      data: {
        transaction_security_id: transactionSecurity[type].id,
        country: user.country || "international"
      }
    };

    if(token){
      body.data.twofa_token = token
    }
    
    const res = await this.Post(`${TWO_FACTOR_URL}/disable-transaction-security`, body);
    
    if(!res) return;
    
    transactionSecurity[type].enabled = false
    
    let updatedUser = {
      ...user,
      security_center: {
        ...user.security_center,
        transactionSecurity,
        authenticator: {
          ...user.security_center.authenticator,
          auth: transactionSecurity[type].enabled,
          withdraw: transactionSecurity[type].enabled 
        },
      }
    };

    
    await this.updateUser(updatedUser)

    return res;
  }

  async addRestoreId(restore_id) {
    const body = {
      data: {
        restore_id,
      },
    };
    const response = await this.Post(ADD_RESTORE_ID_URL, body);
    if (response === 465 || !response) {
      return false;
    }
    return response;
  }

  async addSymbolToLocalCollections(pairs, localCurrency, currencies) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line array-callback-return
    return pairs.reduce((result, value) => {
      const secondaryShortName = matchItem(currencies, { primary: localCurrency }, "currency");
      const primaryShortName = matchItem(currencies, { primary: value.primary_currency.currency }, "currency");
      if (secondaryShortName && primaryShortName) {
        result.push({
          ...value,
          secondaryShortName: secondaryShortName[0].symbol,
          primaryShortName: primaryShortName[0].symbol,
        });
        return result;
      }
    }, []);
  }

  async getLocalCurrency(country) {
    const [countryCurrency] = await this.Get(
      `${LOCAL_CURRENCIES_URL}{"where": {"name": "${country}"}}`
    );

    if (this.isEmpty(countryCurrency)) return;

    const localCurrencyId = countryCurrency.currency_id;
    let localCurrencyData = await this.Get(
      `${CURRENCIES_URL}{"where": {"id": "${localCurrencyId}"}}`
    );
    if (this.isEmpty(localCurrencyData)) return;
    localCurrencyData = localCurrencyData[0];

    return {
      currency: localCurrencyData.currency,
      currency_type: localCurrencyData.currency_type,
      localCurrency: localCurrencyData.symbol.toLowerCase(),
      country,
    };
  }

  async fetchUserProfile() {
    return this.Get(`${GET_PROFILE_URL}/${this.authData.userId}/profile`);
  }

  async addNewProfile(country) {
    const body = {
      data: {
        country: country,
      },
    };

    const response = await this.Post(ADD_PROFILE_URL, body);
    if (!response) {
      return false;
    }

    const { data } = response;

    return data;
  }
}
