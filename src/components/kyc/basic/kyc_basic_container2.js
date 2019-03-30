import React, { Component } from 'react'
import KycBasicLayout from './kycBasicLayout'
// import { kyc } from '../../api/ui/api.json'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { objectToArray } from '../../../services'
import MVList from '../../widgets/itemSettings/modal_views/listView'
import { matchItem } from '../../../services'







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
    current_item:this.props.kyc_data_basic[(this.props.step-1)].name,
    current_search:null
  }

  componentDidMount(){
    this.init_component()
  }

  init_component = async() =>{
    await this.props.action.CurrentForm('kyc_basic')
    // let alturita = document.getElementById('expandibleKycPanel').clientHeight
  }

  // init_component = async() =>{
  //   await this.props.action.CurrentForm('kyc_basic')
  //
  //   // Debemos desarrollar una pantalla que aparezca en primer instancia pidiento el tipo de persona (legal/natural)
  //   // validamos si el (user.verification_level === 'level_0' && user.person_type === null) seteamos un estado para mostrar la pantalla donde pedimos el person_type, ej:this.setState({person_type})
  //   // de momento solo aceptaremos personas naturales por lo tanto viene seteado por defecto en (user.person_type:'natural')
  //   this.props.action.Loader(true)
  //   const { user, form_kyc_basic_state } = this.props
  //   // console.log('||||||||||||| KycContainer P R O P S - - - ', this.props)
  //   let countryvalidators = await this.props.action.countryvalidators()
  //   // if(user.verification_level === 'level_0'){
  //   if(user.verification_level !== 'level_0'){
  //       const { user } = this.props
  //       let countryvalidators = await this.props.action.countryvalidators()
  //       let kyc_data_basic = await serveKycData(countryvalidators.res.levels.level_1.personal[user.person_type])
  //       let init_state = await converToInitState(countryvalidators.res.levels.level_1.personal[user.person_type])
  //       let get_country_list = await this.props.action.get_country_list()
  //       let select_list = await extractSelectList(kyc_data_basic, countryvalidators.res.levels.level_1.personal[user.person_type])
  //       select_list.countries = get_country_list
  //
  //       init_state = {
  //           data_state:{
  //             ...init_state,
  //             ...form_kyc_basic_state.data_state,
  //             country_prefix:""
  //           }
  //       }
  //
  //       init_state.data_state.country = user.country
  //
  //       // console.log('||||||||||||| countryvalidators R E S - - - ', countryvalidators.res.levels.level_1.personal[user.person_type])
  //       console.log('||||||||||||| select_list R E S - - - ', select_list)
  //
  //       await this.props.action.UpdateForm('kyc_basic', init_state)
  //       await this.setState({kyc_data_basic, select_list})
  //       this.props.action.Loader(false)
  //   }
  // }




  update = async({target}) => {
    const { name, value } = target
    const { step } = this.props
    const { ui_type } = this.state
    console.log('TYPING', name, value, ui_type)
    let new_value = null

        if(name==='country_prefix' || name === 'country' || ui_type === 'select'){
          new_value = await this.matchList(target)
          if(!new_value){return false}
        }
        await this.setState({
              data_state:{
                ...this.state.data_state,
                [name]:new_value ? new_value : value
              },
            })
     this.validateActive()
  }




  matchList = async({value, name}) =>{
    if(!value){
      this.setState({current_search:null})
    }
    const { select_list } = this.props
    const { current_item } = this.state
    let res = await matchItem(select_list[name === 'country_prefix' ? 'countries' : name ], {primary:value}, 'code')
    console.log('||||||matchList', value, name, res)
    if(!res){return false}
    if(res.length<50){
      this.setState({current_search:res})
    }
    if(res.length===1){
      return res[0]
    }


    // console.log('||||||matchList', value, name, current_item, select_list)
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
    const { kyc_data_basic } = this.props
    if(this.props.step<=kyc_data_basic.length){
      await this.props.action.UpdateForm('kyc_basic', this.state)
      await this.props.action.IncreaseStep('kyc_basic')
      return this.validateActive()
    }
      return this.props.nextKyc()
  }


  handleSubmit = async(event) =>{
    event.preventDefault()
    let arre = await objectToArray(this.state.data_state)
    const { step } = this.props
    console.log('handleSubmit', arre[(step-1)])
    if(arre[(step-1)]){
        return this.siguiente()
    }
    return this.setState({
                message:this.errMessage(step),
                colorMessage:"#ff1100"
              })
  }

  errMessage = (step) => {
    const { kyc_data_basic } = this.props
    return kyc_data_basic[(step-1)].errmessage
  }




  receivedProps = async(nextProps) =>{
    let name_section = nextProps.kyc_data_basic[nextProps.step-1].name
    // console.log('|||||||||||||||||||||||||||||||||||||||||||nextState')
      await this.setState({
        message:`${this.state.open_sect ? "" : nextProps.kyc_data_basic[(nextProps.step-1)].message}`,
        colorMessage:"#50667a",
        ui_type:nextProps.kyc_data_basic[(nextProps.step-1)].ui_type,
        current_item:nextProps.kyc_data_basic[nextProps.step-1].name,
        current_search:null
      })
      this.validateActive()
  }

  toggleSection = () =>{
    this.setState({
      message:`${!this.state.open_sect ? "" : this.props.kyc_data_basic[(this.props.step-1)].message}`,
      open_sect:!this.state.open_sect
     })
  }

  componentWillReceiveProps(nextProps){
    // console.log('componentWillReceiveProps', nextProps, this.props)

    if(nextProps.step !== this.props.step){
      this.setState({
        open_sect:false
      })
    }
     this.receivedProps(nextProps)
  }

shouldComponentUpdate(nextProps, nextState){
  if(this.props === nextProps && this.state === nextState){
    return false
  }
  return true
}

  _onFocus = () =>{
    // Cerramos la sección de la listas al enfocarnos en el input phone
    const { open_sect, ui_type } = this.state
    const { kyc_data_basic, step } = this.props

    if(ui_type === 'select'){
      return this.setState({
        open_sect:true,
        message:`${!open_sect ? "" : kyc_data_basic[(step-1)].message}`
      })
    }
  }


  // handle_search_result = async(e) =>{
  //   // console.log('|||||||| - - - SEARCH RESULT --', e)
  //   await this.setState({search_result:e})
  //   this.update_list(e)
  // }

  clean_search_result = async() =>{
    // await this.setState({search_result:null})
    const { ui_type, data_state, current_item } = this.state
    let new_current_item
    if(current_item === 'phone'){new_current_item = 'country_prefix'}

    await this.setState({
      data_state:{
        ...data_state,
        [new_current_item ? new_current_item : current_item]:null
      },
      current_search:null
    })

    if(ui_type === 'select'){
      this.setState({open_sect:true})
    }
  }

  render(){
    // console.log('P R O P S - -   K Y C', this.props)
    // console.log('|||E S T A D O - -   K Y C', this.state)
    const { open_sect, search_result, data_state, ui_type, current_item, current_search } = this.state
    const { step, kyc_data_basic } = this.props
    // console.log('|||E S T A D O - -   K Y C', this.props.select_list)
    // console.log('F I N D B A R     K Y C', ui_type, kyc_data_basic[step-1].name, data_state, data_state[kyc_data_basic[step-1].name])
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
          search_result={ui_type === 'phone' ? (data_state.country_prefix ? data_state.country_prefix : null) :
                        ui_type === 'select' ? (data_state[kyc_data_basic[step-1].name] ? data_state[kyc_data_basic[step-1].name] : null): null}
          clean_search_result={this.clean_search_result}
        />
        <div id="expandibleKycPanel" className="expandibleKycPanel" style={{height:open_sect ? '65vh' : '0', opacity:open_sect ? '1': '0'}}>
        {/* <div id="expandibleKycPanel" className="expandibleKycPanel"> */}
          <div className={`contexpandibleKycPanel`}>
            {
              current_search &&
              <div className="contCountryList">
                {
                  current_search.map(item => {
                    return <div className="itemListCountry" key={item.id}>{item.name}</div>
                  })
                }
              </div>
            }
            {
              (ui_type === 'select' || ui_type === 'phone' && !current_search) &&
              <div className="contCountryList">
                {
                  this.props.select_list[(current_item === 'phone' || current_item === 'nationality') ? 'countries' : current_item].map(item => {
                    return <div className="itemListCountry" key={item.id}>{item.name}</div>
                  })
                }
              </div>
            }
          </div>
        </div>
      </div>
    )

  }

}


function mapStateToProps(state, props){

  const { user, user_id} = state.model_data


  return{
      ...state.form.form_kyc_basic,
      // form_kyc_basic_state:state.form.form_kyc_basic,
      // user:user[user_id]
  }

}

function mapDispatchToProps(dispatch){
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KycBasicContainer)
