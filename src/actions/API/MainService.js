import { HistoricalPriceService } from "./HistoricalPricesService";
import { CoinsendaPairsService } from "./CoinsendaPairsService";

class MultiClass {
    static inherit(..._bases) {
        class classes {

            get base() { return _bases; }

            constructor(..._args) {
                var index = 0;

                for (let b of this.base) {
                    let obj = new b(_args[index++]);
                    MultiClass.copy(this, obj);
                }
            }

        }

        for (let base of _bases) {
            MultiClass.copy(classes, base);
            MultiClass.copy(classes.prototype, base.prototype);
        }

        return classes;
    }

    static copy(_target, _source) {
        for (let key of Reflect.ownKeys(_source)) {
            if (key !== "constructor" && key !== "prototype" && key !== "name") {
                let desc = Object.getOwnPropertyDescriptor(_source, key);
                Object.defineProperty(_target, key, desc);
            }
        }
    }
}

export class MainService extends CoinsendaPairsService {
    constructor(dispatch, state) {
        super()
        this.dispatch = dispatch
        this.state = state
    }
}