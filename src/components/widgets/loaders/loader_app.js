import React, { Component, Fragment } from 'react'
import SimpleLoader from './'
import { connect } from 'react-redux'
import Environtment from '../../../environment'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SAmerica from '../maps/sAmerica'

import './loader_app.css'

class LoaderAplication extends Component {


  state = {
    available_countries:null
  }

  componentDidMount(){
    this.init_component()
  }

// 'Actualizar el país del usuario'

  init_component = async() =>{

    const{
      country,
      // TokenUser
    } = this.props

    this.load_countries()

    const { TokenUser } = Environtment

  //1.recibo token y country del usuario
  // 1.1. si el usuario no tiene country es por que es la primera vez que inicia sesión asi que le pedimos el country.
  // 1.2. con el country ya podemos comenzar a validar los demas enpoints, en ese momento automaticamente se crea el profile en el transaction service
  // 2.con el country y el token le pegamos a countryvalidators/get-existant-country-validator
  // 3.luego le pegamos a "profiles/get-profile" & "status/get-status" para traer el status y el profile del usuario
  // 4.continúa la carga de la aplicación

    // si el usuario no tiene country es porque es la primera vez que entra, así que detenemos este flujo y
    // le pedimos su país de operaciones => select_country()

    if(!country){return false}

    const {
      action,
      init_sockets
    } = this.props


    // action.ToggleModal()
    await action.get_user('user_id')
    await action.get_all_pairs(this.props.user)
    await init_sockets()

    let user_collection = [{primary:'dash'}, {primary:'ethereum'}]
    await action.get_pairs_for('colombia', user_collection)

    let get_withdraw_providers = await action.get_withdraw_providers(this.props.user)
    await action.get_withdraw_accounts(this.props.user, get_withdraw_providers, `{"where": {"userId": "${this.props.user.id}"}}`)
    await action.get_account_balances(this.props.user)
    await action.get_deposit_providers(this.props.user)
    await action.get_list_user_wallets(this.props.user)
    await action.get_all_currencies()
    await action.get_deposit_list(this.props.user)
    await action.get_swap_list(this.props.user, this.props.wallets, this.props.all_pairs)
    await action.get_withdraw_list(this.props.user)
    await action.ready_to_play(true)

    // get_pairs_for(param1, param2)
    // recibe 2 parametros, país y colección de monedas de usuario(array)

    // Esta función define el estado de "model_data.pairs" donde contenemos:

    // localCurrency(Moneda local definida en función al país(param1))
    // collections(lista de todos los pares disponibles que cotizan en contra(secondary_currency) de la moneda local)
    // current_pair(define por defecto el par BTC/(moneda_local), en caso de no existir el par define el que haya disponible)
    // lastUpdate(fecha de la ultima actualización de las cotizaciones(collections))
    // user_collecion(cotizaciones personalizadas del usuario, comparamos las cotizaciones disponibles y las vistas disponibles de estas monedas, si hay matches actualizamos el estado)
  }

  action_loader = (payload) =>{
    this.props.action.Loader(payload)
  }


  load_countries = async() =>{
    this.props.action.Loader(true)
    let res = await this.props.action.countryvalidators()
    if(!res){return false}

    console.log('load_countries', res[0].levels.level_1.personal.natural.country)
    return this.setState({
      available_countries:res[0].levels.level_1.personal.natural.country
    })
  }


  select_country = () =>{}


  render(){

    const{
      app_load_label,
      country,
      loader
    } = this.props

    const{
      available_countries
    } = this.state

    // const{
    //   country
    // } = IdentityService

    // console.log('|||||||  - - LoaderAplication', this.props)

    return(
      <div className="LoaderAplication" >
        {
          !country && available_countries ?
          <div className="selectCountry">
            <p>title</p>
            <SAmerica
              width={700}
              height={600}
              loader={loader}
              action_loader={this.action_loader}
              available_countries={available_countries}
            />
            <p>title</p>
          </div>
          :
           <SimpleLoader label={`${app_load_label}`} />
        }
      </div>

    )
  }
}


function mapStateToProps(state, props){

  // console.log('||||||||| LOADEER STATE', state)
  const { user, user_id, wallets, all_pairs } = state.model_data
  const { loader } = state.isLoading

  return{
    app_load_label:state.isLoading.app_load_label,
    user:user && user[user_id],
    wallets,
    all_pairs,
    country:null,
    loader
    // country:'colombia'
  }
}


function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (LoaderAplication)
