import * as formActions from './formActions'
import * as dataModelActions from './dataModelActions'
import * as APIactions from './APIactions'
import * as Loader from './loader'
import * as ui_actions from './uiActions'
import * as sounds from './soundActions'
import * as auth from './auth'
import * as storage from './storage'
import * as deposit_actions from './API/deposit_actions'

const actions = {
  ...Loader,
  ...formActions,
  ...APIactions,
  ...dataModelActions,
  ...ui_actions,
  ...sounds,
  ...auth,
  ...storage,
  ...deposit_actions
}

export default actions

// se debe importar así: import actions from './action'
