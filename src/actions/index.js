import * as formActions from './formActions'
import * as dataModelActions from './dataModelActions'
import * as APIactions from './APIactions'
import * as isAppLoading from './loader'
import * as ui_actions from './uiActions'
import * as sounds from './soundActions'
import * as auth from './auth'
import * as storage from './storage'
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
  freshchat_init_user
}

export default actions

// se debe importar así: import actions from './action'
