import { WebService } from "../actions/API/WebService";
import {
  resetModelData,
  updateNormalizedDataAction,
  // manageBalanceAction,
} from "../actions/dataModelActions";
import normalizeUser from "../schemas";
import {
  ACCOUNT_URL,
  DEPOSITS_URL,
  CREATE_WALLET_URL,
  DELETE_WALLET_URL,
  loadLabels,
} from "../const/const";
import { appLoadLabelAction } from "../actions/loader";
import accountInitialEnvironment from "api/accountInitialEnvironment";
import { serve_orders, matchItem } from "../utils";
import update_activity, { pending_activity } from "../actions/storage";
import { current_section_params } from "../actions/uiActions";
import BigNumber from 'bignumber.js'
import { isEmpty } from 'lodash'
import { checkIfFiat } from 'core/config/currencies';

export class AccountService extends WebService {

  async userHasWallets(){
    const user = this.user;
    const accountUrl = `${ACCOUNT_URL}/${user.id}/accounts`;
    const wallets = await this.Get(accountUrl);
    return wallets
  }

  async getWalletsByUser(onlyBalances = false, lastActionDetail) {
    this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_TUS_BILLETERAS_Y_BALANCES));
    const user = this.user;
    const accountUrl = `${ACCOUNT_URL}/${user.id}/accounts`;
    const wallets = await this.Get(accountUrl);
    
    
    if (!wallets || wallets === 404) {
      return false;
    }

    const availableWallets = wallets.filter((wallet) => {
      return wallet.visible && wallet.currency !== "usd"
        ? wallet
        : false;
    });

    if (!availableWallets.length) {
      let userWithOutW = {
        id: user.id,
        wallets: [],
      };
      const toNormalize = await normalizeUser(userWithOutW);
      await this.dispatch(updateNormalizedDataAction(toNormalize));
      await this.dispatch(resetModelData({ wallets: [] }));
      return;
    }
    
    const balanceList = availableWallets.map((wallet) => {
      let newWallet = {
        id: wallet.id,
        currency: wallet.currency,
        reserved: wallet.reserved,
        available:wallet.available,
        total: new BigNumber(wallet.reserved).plus(wallet.available).toString(),
        lastAction: null,
        actionAmount: 0,
      };
      if (lastActionDetail && wallet.id === lastActionDetail.id) {
        newWallet = { ...newWallet, ...lastActionDetail };
      }
      return newWallet;
    });


    let updatedUser = {
      id: user.id,
      wallets: [...availableWallets],
      balances: [...balanceList],
    };

    const updatedOnlyBalances = {
      id: user.id,
      balances: [...balanceList],
    };



    let userWallets = await normalizeUser(
      onlyBalances ? updatedOnlyBalances : updatedUser
    );

    if (await this.isCached(onlyBalances ? `balances` : `wallets`, wallets)) {
      return userWallets;
    }

    await this.dispatch(updateNormalizedDataAction(userWallets));
    return userWallets;
  }

  async createInitialEnvironmentAccount() {
    const { accounts } = accountInitialEnvironment;
    for (let body of accounts) {
      // TODO: assign currency by country
      await this.createAccountAndInsertDepositProvider(body)
    }
  }


  async addNewWallets(userWallets) {
    
    let newCurrencies = {
      usdt:true,
      ethereum:true
    } 

    userWallets.forEach(wallet => {
      const { currency } = wallet
      if(currency.includes('ethereum')){
        delete newCurrencies.ethereum
      }
      if(currency.includes('usdt') || currency.includes('fau')){
        delete newCurrencies.usdt
      }
    });
    if(!isEmpty(Object.keys(newCurrencies))){
      const { createAccounts } = await import("api/accountInitialEnvironment");
      const currenciesToAdd = createAccounts(Object.keys(newCurrencies))
      for (let body of currenciesToAdd) {
        await this.createAccountAndInsertDepositProvider(body)
      }
    }
  }

  async createAccountAndInsertDepositProvider(body) {
    // body.data.country = this.user.country;
    const newAccount = await this.createWallet(body);
    if (!newAccount) {return}
    await this.getWalletsByUser();
    const { account } = newAccount;
    const depProvider = await this.createAndInsertDepositProvider(account);
    if (!depProvider) {return}
    return newAccount
  }

  // Array.from(new Set([...account.dep_prov, depProvider?.id]))
  // async getWalletById(walletId) {
  //   const user = this.user;
  //   const accountUrl = `${ACCOUNT_URL}/${user.id}/accounts?filter={"where": {"id": "${walletId}"}}`;
  //   const [wallets] = await this.Get(accountUrl);
  //   if (this.isEmpty(wallets)) return;
  //   const depositProvders = wallets.dep_prov;
  //   let depositProviderDetails = [{}];
  //   if (depositProvders.length > 0) {
  //     let providerId = await depositProvders.slice(-1)[0];
  //     const depositProviderUrl = `${DEPOSITS_URL}users/${user.id}/depositProviders?country=${user.country}&filter={"where": {"id":"${providerId}"}}`;
  //     depositProviderDetails = await this.Get(depositProviderUrl);
  //   }
  //   const result = {
  //     ...wallets,
  //     depositProvider: { ...depositProviderDetails[0] },
  //   };
  //   return result;
  // }
 
  async createWallet({ currency, name }) {
 
    const { capitalizeWord } = await import('utils')

    const body = {
        data: {
            name: name || `Mi Billetera ${capitalizeWord(currency)}`,
            // description: "description",
            country: this?.user?.country,
            enabled: true,
            currency
        }
    };

    return this.Post(CREATE_WALLET_URL, body);
  }

  async deleteWallet(account) {
    const { id, country } = account;
    // const user = this.user;

    const body = {
      data: {
        account_id: id,
        country,
        visible: false,
      },
    };
    const deleteAccount = await this.Post(
      DELETE_WALLET_URL,
      body
    );

    if (!deleteAccount || deleteAccount === 404 || deleteAccount === 465) {
      return false;
    }
    return deleteAccount;
  }

  async manageBalance(id, lastAction, actionAmount) {
    await this.getWalletsByUser(true, {
      id,
      lastAction,
      actionAmount,
    });
  }

  // async getBalancesByAccount() {
  //     const user = this.user
  //     this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_TUS_BALANCES))
  //     const accountUrl = `${ACCOUNT_URL}/${user.id}/accounts`


  //     const balances = await this.Get(accountUrl, headers)

  //     if (this.isEmpty(balances)) return

  //     const balanceList = balances.map(balanceItem => ({
  //         id: balanceItem.id,
  //         currency: balanceItem.currency,
  //         reserved: balanceItem.reserved,
  //         available: balanceItem.available,
  //         total: parseFloat(balanceItem.reserved) + parseFloat(balanceItem.available),
  //         lastAction: null,
  //         actionAmount: 0
  //     }))

  //     const updatedUser = {
  //         ...user,
  //         balances: [
  //             ...balanceList
  //         ]
  //     }

  //     const userBalances = await normalizeUser(updatedUser)
  //     await this.dispatch(updateNormalizedDataAction(userBalances))
  // }

  async countOfAccountTransactions(account_id) {
    const response = await this.Get(
      `${ACCOUNT_URL}/${this.user.id}/transactions/count?where={"account_id": "${account_id}"}`
    );
    return response;
  }

  async updatePendingActivity(accountId, type, activityList) {
    const { modelData, ui } = this.globalState;
    if (!modelData.wallets) return;

    // const fallbackCurrentWallet = ui.current_section.params.current_wallet
    const fallbackActivityType = ui.current_section.params.currentFilter;
    const currentAccount = (modelData.withdraw_accounts && modelData.withdraw_accounts[accountId]) || (modelData.wallets && modelData.wallets[accountId]);

    if (!currentAccount) return;

    const activityType = type || fallbackActivityType;

    if (!activityList && currentAccount) {
      activityList = await serve_orders(currentAccount.id, activityType);
      if (!activityList) return;
    }

    // const isWithdraws = activityType === 'withdraws'
    let pendingData;
    const filterActivitiesByStatus = async (primary) => await matchItem(activityList, { primary }, "state", true);

    // If activity is equal to withdraws filter, always set up as 0 value
    let pending = await filterActivitiesByStatus("pending");
    const confirmed = await filterActivitiesByStatus("confirmed");
    // const rejected = await filterActivitiesByStatus('rejected')
    
    if(!checkIfFiat(currentAccount?.currency) && type !== 'swaps'){
      pending = 0
    }

    const expandidoMax = ((pending.length || 0) + (confirmed.length || 0)) * 100;

    if (pending) {
      pendingData = {
        pending: true,
        lastPending:
          activityType === "withdrawals"
            ? confirmed[0] && confirmed[0].id
            : pending[0].id,
      };
    } else if (confirmed) {
      pendingData = {
        pending: true,
        lastPending: confirmed[0] && confirmed[0].id,
      };
    }

    let finalResult = {
      ...pendingData,
      expandidoMax,
      account_id: currentAccount.id,
      activity_type: activityType,
    };

    this.dispatch(pending_activity(finalResult));
  }

  async updateActivityState(accountId, type, activities) {

    if (!activities) {
      activities = await serve_orders(accountId, type);
    }

    await this.dispatch(current_section_params({ currentFilter: type }));
    await this.dispatch(update_activity(accountId, type, activities));
    await this.updatePendingActivity(accountId, type, activities);
  }
}
