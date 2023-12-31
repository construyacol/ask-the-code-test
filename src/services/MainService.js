// import localForage from "localforage";
// import { HistoricalPriceService } from "../actions/API/HistoricalPricesService";
import { TransactionService } from "./CoinsendaTransactionService";
import { ReferralService } from "./CoinsendaReferralService";
import { WithdrawService } from "./CoinsendaWithdrawService";
import { IndetityService } from "./CoisendaIndetityService";
import { DepositService } from "./CoinsendaDepositService";
import { SwapService } from "./CoinsendaSwapService";
import { AccountService } from "./CoinsendaAccountService";
// import { FreshChatService } from "./CoinsendaFreshChatService";
import { PushNotificationService } from "./pushNotifications";
import normalizeUser from "../schemas";
import { updateNormalizedDataAction } from "../actions/dataModelActions";
import isAppLoading, {
  // appLoadLabelAction,
  isAppLoaded,
} from "../actions/loader";
import sleep from "../utils/sleep";
import { GET_URLS, GET_CHART_DATA_URL, history } from "../const/const";
import { updateLoadersAction } from "../actions/uiActions";
import { isEmpty } from 'lodash' 
// import { observable, decorate, computed, action } from "mobx"


const aggregation = (baseClass, ...mixins) => {
  let base = class _Combined extends baseClass {
    constructor(...args) {
      super(...args);
      mixins.forEach((mixin) => {
        mixin.prototype.initializer && mixin.prototype.initializer.call(this);
      });
    }
  };
  let copyProps = (target, source) => {
    Object.getOwnPropertyNames(source)
      .concat(Object.getOwnPropertySymbols(source))
      .forEach((prop) => {
        if (
          prop.match(
            /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
          )
        )
          return;
        Object.defineProperty(
          target,
          prop,
          Object.getOwnPropertyDescriptor(source, prop)
        );
      });
  };
  mixins.forEach((mixin) => {
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });
  return base;
};

const inheritances = aggregation(
  TransactionService,
  ReferralService,
  WithdrawService,
  IndetityService,
  DepositService,
  SwapService,
  AccountService,
  PushNotificationService
);

export class MainService extends inheritances {

  token;
  globalState;
  dispatch;

  static instance;

  initialize(dispatch, state, token) {
    this.dispatch = dispatch;
    this.globalState = state;
    this.token = token ? token : this.token;
  }

  static getInstance() {
    if (!MainService.instance) {
      MainService.instance = new MainService();
    }
    return MainService.instance;
  }

  get user() {
    return this.globalState.modelData.user;
  }

  get authData() {
    return this.globalState.modelData.authData;
  }

  setGlobalState(newValue) {
    return (this.globalState = newValue);
  }

  setIsAppLoading(value) {
    return this.dispatch(isAppLoading(value));
  }

  async checkAndUpdateUserStatus() {
    if(this.user?.levels?.identity === 'confirmed' && this.user?.levels?.personal === 'confirmed'){
      await this.updateUserStatus()
      if(["accepted"].includes(this.user.levels.identity)){
        this.init()
        history.push("/wallets")
      }
    }
  }
  

  async init(callback) {
    while (!this.user) {
      await sleep(2000); 
    }  
    const userWallets = await this.userHasWallets();
    const verificationStatus = this.getVerificationState();
    if((userWallets && isEmpty(userWallets)) && verificationStatus === "accepted") {
      await this.createInitialEnvironmentAccount();
    }else if((userWallets && !isEmpty(userWallets))){
      await this.addNewWallets(userWallets);
    }
    await this.getWalletsByUser()

    this.postLoader(callback, false);
    return;
  }
 
  async postLoader(callback, restoreBalancesAndWallets = true) {
    try {
      this.dispatch(
        updateLoadersAction({
          mainList: true,
        })
      );
      restoreBalancesAndWallets && (await this.getWalletsByUser());
      let pairs = await this.fetchAllPairs();
      if (!pairs) {
        // return callback();
      } 
      const currencies = await this.fetchAllCurrencies();
      if (!currencies) throw currencies;
      await this.getPairsByCountry(this.user.country, currencies);
      this.getDepositAccounts()
      await this.fetchDepositProviders();
      await this.fetchWithdrawProviders();
      await this.fetchWithdrawAccounts();
      await this.getReferralCode()
      // await this.subscribeToAllNewDeposits()
      this.checkAndUpdateUserStatus()
      this.dispatch( 
        updateLoadersAction({
          mainList: false,
        })
      );
    } catch (error) {
      await sleep(5000);
      // this.postLoader(callback);
    }
  }

  async getOrderById(orderId, orderType) {
    const apiUrl = GET_URLS[orderType] || GET_URLS.swaps;
    const filter = `{"where":{"id":"${orderId}"}}`;
    const finalUrl = `${apiUrl}/${this.user.id}/${orderType}?country=${this.user.country}&filter=${filter}`;
    const order = await this.Get(finalUrl);

    if (!order || order.length < 1) {
      return false;
    }

    return order[0];
  }

  getUserVerificationStatus(levelRequest) {
    const { advanced, basic, financial } = this.user.security_center.kyc;
    switch (levelRequest) {
      case "level_1":
        return advanced === "accepted" && basic === "accepted";
      case "level_2":
        return (
          advanced === "accepted" &&
          basic === "accepted" &&
          financial === "accepted"
        );
      default:
        return false;
    }
  }

  async fetchChartData(data) {
    const response = await this.Post(GET_CHART_DATA_URL, data);
    return response;
  }

  parseActivty(activity, activityType, accountId) {
    const { storage: { activity_for_account }} = this.globalState;

    if (activity_for_account && activity_for_account[accountId] && activity_for_account[accountId][activityType]) {
      activity = [
        ...activity_for_account[accountId][activityType],
        ...activity,
      ];
    }

    return activity;
  }

  async addItemToState(typeList, newOrder) {
    let list = this.globalState.modelData[typeList];
    let user = this.user;

    let user_update = {
      id: user.id,
      [typeList]: {
        new_order: newOrder,
        ...list,
      },
    };

    let normalizedUser = await normalizeUser(user_update);
    await this.dispatch(updateNormalizedDataAction(normalizedUser));
    return normalizedUser;
  }

  async setAppLoading(payload) {
    this.dispatch(isAppLoaded(payload));
  }

  async isCached(path, newData, doStateValidation = true) {
    return false;
    // const localState = this.globalState.modelData;
    // const cached = await localForage.getItem("CACHED_DATA");
    // if (cached && cached[path]) {
    //   if (deepEqual(cached[path], newData)) {
    //     const existInState = localState[path];
    //     if (doStateValidation && !existInState) {
    //       return false;
    //     }
    //     return true;
    //   } else {
    //     await localForage.setItem("CACHED_DATA", {
    //       ...cached,
    //       [path]: newData,
    //     });
    //   }
    // } else {
    //   await localForage.setItem("CACHED_DATA", { ...cached, [path]: newData });
    // }
    // return false;
  }

}

// preserve for future aplication
// decorate(MainService, {
//     globalState: observable.deep,
//     setGlobalState: action,
//     user: computed,
//     globalState: computed
// })

export const mainService = MainService.getInstance();
