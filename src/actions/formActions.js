import {
  INCREASE_STEP,
  REDUCE_STEP,
  CLEAN_FORM,
  CURRENT_FORM,
  SEARCH_ITEM,
  UPDATE_FORM_CONTROL,
  UPDATE_FORM,
  MODAL_VIEW,
  TOGGLE_MODAL,
  FIAT_DEPOSIT,
  UPDATE_KYC_PICTURE,
  CLEAN_SEARCH,
  TO_STEP
} from './action_types'


export const ToStep = (payload, explicitStep) => {
  return {
    type:TO_STEP,
    payload:payload,
    step:explicitStep
  }
}


export const IncreaseStep = (payload, explicitStep) => {
  return {
    type:INCREASE_STEP,
    payload:payload,
    step:explicitStep
  }
}

export const FiatDeposit = (short_currency_name) => {
  return {
    type:FIAT_DEPOSIT,
    payload:{
      type_currency:'fiat',
      short_currency_name:short_currency_name,
      currency:short_currency_name
    }
  }
}

export const ReduceStep = (payload, explicitStep) => {
  return {
    type:REDUCE_STEP,
    payload:payload,
    step:explicitStep
  }
}


export const cleanSearch = (payload) => {
  return {
    type:CLEAN_SEARCH,
    payload:payload
  }
}





// View for CurrentForm
// "deposit"
// "wallets"
// "bank"
// "referral"
// "kyc_basic"

export const CurrentForm = (payload) => {
  return {
    type:CURRENT_FORM,
    payload:payload
  }
}

export const CleanForm = (form) => {
  return {
    type:CLEAN_FORM,
    payload:form
  }
}

export const toggleModal = () => {
  return {
    type:TOGGLE_MODAL
  }
}

// modalSuccess
// modalView
// pendingView
// badView
// rejectedView
// confirmedView

export const ModalView = (view) => {
  return {
    type:MODAL_VIEW,
    payload:view,
    meta: {
      sound: {
        play :(view === 'pendingView' || view === 'confirmedView' ) ? 'ticket' :
        view === 'badView' ? 'ticket_canceled' :
        view === 'rejectedView' ? 'ticket_rejected' : ''
      }
    }
  }
}

export const Search = (query, type, items) => {
  return {
    type:SEARCH_ITEM,
    payload:{
      query:query,
    },
    tipos:type,
    items:items
  }
}

export const UpdateFormControl = (form, value) => {
  return {
    type:UPDATE_FORM_CONTROL,
    payload:{form, value}
  }
}

export const UpdatePicKyc = (payload) =>{
  return{
    type:UPDATE_KYC_PICTURE,
    payload:payload
  }
}

export const UpdateForm = (form, state) => {

  switch (form) {

    case 'ticket':
      return {
        type:UPDATE_FORM,
        form:form,
        payload:{
          ...state
        }
      }


    case 'wallet':

      return {
        type:UPDATE_FORM,
        form:form,
        payload:{
          id:"",
          address: "",
          name: state.name,
          currency: state.currency,
          short_currency_name: state.short_currency_name,
          type: "wallet"
        }
      }


    case 'bank':

      return {
        type:UPDATE_FORM,
        form:form,
        payload:{
          ...state
        }
      }

    case 'deposit':
      return {
        type:UPDATE_FORM,
        form:form,
        payload:{
              type_currency:state.type_currency,
              currency:state.currency,
              short_currency_name:state.short_currency_name,
              short_bank_name:state.short_bank_name,
              amount:state.amount,
              deposit_way:state.deposit_way,
              deposit_service:state.deposit_service,
              service_mode:state.service_mode,
              cost_id:state.cost_id
        }
      }

    // case 'kyc_basic':
    //   return {
    //     type:UPDATE_FORM,
    //     form:form,
    //     payload:{
    //       names:state.names,
    //       lastnames:state.lastnames,
    //       birthDate:state.birthDate,
    //       id:state.id,
    //       phone:state.phone,
    //       city:state.city,
    //       address:state.address,
    //       activity:state.activity
    //     }
    //   }

    default:
    return {
      type:UPDATE_FORM,
      form:form,
      payload:{
        ...state
      }
    }

  }

}


export default UpdateFormControl
