import React, { Component } from 'react'
import KycBasicLayout from './kycBasicLayout'
import { kyc } from '../../api/ui/api.json'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'

class KycBasicContainer extends Component {

  state = {
    names:this.props.names,
    lastnames:this.props.lastnames,
    birthDate:this.props.birthDate,
    id:this.props.id,
    phone:this.props.phone,
    city:this.props.city,
    address:this.props.address,
    activity:this.props.activity,
    message:kyc.kyc_basic[(this.props.step-1)].message,
    active:false,
    colorMessage:"#50667a"
  }


  componentDidMount(){
    this.props.action.CurrentForm('kyc_basic')
    // this.init_component()
  }

  // init_component = async() =>{
  //
  //
  // }




  update = async(event) => {
    // console.log(kyc.kyc_basic[0].errmessage)

    const { name, value } = event.target
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
    return kyc.kyc_basic[(step-1)].errmessage
  }

  updateMessage = () =>{
    setTimeout(async()=>{
      await this.setState({
        message:kyc.kyc_basic[(this.props.step-1)].message,
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
    const { active } = this.state

    return(
      <KycBasicLayout
        update={this.update}
        handleSubmit={this.handleSubmit}
        step={step}
        active={active}
        {...this.state}
        kyc={kyc.kyc_basic}
      />
    )

  }

}


function mapStateToProps(state, props){

    const {
      names,
      lastnames,
      birthDate,
      id,
      phone,
      city,
      address,
      activity,
      step,
    } = state.form.form_kyc_basic

  return{
      names:names,
      lastnames:lastnames,
      birthDate:birthDate,
      id:id,
      phone:phone,
      city:city,
      address:address,
      activity:activity,
      step:step
  }
}

function mapDispatchToProps(dispatch){
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KycBasicContainer)
