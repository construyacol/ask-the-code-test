import { HistoricalPriceService } from "./HistoricalPricesService";
import { CoinsendaPairsService } from "./CoinsendaPairsService";
import { CoinsendaReferralService } from "./CoinsendaReferralService";
import { CoinsendaWithdrawService } from "./CoinsendaWithdrawService";
import { CoinsendaIndetityService } from "./CoisendaIndetityService";
import { CoinsendaDepositService } from "./CoinsendaDepositService";
import { CoinsendaSwapService } from "./CoinsendaSwapService";
import userSource from  '../../components/api'
import Environment from "../../environment";
import { addIndexToRootObject, objectToArray } from "../../services";
import normalizeUser from "../../schemas";
import { updateNormalizedDataAction } from "../dataModelActions";
import { CoinsendaAccountService } from "./CoisendaAccountService";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { observable, decorate, computed, action } from "mobx"

const aggregation = (baseClass, ...mixins) => {
    let base = class _Combined extends baseClass {
        constructor(...args) {
            super(...args)
            mixins.forEach((mixin) => {
                mixin.prototype.initializer && mixin.prototype.initializer.call(this)
            })
        }
    }
    let copyProps = (target, source) => {
        Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source))
            .forEach((prop) => {
                if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                    return
                Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
            })
    }
    mixins.forEach((mixin) => {
        copyProps(base.prototype, mixin.prototype)
        copyProps(base, mixin)
    })
    return base
}

const inheritances = aggregation(
    CoinsendaPairsService,
    CoinsendaReferralService,
    CoinsendaWithdrawService,
    CoinsendaIndetityService,
    CoinsendaDepositService,
    CoinsendaSwapService,
    CoinsendaAccountService
);
export class MainService extends inheritances {
    token;
    _globalState;
    dispatch; 

    initialize(dispatch, state, token) {
        this.dispatch = dispatch
        this._globalState = state
        this.token = token ? token : this.token
    }

    get user() {     
        return this._globalState.modelData.user
    }

    setGlobalState(newValue) {
        return this._globalState = newValue
    }

    get globalState () {
        return this._globalState
    }

    async loadFirstEschema() {
        const dataNormalized = await normalizeUser(userSource)
        this.dispatch(updateNormalizedDataAction(dataNormalized))
    }

    static async countryValidator() {
        const URL = `${Environment.IdentityApIUrl}countryvalidators`
        const res = await this.Get(URL)
        const countries = await addIndexToRootObject(res[0].levels.level_1.personal.natural.country)
        const array = await objectToArray(countries)
        const result = {
            res: res[0],
            countries,
            country_list: array
        }

        return result
    }

    async init(country, callback) {
        while(!this.user) {
            await sleep(2000)
        }
        let pairs = await this.fetchAllPairs(this.user.userToken, country)
        
        if (!pairs) {
            return callback()
        }

        await this.fetchAllCurrencies()
        await this.getPairsByCountry(this.user.country)
        await this.getBalancesByAccount(this.user)
        await this.fetchDepositProviders()
        await this.getWalletsByUser()
    }
}

decorate(MainService, {
    _globalState: observable.deep,
    setGlobalState: action,
    user: computed,
    globalState: computed
})

const mainService = new MainService()


const sleep = (time) => new Promise(resolve => {
    setTimeout(() => resolve(), time)
})

export const useCoinsendaServices = (authData) => {
    const dispatch = useDispatch()
    const rState = useSelector(state => state)
    mainService.initialize(dispatch, rState, authData.userToken)

    useEffect(() => {
        mainService.setGlobalState(rState)
    }, [rState])

    // useEffect(() => {
    //     services._globalState = state
    // }, [state])

    return mainService;
}