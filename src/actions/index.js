import * as formActions from './formActions'
import * as dataModelActions from './dataModelActions'
import * as APIactions from './APIactions'
import * as isAppLoading from './loader'
import * as ui_actions from './uiActions'
import * as sounds from './soundActions'
import * as auth from './auth'
import * as storage from './storage'
import * as deposit_actions from './API/deposit_actions'
import * as withdraw_actions from './API/withdraw_actions'
import * as swap_actions from './API/swap_actions'
import * as account_actions from './API/account_actions'
import { update_activity_state, get_order_by_id } from '../utils'
import { freshchat_init_user } from '../services/freshChat'



const actions = {
  ...isAppLoading,
  ...formActions,
  ...APIactions,
  ...dataModelActions,
  ...ui_actions,
  ...sounds,
  ...auth,
  ...storage,
  ...deposit_actions,
  ...withdraw_actions,
  ...swap_actions,
  ...account_actions,
  update_activity_state,
  get_order_by_id,
  freshchat_init_user
}

export default actions

// se debe importar así: import actions from './action'
