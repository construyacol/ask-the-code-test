
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
  PLAY_VIDEO,
  VERIFICATION_STATE,
  DEFAULT_VIDEO_STATE
} from '../actions/action_types'

const initialState = {
  headroom:"",
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
      show_menu_principal:true,
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
      active_trade_operation:false
    }
  },
  other_modal:false,
  flowAnimationLayout:"",
  notifications:{
    withdraw:{
      amount:0,
      extra:null
    },
    security:{
      amount:0
    }
  },
  videos:{
    kyc_basic:{
      play:false,
      url:"https://www.youtube.com/watch?v=oUwxqg90Zc4&showinfo=0"
    },
    kyc_advanced:{
      play:false,
      url:"https://www.youtube.com/watch?v=qeMFqkcPYcg"
    }
  },
  verification_state:null
}


const ui = (state = initialState, action)=>{

  switch (action.type) {

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

      case VERIFICATION_STATE:
        return {
          ...state,
          verification_state:action.payload
        }

      case DEFAULT_VIDEO_STATE:
        return {
          ...state,
          videos:{
            ...state.videos,
            kyc_basic:{
              ...state.videos.kyc_basic,
              play:false
            },
            kyc_advanced:{
              ...state.videos.kyc_advanced,
              play:false
            }
          }
        }

      case PLAY_VIDEO:
        return {
          ...state,
          videos:{
            ...state.videos,
            [action.payload]:{
              ...state.videos[action.payload],
              play:true
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
    // console.log('|||||||||| ANDALE PUES MIJO!!!!!', initialState, state)
      return {
        ...state,
        current_section:{
          ...state.current_section,
          params:{
            ...initialState.current_section.params,
            pairs_for_account:{
              ...state.current_section.params.pairs_for_account
            },
            update_list:state.current_section.params.update_list,
            currentFilter:state.current_section.params.currentFilter,
            show_menu_principal:state.current_section.params.show_menu_principal,
            active_trade_operation:state.current_section.params.active_trade_operation
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
