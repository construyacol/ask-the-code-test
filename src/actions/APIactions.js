import Environment from '../environment'
import * as data_model_actions from './dataModelActions'
import { IncreaseStep, ReduceStep } from './formActions'
import moment from 'moment'
import 'moment/locale/es'
import user_source from '../components/api'
import * as normalizr_services from '../schemas'

import {
  ApiGetRequest,
} from './API'

import {
  show_sound
} from './soundActions'

import {
} from './storage'

import {
  appLoadLabelAction
} from './loader'

import {
  current_section_params,
} from './uiActions'

const {
  normalizeUser,
} = normalizr_services

const {
  updateNormalizedDataAction,
} = data_model_actions

const { WithdrawApiUrl } = Environment

moment.locale('es')

export const loadFirstEschema = () => {
  return async (dispatch) => {
    const dataNormalized = await normalizeUser(user_source)
    dispatch(updateNormalizedDataAction(dataNormalized))
  }
}


// OBTENER ORDENES DE RETIRO -------------------------- -------------------------- --------------------------
export const get_withdraw_list = (user) => {

  return async (dispatch) => {


    await dispatch(appLoadLabelAction('Obteniendo tus registros de retiros'))
    // 5bea1f01ba84493018b7528c
    // const url_withdraw_list = `${ApiUrl}withdraws?filter={"where":{"userId":"${user.id}"}}`
    const url_withdraw_list = `${WithdrawApiUrl}users/${user.id}/withdraws?country=${user.country}`
    let myHeaders = {
      'Authorization': `Bearer ${user.userToken}`,
    }
    let withdrawals = await ApiGetRequest(url_withdraw_list, myHeaders)
    if ((withdrawals && withdrawals.length < 1) || !withdrawals || withdrawals === 465) { return false }
    let withdrawals_remodeled = []

    await withdrawals.map(withdraw => {
      let new_withdraw = {
        ...withdraw,
        account_id: withdraw.account_id,
        amount: withdraw.amount,
        amount_neto: withdraw.amount_neto,
        comment: "",
        country: withdraw.country,
        currency: withdraw.currency,
        currency_type: withdraw.currency_type,
        cost: withdraw.cost,
        cost_struct: withdraw.cost_struct,
        deposit_provider_id: "",
        expiration_date: new Date(),
        id: withdraw.id,
        state: withdraw.state === 'accepted' && !withdraw.proof ? 'confirmed' : withdraw.state,
        unique_id: withdraw.id,
        userId: withdraw.userId,
        withdraw_account: withdraw.withdraw_account_id,
        withdraw_provider: withdraw.withdraw_provider_id,
        type_order: "withdraw",
        withdraw_proof: withdraw.proof,
        created_at: withdraw.created_at,
      }
      return withdrawals_remodeled.push(new_withdraw)
    })
    // console.log('=====>   GET WITHDRAWALS ', withdrawals_remodeled)

    withdrawals_remodeled.reverse()

    let user_update = {
      ...user,
      withdrawals: [
        ...withdrawals_remodeled
      ]
    }



    let normalizeUser = await normalizeUser(user_update)
    await dispatch(updateNormalizedDataAction(normalizeUser))


    return normalizeUser

    // return withdrawals

  }

}

export const FlowAnimationLayoutAction = (animation, action, current_section, explicitStep) => {

  return async (dispatch) => {
    // dispatch(FlowAnimationUi(animation))
    switch (action) {
      case 'next':
        // setTimeout(()=>{
        dispatch(IncreaseStep(current_section, explicitStep))
        // }, 130)
        break;
      case 'back':
        // setTimeout(()=>{
        dispatch(ReduceStep(current_section, explicitStep))
        // }, 130)
        break;
      default:
        return false
    }
  }
}

export const add_new_transaction_animation = () => {
  return async (dispatch) => {

    dispatch(current_section_params({ new_order_style: true }))
    setTimeout(() => {
      dispatch(current_section_params({ new_order_style: false }))
    }, 1000)
    setTimeout(() => {
      dispatch(show_sound())
    }, 550)
  }
}