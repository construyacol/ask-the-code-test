import { WebService } from "./WebService";
import { ADD_NEW_SWAP, loadLabels, GET_SWAPS_BY_USERS_URL } from "./const";
import { desNormalizedList } from "../../services";
import normalizeUser from "../../schemas";
import { updateNormalizedDataAction } from "../dataModelActions";
import { appLoadLabelAction } from "../loader";

export class CoinsendaSwapService extends WebService {

    async addNewSwap(accountId, pairId, value) {
        const user = this.user

        const body = {
            // "access_token":user.userToken,
            "data": {
                "want_to_spend": value.toString(),
                "pair_id": pairId,
                "account_from": accountId,
                "country": user.country
            }
        }

        const result = await this.Post(ADD_NEW_SWAP, body, user.userToken)

        if (!result || result === 465) { return false }

        const {
            data
        } = result

        return data
    }

    async completeSwap(swaps, user, completeSwap, updateList) {
        let newSwap = {
            ...swaps[completeSwap.id],
            state: "accepted"
        }

        let updatedSwaps = {
            ...swaps,
            [newSwap.id]: {
                ...newSwap
            }
        }

        let swapsAsArray = await desNormalizedList(updatedSwaps, user.swaps)

        if (updateList) { await updateList(swapsAsArray) }

        let updatedUser = {
            ...user,
            swaps: [
                ...swapsAsArray
            ]
        }

        let normalizedUser = await normalizeUser(updatedUser)
        await this.dispatch(updateNormalizedDataAction(normalizedUser))
        return normalizedUser
    }

    async getSwapList() {
        const { user, wallets } = this.globalState.modelData


        await this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_REGISTRO_DE_INTERCAMBIOS))

        const finalUrl = `${GET_SWAPS_BY_USERS_URL}/${user.id}/swaps?country=${user.country}`
        const swaps = await this.Get(finalUrl)

        if (!swaps) { return false }
        
        const finalSwapList = swaps.reduce((result, swap) => {
            result.push({
                account_id: swap.account_from,
                account_to: swap.account_to,
                amount: swap.bought,
                amount_neto: swap.bought,
                pair_id: swap.pair_id,
                comment: "",
                action_price: swap.action_price,
                currency: swap.to_spend_currency,
                currency_type: wallets[swap.account_from] && wallets[swap.account_from].currency_type,
                cost: "",
                deposit_provider_id: "",
                expiration_date: new Date(),
                id: swap.id,
                state: swap.state === 'rejected' ? 'canceled' : swap.state,
                bought: swap.bought,
                currency_bought: swap.to_buy_currency,
                spent: swap.spent,
                type_order: "swap"
            })
            return result
        }, [])

        finalSwapList.reverse()

        let updatedUser = {
            ...user,
            swaps: [
                ...finalSwapList
            ]
        }

        let normalizedUser = await normalizeUser(updatedUser)
        await this.dispatch(updateNormalizedDataAction(normalizedUser))
        return normalizedUser
    }
}