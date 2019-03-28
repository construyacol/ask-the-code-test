import React, { Component } from 'react'
import KycBasicLayout from './kycBasicLayout'
// import { kyc } from '../../api/ui/api.json'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { objectToArray } from '../../../services'
import MVList from '../../widgets/itemSettings/modal_views/listView'








// nuevo metodo para ejecutar animaciones complejas, para esto debemos crear un objeto con propiedades booleanas que haga las veces de diversos disparadores de metodos donde vayan activando y desactivando (true/false) de forma sincrona distintos eventos en el DOM (añadir/quitar => clases || styles)...
//
// ej: stack:{
//    anim1:true,
//    anim2:false,
//    anim3:true
// }
//
// method = (sub_section) => {
//    await dom_animation_dispatch({stack:{...state.stack, anim1:true}}, 300)    //dom_animation_dispatch({state}, {time to ejecution})
// }
//
// dom_animation_dispatch = (state, time) => {
//    new Promise(resolve, err) =>{
//      setTimeOut(async()=>{
// 	     await this.setState({state})
//        resolve(true)
//     	}, time)
//    }
// }





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
    findbar:this.props.kyc_data_basic[(this.props.step-1)].name === 'phone' ? this.props.findbar_phone : null,
    findbar_phone:this.props.findbar_phone,
    search_result:this.props.search_result
  }

  componentDidMount(){
    this.init_component()
  }

  init_component = async() =>{
    await this.props.action.CurrentForm('kyc_basic')
    // let alturita = document.getElementById('expandibleKycPanel').clientHeight

  }

  update = async({target}) => {
    const { name, value } = target
    const { step, kyc_data_basic } = this.props

    // console.log('TYPING', name, value)

    switch (name) {
      case 'findbar':
        await this.setState({
                findbar:value
              })
        break;
      case 'findbar_name':
      // instanciamos un estado especifico para almacenar el ultimo dato buscado en cualquier lista ej: findbar_phone => servira como referencia buscada en esta sección especifica...
        let findbartype = `findbar_${kyc_data_basic[(step-1)].name}`
        await this.setState({
                // findbar:value,
                [findbartype]:value ? value : null
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
    await this.props.action.UpdateForm('kyc_basic', this.state)
    await this.validateActive()
    console.log('update STATE', this.state)

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




  receivedProps = async(nextProps) =>{
    let name_section = nextProps.kyc_data_basic[nextProps.step-1].name
    let findbar_content = `findbar_${name_section}`
    // console.log('||||receivedProps', this.state.data_state[name_section], typeof(this.state.data_state[name_section]), !this.state.data_state[name_section])
    // console.log('||||receivedProps', this.state.findbar_phone , typeof(this.state.findbar_phone ), !this.state.findbar_phone)
      await this.setState({
        message:`${this.state.open_sect ? "" : nextProps.kyc_data_basic[(nextProps.step-1)].message}`,
        colorMessage:"#50667a",
        ui_type:nextProps.kyc_data_basic[(nextProps.step-1)].ui_type,
        findbar:name_section === 'phone' ? !this.state.findbar_phone ? null :this.state.findbar_phone :
               !this.state.data_state[name_section] ? null : this.state.data_state[name_section]
        // findbar:`${name_section !== 'phone' ? this.state.data_state[name_section] : !nextProps[findbar_content] ? this.state.data_state.country : nextProps[findbar_content] }`,
        // findbar:`${name_section !== 'phone' ? this.state.data_state[name_section] : !nextProps[findbar_content] ? null : nextProps[findbar_content] }`,
      })
      // console.log('before receive props', this.state.findbar, typeof(this.state.findbar), !this.state.findbar)
      // console.log('before receive props', this.state)
        // findbar => si es el caso de phone que tiene un input adicional, entonces actualice desde el estado findbar_phone (país indicativo), si no tiene país indicativo digitado por el usuario, por default vamos a mostrar el país de operación del mismo
      this.validateActive()
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
    this.receivedProps(nextProps)
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



  update_list = async(item) =>{
    const { code } = item
    console.log('RESULTADO --  BUSQUEDA  --', code)

    let body = {
      target:{
        name:'findbar_name',
        value:code
      }
    }

    const { ui_type, name } = this.props.kyc_data_basic[(this.props.step-1)]

    if(ui_type === "phone"){
      await this.update(body)
    }
    if(name === 'select'){
      body.target.name = 'findbar'
      await this.update(body)
    }
  }


  handle_search_result = async(e) =>{
    console.log('|||||||| - - - SEARCH RESULT --', e)
    await this.setState({search_result:e})
    this.update_list(e)
  }

  clean_search_result = () =>{
    this.setState({search_result:null})
  }

  render(){

    // console.log('P R O P S - -   K Y C', this.props)
    console.log('|||E S T A D O - -   K Y C', this.state)
    const { open_sect, findbar, search_result } = this.state
    // console.log('F I N D B A R     K Y C', findbar, typeof(findbar))
    return(
      <div className="KycLayout">
        <p className="fuente KycTitle KycTitless" >Verificación Basica</p>
        <KycBasicLayout
          update={this.update}
          handleSubmit={this.handleSubmit}
          kyc={this.props.kyc_data_basic}
          step={this.props.step}
          state={this.state}
          toggleSection={this.toggleSection}
          _onFocus={this._onFocus}
          search_result={search_result}
          clean_search_result={this.clean_search_result}
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
              export_result={this.handle_search_result}
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
