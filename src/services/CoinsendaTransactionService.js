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
  TWO_FACTOR_BASE_URL
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
    // console.log('||||||||||||  userHasTransactionSecurity ==> ', response)
    // debugger
    if (!response || response === 465 || (response && !response.length)) {
      return false;
    } 
    const withdrawScope = "withdraw:withdraws:addNewWithdraw::*";
    const depositScope = "deposit:deposits:addUpdateDeposit::confirmed";


    return {
      transaction_security_id: response[0].id,
      scopes: {
        withdraw: response[0].scopes[withdrawScope],
        deposit: response[0].scopes[depositScope]
      },
    };
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

  async addNewTransactionSecurity(twofa_token) {
    const body = {
      data: {
        country: this.user.country,
        enabled: true,
        type: "2fa",
        twofa_token,
      },
    };
    const response = await this.Post(`${TWO_FACTOR_URL}/add-new-transaction-security`, body);
    if (response === 465 || !response) {
      return false;
    }
    const withdrawScope = "withdraw:withdraws:addNewWithdraw::*";
    const { data } = response;
    return {
      transaction_security_id: data.id,
      scopes: {
        withdraw: data.scopes[withdrawScope],
      },
    };
  }

  async disable2fa(token) {
    // const { transaction_security_id } = await this.userHasTransactionSecurity(this.user.id)
    const body = {
      data: {
        transaction_security_id: this.user.security_center.txSecurityId,
        country: this.user.country || "colombia",
        twofa_token: token,
      },
    };

    const res = await this.Post(`${TWO_FACTOR_URL}/disable-transaction-security`, body);
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
