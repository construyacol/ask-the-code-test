import { HistoricalPriceService } from "./HistoricalPricesService";
import { CoinsendaPairsService } from "./CoinsendaPairsService";
import { CoinsendaReferralService } from "./CoinsendaReferralService";
import { CoinsendaWithdrawService } from "./CoinsendaWithdrawService";
import { CoinsendaIndetityService } from "./CoisendaIndetityService";
import { CoinsendaDepositService } from "./CoinsendaDepositService";
import { CoinsendaSwapService } from "./CoinsendaSwapService";

const aggregation = (baseClass, ...mixins) => {
    let base = class _Combined extends baseClass {
        constructor (...args) {
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
    CoinsendaSwapService
);
export class MainService extends inheritances{
    constructor(dispatch, state, token) {
        super()
        this.dispatch = dispatch
        this.state = state
        this.token = token
    }
}