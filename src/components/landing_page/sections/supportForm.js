import React from 'react'
import ModalContainer from '../../widgets/modal/modalContainer.js'
import OtherModalLayout from '../../widgets/modal/otherModalLayout'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from '../../../actions'

import '../css/supportForm.css'


const SupportForm = (props) => {

  const on_click = (event) => {
    if(event.target.dataset && event.target.dataset.close_modal){
      props.action.other_modal_toggle()
    }
  }

  return(
    <ModalContainer>
      <OtherModalLayout on_click={on_click}>
        <div className="supportForm swing-in-bottom-bck ">
          <iframe title="Feedback Form" className="freshwidget-embedded-form" id="freshwidget-embedded-form" src="https://coinsendahelp.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&formTitle=Ticket+Soporte&submitTitle=Abrir+Ticket&submitThanks=Ticket+Abierto&screenshot=No&attachFile=no&searchArea=no" scrolling="no" height="500px" width="100%" frameBorder="0" >
          </iframe>
        </div>
      </OtherModalLayout>
    </ModalContainer>
  )
}


function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}



export default connect(null, mapDispatchToProps) (SupportForm)
