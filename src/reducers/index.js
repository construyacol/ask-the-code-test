import model_data from './model_data'
import form from './form'
import isLoading from './is_loading'
import ui from './ui'

import { combineReducers } from 'redux'

 const rootReducer = combineReducers({
   model_data,
   form,
   isLoading,
   ui
  })

 export default rootReducer
