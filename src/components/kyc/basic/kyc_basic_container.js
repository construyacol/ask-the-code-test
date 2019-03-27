import React, { Component } from 'react'
import KycBasicLayout from './kycBasicLayout'
// import { kyc } from '../../api/ui/api.json'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { objectToArray } from '../../../services'
import MVList from '../../widgets/itemSettings/modal_views/listView'


class KycBasicContainer extends Component {

  state = {
    data_state:{
      ...this.props.data_state
    },
    message:this.props.kyc_data_basic[(this.props.step-1)].message,
    active:false,
    colorMessage:"#50667a",
    ui_type:this.props.kyc_data_basic[(this.props.step-1)].ui_type,
    open_sect:false,
    findbar:null
  }

  componentDidMount(){
    this.init_component()
  }

  init_component = async() =>{
    await this.props.action.CurrentForm('kyc_basic')
    // let alturita = document.getElementById('expandibleKycPanel').clientHeight

  }

  update = async(event) => {
    const { name, value } = event.target
    const { step, kyc_data_basic } = this.props
    switch (name) {
      case 'findbar':
      // instanciamos un estado especifico para almacenar el ultimo dato buscado en cualquier lista ej: findbar_phone => servira como referencia buscada en esta sección especifica...
        let findbartype = `findbar_${kyc_data_basic[(step-1)].name}`
        await this.setState({
                // findbar:value,
                [findbartype]:value
              })
        break;
      default:
        await this.setState({
              data_state:{
                ...this.state.data_state,
                [name]:value
              }
            })
    }
    this.props.action.UpdateForm('kyc_basic', this.state)
    this.validateActive()
  }

  validateActive = async() =>{
    let arre = await objectToArray(this.state.data_state)
    const { step } = this.props
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







  updateState = (nextProps) =>{
    // console.log('updateState2', nextProps.kyc_data_basic[nextProps.step-1].name)
    // console.log('updateState', this.props.step, this.props)
    // console.log('updateState2', nextProps.step, nextProps)
    let findbar_content = `findbar_${nextProps.kyc_data_basic[nextProps.step-1].name}`
    let name_section = nextProps.kyc_data_basic[nextProps.step-1].name
    // console.log('----------- E S T A D O RECEIVED PROPS', this.state.data_state[name_section])
    setTimeout(async()=>{
      await this.setState({
        message:`${this.state.open_sect ? "" : nextProps.kyc_data_basic[(nextProps.step-1)].message}`,
        colorMessage:"#50667a",
        ui_type:nextProps.kyc_data_basic[(this.props.step-1)].ui_type,
        findbar:`${name_section === 'phone' ? this.state[findbar_content] : this.state.data_state[name_section]}`,
      })
      this.validateActive()
    },1)
  }

  toggleSection = () =>{
    // console.log('Mensajito', this.props.kyc_data_basic[(this.props.step-1)].message, this.props, this.props.step - 1)
    this.setState({
      message:`${!this.state.open_sect ? "" : this.props.kyc_data_basic[(this.props.step-1)].message}`,
      open_sect:!this.state.open_sect
     })
                   // message:`${this.state.open_sect ? this.props.kyc_data_basic[(this.props.step-1)].message : ""}` })
  }

  componentWillReceiveProps(nextProps){
    // console.log('componentWillReceiveProps', nextProps, this.props)
    this.updateState(nextProps)
    if(nextProps.step !== this.props.step){
      this.setState({
        open_sect:false
      })
    }
  }

  _onFocus = () =>{
    // Cerramos la sección de la listas al enfocarnos en el input phone
    const { open_sect, ui_type } = this.state
    if(open_sect && ui_type === 'phone'){
      this.setState({
        open_sect:false,
        message:`${!open_sect ? "" : this.props.kyc_data_basic[(this.props.step-1)].message}`
      })
    }
  }



  update_list = (item) =>{
    console.log('Recibo en componente padre', item)
  }

// nextKyc
  render(){

    // console.log('E S T A D O   K Y C', kyc.kyc_basic[(this.props.step-1)].message )
    // console.log('P R O P S - -   K Y C', this.props)
    // console.log('|||E S T A D O - -   K Y C', this.state)




    const { open_sect, findbar } = this.state

    return(
      <div className="KycLayout" >
        <p className="fuente KycTitle KycTitless" >Verificación Basica</p>
        <KycBasicLayout
          update={this.update}
          handleSubmit={this.handleSubmit}
          kyc={this.props.kyc_data_basic}
          step={this.props.step}
          state={this.state}
          toggleSection={this.toggleSection}
          _onFocus={this._onFocus}
        />
        <div id="expandibleKycPanel" className="expandibleKycPanel" style={{height:open_sect ? '65vh' : '0', opacity:open_sect ? '1': '0'}}>
          <div className={`contexpandibleKycPanel`}>
            <MVList
              list={this.props.country_list}
              noIcon={true}
              theme="ultimate"
              noFindbar={true}
              external_findbar={true}
              external_findbar_data={open_sect ? findbar : false}
              actualizarEstado={this.update_list}
              current_item={this.state.data_state.country}
              // name_item="city"
            />
          </div>
        </div>
      </div>
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
