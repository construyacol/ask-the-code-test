import * as dataModelActions from "./dataModelActions";
import * as APIactions from "./APIactions";
import * as isAppLoading from "./loader";
import * as ui_actions from "./uiActions";
import * as sounds from "./soundActions";
import * as auth from "./auth";
import * as storage from "./storage";

const actions = {
  ...isAppLoading,
  ...APIactions,
  ...dataModelActions,
  ...ui_actions,
  ...sounds,
  ...auth,
  ...storage
};

export default actions;

// se debe importar así: import actions from './action'
