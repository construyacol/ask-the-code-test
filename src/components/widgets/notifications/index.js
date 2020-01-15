import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'

import './noti.css'

// @param:type
// new // relaciona el id de extra y si coincide con el elemento de la sección agrega etiqueta "new"

class PopNotification extends Component {

  notification_render = () =>{
    const {
      type,
      notification,
      extra,
      id,
      item_type,
      notifier
    } = this.props

    switch (type) {
      case "new":
        return(

          <div className={`PopNotification newPop ${notifier} ${((extra && item_type) && extra[item_type] === id ) ? 'Visible' : 'Invi'}`}>
          {/* <div className={`PopNotification newPop ${(extra && (extra.account_id === id || extra.order_id === id)) ? 'Visible' : 'Invi'}`}> */}
            <p className="fuente2" >Nuevo</p>
          </div>
        )
      default:
        return(
          <div className={`PopNotification ${notification>0 ? 'Visible' : 'Invi'}`}>
            <p className="fuente2" >{notification}</p>
          </div>
        )

    }

  }


  render(){
    return(
      <this.notification_render/>
    )
  }

}

function mapStateToProps(state, props){
  // console.log('|||||||| PopNotification', props)
  const{
    notifier
  } = props

  return{
    notification:state.ui.notifications[notifier] && state.ui.notifications[notifier].amount,
    extra:state.ui.notifications[notifier] && state.ui.notifications[notifier].extra,
  }
}

export default connect(mapStateToProps) (PopNotification)
