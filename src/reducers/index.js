import modelData from './modelData'
import form from './form'
import isLoading from './is_loading'
import ui from './ui'
import auth from './auth'
import storage from './storage'

import { combineReducers } from 'redux'

 const rootReducer = combineReducers({
   modelData,
   form,
   isLoading,
   ui,
   auth,
   storage
  })

 export default rootReducer
