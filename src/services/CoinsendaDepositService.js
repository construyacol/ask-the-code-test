import { WebService } from "../actions/API/WebService";
import { UPDATE_DEPOSIT_URL, NEW_DEPOSIT_URL, loadLabels, DEPOSITS_URL, GET_DEPOSIT_BY_USERS_URL } from "../const/const";
import { appLoadLabelAction } from "../actions/loader";
import normalizeUser from "../schemas";
import { updateNormalizedDataAction } from "../actions/dataModelActions";
import {
  success_sound
} from '../actions/soundActions'



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

        // console.log('||||||||| fetchDepositProviders', response)
        // alert('deposit providers')

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


    async confirmDepositOrder(order, base64image) {
        const user = this.user

        const body = {
            // "access_token":user.userToken,
            "data": {
                "country": user.country,
                "deposit_id": order.id,
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






}
