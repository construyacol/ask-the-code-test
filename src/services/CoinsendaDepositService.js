import { WebService } from "../actions/API/WebService";
import { UPDATE_DEPOSIT_URL, NEW_DEPOSIT_URL, loadLabels, DEPOSITS_URL, GET_DEPOSIT_BY_USERS_URL } from "../const/const";
import { appLoadLabelAction } from "../actions/loader";
import normalizeUser from "../schemas";
import { updateNormalizedDataAction } from "../actions/dataModelActions";
import {
  success_sound
} from '../actions/soundActions'
import actions from '../actions'
import {
  update_activity_state,
  normalized_list
} from '../utils'

const {
  update_item_state
} = actions


export class DepositService extends WebService {
    async fetchDepositProviders() {
        this.dispatch(appLoadLabelAction(loadLabels.OBTENIENDO_PROVEEDORES_DE_DEPOSITO))

        const finalUrl = `${DEPOSITS_URL}users/${this.user.id}/depositProviders?country=${this.user.country}&filter[include]=depositAccount`
        const response = await this.Get(finalUrl)
        if (!response) return;


        const result = response.reduce((result, item) => {
            result.push({
                ...item,
                provider: {
                    ...item.depositAccount,
                    account: {
                        ...item.depositAccount.account
                    }
                }
            })
            return result
        }, [])


        const finalData = {
            ...this.user,
            deposit_providers: [
                ...result,
            ]
        }

        const normalizedData = await normalizeUser(finalData)
        this.dispatch(updateNormalizedDataAction(normalizedData))
        return normalizedData.entities.deposit_providers
    }


    async confirmDepositOrder(order_id, base64image) {
        const user = this.user

        const body = {
            // "access_token":user.userToken,
            "data": {
                "country": user.country,
                "deposit_id": order_id,
                "state": "confirmed",
                // "account_id": account_id,
                "proof_of_payment": {
                    "type": "image",
                    "proof": base64image
                }
            }
        }
        return await this.Post(UPDATE_DEPOSIT_URL, body, user.userToken, true)
    }

    async createDeposit(
        currency,
        amount,
        accountId,
        costId,
        depositService,
        user,
        serviceMode,
        depositProviderId
    ) {
        const body = {
            // "access_token":user.userToken,
            "data": {
                "currency": currency,
                "amount": amount,
                "cost_id": costId,
                "deposit_provider_id": depositProviderId,
                "info": { depositService, serviceMode },
                "comment": "",
                "account_id": accountId,
                "country": user.country
            }
        }

        // console.log(body)
        // debugger

        const result = await this.Post(NEW_DEPOSIT_URL, body, user.userToken)
        if (result === 465 || !result) { return false }
        const { data } = result

        return data
    }

    async deleteDeposit(depositId) {
        const user = this.user

        const body = {
            "data": {
                "country": user.country,
                "deposit_id": depositId,
                "state": "canceled"
            }
        }

        return this.Post(UPDATE_DEPOSIT_URL, body, user.userToken)
    }


  async validateAddress (address) {
        const user = this.user

        const finalUrl = `${GET_DEPOSIT_BY_USERS_URL}/${user.id}/depositProviders?country=${user.country}&filter={"where":{"account.account_id.account_id":"${address}" }}`
        const Raddress = await this.Get(finalUrl)

        if (!Raddress) return;

        if(address === Raddress[0].account.account_id.account_id){
          return true
        }
        return false
    }


    async getDepositById(id) {
        const finalUrl = `${GET_DEPOSIT_BY_USERS_URL}/${this.user.id}/deposits?country=${this.user.country}&filter={"where": {"id":"${id}"}, "include":{"relation":"paymentProof"}}`
        const deposit = await this.Get(finalUrl)

        return deposit[0]
    }


    async createDepositProvider(account_id, country) {

        const user = this.user

        let body = {
          "data": {
            account_id,
            country
          }
        }

        const finalUrl = `${DEPOSITS_URL}depositProviders/create-deposit-provider-by-account-id`
        const deposit_prov = await this.Post(finalUrl, body, user.userToken)
        if (deposit_prov === 465 || !deposit_prov) { return }

        const { data } = deposit_prov
        this.dispatch(success_sound())
        return data[0].id

    }

    async createAndInsertDepositProvider(account) {
      const dep_prov_id = await this.createDepositProvider(account.id, account.country)
      const deposit_providers = await this.fetchDepositProviders()
      if(!dep_prov_id){return}

      const update_wallet = {
        [account.id]:{...account, dep_prov:[dep_prov_id], deposit_provider:deposit_providers[dep_prov_id]}
      }
      await this.dispatch(update_item_state(update_wallet, 'wallets'))
      return true
    }


    async getDepositByAccountId(accountId, filter) {
        const finalUrl = `${GET_DEPOSIT_BY_USERS_URL}/${this.user.id}/deposits?country=${this.user.country}&filter={"where":{"account_id":"${accountId}"${filter ? `, ${filter}` : ''}}}`
        const deposit = await this.Get(finalUrl)
        // console.log('|||||||||||||||||||||||||||||||||||||||||||| FINAL URL ::', finalUrl, deposit)
        return deposit
    }


    async get_deposits(account_id, limit = 20, skip = 0) {
    // @params:
    // account_id

        const user = this.user

        let filter = `{"where":{"account_id":"${account_id}"}, "limit":${limit}, "skip":${skip}, "order":"id DESC", "include":{"relation":"user"}}`
        const finalUrl = `${DEPOSITS_URL}users/${user.id}/deposits?country=${user.country}&filter=${filter}`

        const deposits = await this.Get(finalUrl)
        if(!deposits || deposits === 465){return false}

        let remodeled_deposits = await deposits.map(item => {
          let new_item = {
            ...item,
            type_order:"deposit",
            // paymentProof:item.paymentProof && item.paymentProof.proof_of_payment
          }
          return new_item
        })

        // const { storage: { activity_for_account } } = this.globalState
        //


        remodeled_deposits = this.parseActivty(remodeled_deposits, 'deposits', account_id)

        await this.dispatch(normalized_list(remodeled_deposits, 'deposits'))
        await this.dispatch(update_activity_state(account_id, 'deposits', remodeled_deposits))
        return deposits

    }





}