import React, { Component } from 'react'
import KycBasicLayout from './kycBasicLayout'
// import { kyc } from '../../api/ui/api.json'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'

class KycBasicContainer extends Component {

  state = {
    // names:this.props.names,
    // lastnames:this.props.lastnames,
    // birthDate:this.props.birthDate,
    // id:this.props.id,
    // phone:this.props.phone,
    // city:this.props.city,
    // address:this.props.address,
    // activity:this.props.activity,
    ...this.props.init_state,
    message:this.props.kyc_data_basic[(this.props.step-1)].message,
    active:false,
    colorMessage:"#50667a"
  }


  componentDidMount(){
    this.props.action.CurrentForm('kyc_basic')

    this.init_component()
  }

  init_component = async() =>{
    await this.props.action.UpdateForm('kyc_basic', this.state)
    // console.log('KycBasicContainer -- init_component -- state', this.state)
  }



  update = async(event) => {

    const { name, value } = event.target
    console.log('update', event.target)
    
    await this.setState({
            [name]:value
          })

    this.props.action.UpdateForm('kyc_basic', this.state)
    this.validateActive()
  }




  validateActive = () =>{

    const {
      names,
      lastnames,
      birthDate,
      id,
      phone,
      city,
      address,
      activity
    } = this.state

    const arre = [
      names,
      lastnames,
      birthDate,
      id,
      phone,
      city,
      address,
      activity
    ]

    const { step } = this.props

    switch (this.props.step) {
// validamos si el estado de cada input tiene información
// si el input actual tiene info, coloreamos el contorno del input de color azul para dar feedback success al usuario de que puede continuar

      case (step):
        if(arre[(step-1)]){
            return this.setState({
              active:true
            })
        }
        return this.unAvailableActive()

      default:
        return this.unAvailableActive()

    }
  }




  unAvailableActive = () =>{
    return this.setState({
      active:false
    })
  }

  siguiente = async() =>{
    if(this.props.step<7){
      await this.props.action.IncreaseStep('kyc_basic')
      return this.validateActive()
    }

      return this.props.nextKyc()
  }



  handleSubmit = (event) =>{
    event.preventDefault()

    const {
      names,
      lastnames,
      birthDate,
      id,
      phone,
      city,
      address,
      activity
    } = this.state

    const arre = [
      names,
      lastnames,
      birthDate,
      id,
      phone,
      city,
      address,
      activity
    ]

    const { step } = this.props

    switch (this.props.step) {
// validamos si el estado de cada input tiene información y así decidir si dejarlo continuar o devolverle un mensaje de error jeje
      case (step):
        if(arre[(step-1)]){
            return this.siguiente()
        }
        return this.setState({
                    message:this.errMessage(step),
                    colorMessage:"#ff1100"
                  })

      default:
        return this.unAvailableActive()

    }

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

  componentWillReceiveProps(){
      this.updateMessage()
  }


// nextKyc
  render(){

    // console.log('E S T A D O   K Y C', kyc.kyc_basic[(this.props.step-1)].message )
    // console.log('E S T A D O   K Y C', this.props )

    const { step } = this.props

    return(
      <KycBasicLayout
        update={this.update}
        handleSubmit={this.handleSubmit}
        step={step}
        kyc={this.props.kyc_data_basic}
        state={this.state}
      />
    )

  }

}


function mapStateToProps(state, props){

  // console.log('||||||  mapStateToProps - - ', props)
  const { step } = state.form.form_kyc_basic

  return{
      step
  }

  // return{
  //     ...state.form.form_kyc_basic
  // }

}

function mapDispatchToProps(dispatch){
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KycBasicContainer)
