import React, { Component } from 'react'
import KycBasicLayout from './kycBasicLayout'
// import { kyc } from '../../api/ui/api.json'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { objectToArray } from '../../../services'

class KycBasicContainer extends Component {

  state = {
    data_state:{
      ...this.props.data_state
    },
    message:this.props.kyc_data_basic[0].message,
    active:false,
    colorMessage:"#50667a"
  }


  componentDidMount(){
    this.init_component()
  }

  init_component = async() =>{
    await this.props.action.CurrentForm('kyc_basic')
    // await this.props.action.UpdateForm('kyc_basic', this.state)
    // console.log('KycBasicContainer -- init_component -- state', this.state === this.props.init_state)
  }



  update = async(event) => {

    const { name, value } = event.target

    await this.setState({
            data_state:{
              ...this.state.data_state,
              [name]:value
            }
          })
          // console.log('update', event.target)
          console.log('update', this.state)

    this.props.action.UpdateForm('kyc_basic', this.state)
    this.validateActive()
  }




  validateActive = async() =>{
    let arre = await objectToArray(this.state.data_state)
    const { step } = this.props
    // console.log('validateActive', arre, arre[(step-1)])

    if(arre[(step-1)]){
        return this.setState({
          active:true
        })
    }
    return this.unAvailableActive()
  }




  unAvailableActive = () =>{
    return this.setState({
      active:false
    })
  }

  siguiente = async() =>{
    if(this.props.step<=this.props.kyc_data_basic.length){
      await this.props.action.IncreaseStep('kyc_basic')
      return this.validateActive()
    }

      return this.props.nextKyc()
  }



  handleSubmit = async(event) =>{
    event.preventDefault()
    let arre = await objectToArray(this.state.data_state)
    const { step } = this.props
    // console.log('handleSubmit', arre, arre[(step-1)])
    if(arre[(step-1)]){
        return this.siguiente()
    }
    return this.setState({
                message:this.errMessage(step),
                colorMessage:"#ff1100"
              })
  }

  errMessage = (step) => {
    return this.props.kyc_data_basic[(step-1)].errmessage
  }

  updateMessage = () =>{
    setTimeout(async()=>{
      await this.setState({
        message:this.props.kyc_data_basic[(this.props.step-1)].message,
        colorMessage:"#50667a"
      })
      this.validateActive()

    },1)

  }

  componentWillReceiveProps(nextProps){
    // console.log('componentWillReceiveProps', nextProps, this.props)
    if(nextProps !== this.props){
      this.updateMessage()
    }
  }


// nextKyc
  render(){

    // console.log('E S T A D O   K Y C', kyc.kyc_basic[(this.props.step-1)].message )
    // console.log('P R O P S - -   K Y C', this.state )


    return(
      <KycBasicLayout
        update={this.update}
        handleSubmit={this.handleSubmit}
        kyc={this.props.kyc_data_basic}
        step={this.props.step}
        state={this.state}
      />
    )

  }

}


function mapStateToProps(state, props){

  return{
      ...state.form.form_kyc_basic
  }

}

function mapDispatchToProps(dispatch){
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KycBasicContainer)
