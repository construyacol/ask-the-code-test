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
  // TRANSACTION_SECURITY
} from "../const/const";
import { matchItem } from "../utils";
import menuItems from "api/ui/menuItems";


export class TransactionService extends WebService {
  async fetchAllCurrencies() {
    await this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_TODAS_LAS_DIVISAS));
    const response = await this.Get(`${CURRENCIES_URL}{"where": {"enabled": true, "visible": true}}`);
    let new_currencies = [];
    // en caso de que ocurra un error en esta petición cargaremos con datos harcodeados el modelo
    if (!response) {
      this.dispatch(updateAllCurrenciesAction(new_currencies));
      return menuItems?.coins;
    }
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

  async userHasTransactionSecurity(user_id) {
    
    const userId = user_id || this.user.id
    const url = `${TWO_FACTOR_BASE_URL}users/${userId}/transactionSecurity`;
    const response = await this.Get(url);
    
    if (!response || response === 465 || (response && !response.length)) {
      return false;
    }

    let transactionSecurity = {
      "2fa":null,
      "biometric":null
    }

    for (const scope of response) {
      transactionSecurity = {
        ...transactionSecurity,
        [scope.type]:{
          enabled:scope.enabled,
          id:scope.id
        }
      }
    }
    return transactionSecurity

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
        const transactionSecurity = JSON.parse(JSON.stringify(user?.security_center?.transactionSecurity))
    
        const body = {
          data: {
            country: user.country,
            enabled: true,
            type,
            twofa_token,
          },
        }; 
    
        const response = await this.Post(`${TWO_FACTOR_URL}/add-new-transaction-security`, body);
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
    let result = []
    pairs.forEach(pair => {
      const secondaryShortName = matchItem(currencies, { primary: localCurrency }, "currency");
      const primaryShortName = matchItem(currencies, { primary: pair.primary_currency }, "currency");
      if (secondaryShortName && primaryShortName) {
        result.push({
          ...pair,
          secondaryShortName: secondaryShortName[0].symbol,
          primaryShortName: primaryShortName[0].symbol,
        });
      }
    })  

    return result
    
  }

  async getLocalCurrency(country) {
    const [ countryCurrency ] = await this.Get(`${LOCAL_CURRENCIES_URL}{"where": {"name": "international"}}`);
    if (this.isEmpty(countryCurrency)) return;
    const localCurrencyId = countryCurrency.currency_id;
    let localCurrencyData = await this.Get(`${CURRENCIES_URL}{"where": {"id": "${localCurrencyId}"}}`);
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
    return this._Get(`${GET_PROFILE_URL}/${this.authData.userId}/profile`);
  } 

  async addNewProfile(country) {
    const body = {
      data: {
        country:country
      }
    };

    return await this._Post(ADD_PROFILE_URL, body);
  }
}
