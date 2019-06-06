import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'

import './styles.css'

class FlowAnimationLayout extends Component {

  // @params - - behavior
  // nextV    //Avance de sección de forma Vertical
  // backV    //Retroceder sección de forma Vertical
  // nextH    //Avance de sección de forma Horizontal
  // backH    //Retroceder sección de forma Horizontal

  state = {
    behavior:this.props.behavior
  }

  componentWillReceiveProps({behavior}){
    if(behavior === this.state.behavior){return false}
    this.update_view(behavior)
  }

  update_view = behavior =>{

    this.setState({behavior})

    setTimeout(()=>{
      this.props.action.FlowAnimationLayoutAction("")
      this.setState({behavior:""})
    }, 300)

  }


  componentWillUnmount(){
    this.props.action.FlowAnimationOff()
  }

  render(){


    const {
      children
    } = this.props

    const {
      behavior
    } = this.state

    return(
      <section className={`FlowAnimationLayout ${behavior}`}>
        {children}
      </section>
    )
  }


}




function mapDispatchToProps(dispatch){
    return{
      action:bindActionCreators(actions, dispatch)
    }
}


function mapStateToProps(state, props){
  return{
    behavior:state.ui.flowAnimationLayout
  }
}

//
export default connect(mapStateToProps, mapDispatchToProps) (FlowAnimationLayout)
