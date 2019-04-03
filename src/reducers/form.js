// Este reducer contiene las acciones de los formualrios de cuentas bancarias, billeteras y verificación
import {
   SEARCH_ITEM,
   UPDATE_FORM_CONTROL,
   UPDATE_FORM,
   LOADER,
   MODAL_VIEW,
   TOGGLE_MODAL,
   CURRENT_FORM,
   CLEAN_FORM,
   REDUCE_STEP,
   INCREASE_STEP,
   FIAT_DEPOSIT,
   UPDATE_KYC_PICTURE,
   CLEAN_SEARCH
  } from '../actions/action_types'


const initialState = {
  form_kyc_basic:{
        step:1
      },
  form_kyc_financial:{
        step:1
      },
  form_kyc_avanced:{
        newback:null,
        newfront:null,
        newselfie:null,
        base64:{
          newfront:null,
          newback:null,
          newselfie:null
        },
        step:1
      },
  form_deposit:{
        type_currency:"",
        currency:"bitcoin",
        short_currency_name:"",
        short_bank_name:"",
        amount:"",
        deposit_way:"bankaccount",
        deposit_service:"",
        service_mode:"",
        cost_id:"otros_medios",
        step:1
      },
  form_withdraw:{
        amount:"",
        account_from:"",
        withdraw_provider:"",
        withdraw_account: "",
        step:1
      },
  form_bank:{
        type:"bank",
        name:"",
        bank_name:"",
        surname:"",
        owner_id:"",
        account_name:"",
        bank_name:"",
        account_type:"",
        account_number:"",
        withdraw_way: "bankaccount",
        step:2
      },
  form_wallet:{
        id:"",
        type:"wallet",
        name:"",
        currency:"",
        address:"",
        short_currency_name:"",
        step:1
      },
  form_ticket:{
    state:null,
    step:1
  },
  form_control_bank:false,
  form_control_wallet:false,
  form_control_deposit:false,
  modal_visible:false,
  modalView:"modalView",
  search_deposit:[],
  search_bank:[],
  search_coin:[],
  current:"",
  globalStep:0
}


const forms = (state = initialState, action) =>{
  // A un reducer podemos enviarle un estado inicial gracias a ES6 ej. "state={prop:true}"
  switch(action.type){

          case CLEAN_SEARCH:
                return {
                  ...state,
                  search_bank:[]
                }

          case UPDATE_KYC_PICTURE:
                return {
                  ...state,
                  form_kyc_avanced:{
                    ...state.form_kyc_avanced,
                    ...action.payload
                  }
                }
          case REDUCE_STEP:
            switch (action.payload) {
                  case 'ticket':
                      return {
                        ...state,
                        form_ticket: {
                          ...state.form_ticket,
                          step:state.form_ticket.step - 1
                        }
                      }
                  case 'bank':
                      return {
                        ...state,
                        form_bank: {
                          ...state.form_bank,
                          step:state.form_bank.step - 1
                        }
                      }
                  case 'wallets':
                      return {
                        ...state,
                        form_wallet: {
                          ...state.form_wallet,
                          step:state.form_wallet.step - 1
                        }
                      }
                  case 'deposit':
                      return {
                        ...state,
                        form_deposit: {
                          ...state.form_deposit,
                          step:state.form_deposit.step - 1
                        }
                      }
                  case 'kyc_basic':
                      return {
                        ...state,
                        form_kyc_basic: {
                          ...state.form_kyc_basic,
                          step:state.form_kyc_basic.step - 1
                        }
                      }
              default:
                const {payload, step} = action
                let query_prop = `form_${action.payload}`
                return {
                  ...state,
                  [query_prop]:{
                    ...state[query_prop],
                    step:step ? step : state[query_prop].step - 1
                  }
                }
            }
          case INCREASE_STEP:
            switch (action.payload) {
                  case 'ticket':
                      return {
                        ...state,
                        form_ticket: {
                          ...state.form_ticket,
                          step:state.form_ticket.step + 1
                        }
                      }
                  case 'bank':
                      return {
                        ...state,
                        form_bank: {
                          ...state.form_bank,
                          step:state.form_bank.step + 1
                        }
                      }
                  case 'wallets':
                      return {
                        ...state,
                        form_wallet: {
                          ...state.form_wallet,
                          step:state.form_wallet.step + 1
                        }
                      }
                  case 'deposit':
                      return {
                        ...state,
                        form_deposit: {
                          ...state.form_deposit,
                          step:state.form_deposit.step + 1
                        }
                      }
                  case 'kyc_basic':
                      return {
                        ...state,
                        form_kyc_basic: {
                          ...state.form_kyc_basic,
                          step:state.form_kyc_basic.step + 1
                        }
                      }
                  case 'kyc_global_step':
                      return {
                        ...state,
                        globalStep:action.step ? action.step : state.globalStep + 1
                      }
                  // case 'kyc_avanced':
                  //     return {
                  //       ...state,
                  //       form_kyc_avanced:{
                  //         ...state.form_kyc_avanced,
                  //             step:state.form_kyc_avanced.step + 1
                  //           }
                  //     }
              default:
                const {payload, step} = action
                let query_prop = `form_${payload}`
                return {
                  ...state,
                  [query_prop]:{
                    ...state[query_prop],
                    step:step ? step : state[query_prop].step + 1
                  }
                }
            }
          case CLEAN_FORM:
                  switch (action.payload) {
                    case 'ticket':
                          return {
                            ...state,
                            form_ticket:{
                              step:1
                            }
                          }
                    case 'bank':
                        return {
                          ...state,
                          form_bank:{
                            ...initialState.form_bank
                          },
                            modal_visible:false,
                            loader:false,
                            modalView:"modalView",
                            form_control_bank:false,
                            search_bank:[]
                        }
                    case 'wallet':
                        return {
                           ...state,
                             form_wallet:{
                                   id:"",
                                   type:"wallet",
                                   name:"",
                                   currency:"",
                                   address:"",
                                   short_currency_name:"",
                                   step:1
                                 },
                             form_control_wallet:false,
                             modal_visible:false,
                             loader:false,
                             modalView:"modalView",
                             search_coin:[],
                        }
                    case 'deposit':
                        return {
                           ...state,
                              form_deposit:{
                                 type_currency:"",
                                 currency:"",
                                 short_currency_name:"",
                                 short_bank_name:"",
                                 amount:"",
                                 deposit_way:"",
                                 deposit_service:"",
                                 service_mode:"",
                                 step:1
                               },
                             form_control_deposit:false,
                             modal_visible:false,
                             loader:false,
                             modalView:"modalView",
                             search_deposit:[]
                        }
                    case 'kyc_basic':
                        return {
                           ...state,
                             form_kyc_basic:{
                                   names:"",
                                   lastnames:"",
                                   birthDate:"",
                                   id:"",
                                   phone:"",
                                   city:"",
                                   address:"",
                                   activity:"",
                                   step:1
                                 }
                        }
                    default:
                    // console.log('CLEAN_FORM',action)
                    let query_prop = `form_${action.payload}`
                    return {
                      ...state,
                      [query_prop]:{
                        ...initialState[query_prop],
                        step:1
                      }
                    }
                      // return state
                  }
          case CURRENT_FORM:
              return {
                ...state,
                current: action.payload
            }
          case TOGGLE_MODAL:
              return {
                ...state,
                modal_visible: !state.modal_visible
            }
          case MODAL_VIEW:
              return {
                ...state,
                modalView: action.payload
            }
          case UPDATE_FORM:
                if(action.form === "wallet"){
                    return {
                      ...state,
                      form_wallet: {
                        ...action.payload,
                        step:state.form_wallet.step
                      }
                    }
                }
                if(action.form === "bank"){
                    return {
                      ...state,
                      form_bank: {
                        ...action.payload,
                        step:state.form_bank.step
                      }
                    }
                }
                if(action.form === "deposit"){
                    return {
                      ...state,
                      form_deposit: {
                        ...action.payload,
                        step:state.form_deposit.step
                      }
                    }
                }
                // if(action.form === "kyc_basic"){
                //     return {
                //       ...state,
                //       form_kyc_basic: {
                //         ...action.payload,
                //         step:state.form_kyc_basic.step
                //       }
                //     }
                // }
                if(action.form === "ticket"){
                    return {
                      ...state,
                      form_ticket: {
                        ...state.form_ticket,
                        ...action.payload,
                        step:state.form_ticket.step
                      }
                    }
                }
                // console.log(action, state)
                // alert('reducer')
                let query_prop = `form_${action.form}`
                return {
                  ...state,
                  [query_prop]:{
                    ...state[query_prop],
                    ...action.payload
                  }
                }
            // return false
          case UPDATE_FORM_CONTROL:
                        switch (action.payload.form) {
                          case 'wallet':
                            return {
                              ...state,
                              form_control_wallet: action.payload.value
                             }
                          case 'bank':
                            return {
                              ...state,
                              form_control_bank: action.payload.value
                             }
                          case 'deposit':
                            return {
                              ...state,
                              form_control_deposit: action.payload.value
                             }
                          default:
                            return state
                        }
          case SEARCH_ITEM:
              let result = []
              let arreglo = action.tipos
                  action.items.filter((item)=>{
                                let query = action.payload.query.toLowerCase()
                                return item.name.toLowerCase().includes(query) && result.push(item)
                              })
                  if(action.tipos === 'wallets'){
                    return {
                      ...state,
                      search_coin:result
                    }
                  }
                  if(action.tipos === 'bank' || action.tipos === 'withdraw'){
                    return {
                      ...state,
                      search_bank:result
                    }
                  }
                  if(action.tipos === 'deposit'){
                    return {
                      ...state,
                      search_deposit:result
                    }
                  }
              // return {
              //   ...state,
              //   search:result
              // }

          case FIAT_DEPOSIT:
            return{
              ...state,
              form_deposit:{
                ...state.form_deposit,
                currency: action.payload.currency,
                short_currency_name: action.payload.short_currency_name,
                type_currency: action.payload.type_currency,
                amount:action.payload.amount
              }
            }
          default:
            return state
    }
}

export default forms
