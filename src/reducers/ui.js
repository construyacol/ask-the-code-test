
import {
  HEAD_ROOM,
  MENU_ITEM_ACTIVE,
  ITEM_QUOTE_ACTIVE,
  MODAL_CONFIRMATION_TOGGLE,
  CONFIRMATION_MODAL_PAYLOAD,
  SECTION_VIEW_TO,
  CURRENT_SECTION_PARAMS,
  PAIRS_FOR_ACCOUNT,
  OTHER_MODAL,
  CURRENT_SECTION_CLEAN,
  FLOW_ANIMATION_LAYOUT,
  FLOW_ANIMATION_OFF,
  ADD_NOTIFICATION,
  CLEAN_NOTIFICATIONS,
  APP_LOADED
} from '../actions/action_types'

const initialState = {
  headroom:"",
  app_loaded:false,
  menu_item_active:"",
  item_quote:{
    buy:true,
    sale:false
  },
  modal_confirmation:{
    visible:false,
    action:null,
    title:"",
    description:"",
    txtPrimary:"",
    txtSecondary:"",
    payload:null
  },
  current_section:{
    view:"initial", //initial - detail
    params:{
      current_wallet:null,
      short_name:null,
      pairs_for_account:{},
      activity:false,
      settings:null,
      current_sub_section:null,
      deposit_direct_access:null,
      swap_socket_channel:{
        unique_id:null,
        status:null
      },
      swap_done_id:null,
      swap_done_out:null,
      swap_done_in:null,
      new_deposit_style:null,
      currentFilter:'deposits',
      methods:{
        activity:{
          update_list:null
        }
      }
    }
  },
  other_modal:false,
  flowAnimationLayout:"",
  notifications:{
    withdraw:{
      amount:0,
      extra:null
    }
  }
}


const ui = (state = initialState, action)=>{

  switch (action.type) {

    case APP_LOADED:
      return{
        ...state,
        app_loaded:action.payload
      }
  // payload,
  // amount
    case ADD_NOTIFICATION:
    // console.log('ADD_NOTIFICATION', action)
      return {
        ...state,
        notifications:{
          ...state.notifications,
          [action.payload]:{
            amount:action.amount ? (state.notifications[action.payload].amount + action.amount) : (state.notifications[action.payload].amount + 1),
            extra:action.extra && action.extra
          }
        }
      }

    case CLEAN_NOTIFICATIONS:
      return {
        ...state,
        notifications:{
          ...state.notifications,
          [action.payload]:{
            ...state.notifications[action.payload],
            amount:0
          }
        }
      }

    case FLOW_ANIMATION_LAYOUT:
      return {
        ...state,
        flowAnimationLayout:action.payload,
        flowAnimationActive:true
      }

    case FLOW_ANIMATION_OFF:
      return {
        ...state,
        flowAnimationLayout:"",
        flowAnimationActive:false
      }

    case CURRENT_SECTION_CLEAN:
    // console.log('|||||||||| ANDALE PUES MIJO!!!!!', initialState.current_section.params)
      return {
        ...state,
        current_section:{
          ...state.current_section,
          params:{
            ...initialState.current_section.params,
            pairs_for_account:{
              ...state.current_section.params.pairs_for_account
            },
            update_list:state.current_section.params.update_list
          }
        }
      }


    case PAIRS_FOR_ACCOUNT:
    // console.log('PAIRS_FOR_ACCOUNT', action.payload)
      return {
        ...state,
        current_section:{
          ...state.current_section,
              params:{
                ...state.current_section.params,
                pairs_for_account:{
                  ...state.current_section.params.pairs_for_account,
                  [action.payload.wallet_id]:{
                    ...state.current_section.params.pairs_for_account[action.payload.wallet_id],
                    ...action.payload.data
                  }
                }
              }
        }
      }

    case CURRENT_SECTION_PARAMS:
      return {
        ...state,
        current_section:{
          ...state.current_section,
              params:{
                ...state.current_section.params,
                ...action.payload
              }
        }
      }

    case OTHER_MODAL:
    // console.log('haz hecho click en el modal confirmation', action.payload)
      return {
        ...state,
        other_modal:!state.other_modal
      }
    case SECTION_VIEW_TO:
    // console.log('haz hecho click en el modal confirmation', action.payload)
      return {
        ...state,
        current_section:{
          ...state.current_section,
          view:action.payload
        }
      }

    case CONFIRMATION_MODAL_PAYLOAD:
    // console.log('haz hecho click en el modal confirmation', action.payload)
      return {
        ...state,
        modal_confirmation:{
          ...action.payload,
          visible:state.modal_confirmation.visible

        }
      }

    case MODAL_CONFIRMATION_TOGGLE:
    // console.log('haz hecho click en el modal confirmation', state.modal_confirmation)
      return {
        ...state,
        modal_confirmation:{
          ...state.modal_confirmation,
          visible:!state.modal_confirmation.visible
        }
      }
    case HEAD_ROOM:
      return {
        ...state,
        headroom:action.payload
        }
    case ITEM_QUOTE_ACTIVE:
      let ex = action.payload
      return {
        ...state,
        item_quote:{
          buy:ex === 'buy' ? true : false,
          sell:ex === 'sell' ? true : false,
        }
      }
    case MENU_ITEM_ACTIVE:
      // console.log('-----MENU_ITEM_ACTIVE----------MENU_ITEM_ACTIVE----------MENU_ITEM_ACTIVE----------MENU_ITEM_ACTIVE-----', action.payload )

        let isActive = action.payload
        if(action.payload.indexOf('/') != -1){
          isActive = action.payload.substr(1)
        }


      return {
        ...state,
        menu_item_active:isActive
        }

    default:
      return state
  }
}

export default ui
