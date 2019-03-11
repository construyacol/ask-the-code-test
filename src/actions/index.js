import * as formActions from './formActions'
import * as dataModelActions from './dataModelActions'
import * as APIactions from './APIactions'
import * as Loader from './loader'
import * as ui_actions from './uiActions'
import * as sounds from './soundActions'

const actions = {
  ...Loader,
  ...formActions,
  ...APIactions,
  ...dataModelActions,
  ...ui_actions,
  ...sounds
}

export default actions

// se debe importar así: import actions from './action'
