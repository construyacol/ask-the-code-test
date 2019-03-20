import React, { Component, Fragment } from 'react'
import SimpleLoader from './'
import { connect } from 'react-redux'
import Environtment from '../../../environment'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { InputCountry } from '../inputs'
import SelectCountry from '../maps/select_country/select_country'
import './loader.css'


class LoaderAplication extends Component {

  state = {
    country:this.props.country
  }

  componentDidMount(){
    this.init_component()
  }

// 'Actualizar el país del usuario'

  init_component = async(new_country) =>{

    const{
      country,
      token
    } = this.props //el country y el token deben llegar desde el auth service, si no llega el country es la primera vez del usuario


  //1.recibo token y country del usuario
  // 1.1. si el usuario no tiene country es por que es la primera vez que inicia sesión asi que le pedimos el country.
  // 1.2. con el country ya podemos comenzar a validar los demas endpoints, en ese momento automaticamente se crea el profile en el transaction service, primer endpoint POST:get_all_pairs
  // 2.con el country y el token le pegamos a countryvalidators/get-existant-country-validator para inicializar el status
  // 3.Con el status inicializado, le pegamos al api identity POST: "status/get-status" para obtener el status del usuario(user_id)

  // 4.luego le pegamos a identity POST: "profiles/get-profile" &  para obtener el profile del usuario, si no retorna nada es porque el nivel de verificación del usuario es 0 y no tiene profile en identity
  // 5.continúa la carga de la aplicación
    // si el usuario no tiene country es porque es la primera vez que entra, así que detenemos este flujo y
    // le pedimos su país de operaciones => select_country()

    if(!country && !new_country ){return false}
    let user_country = country ? country : new_country
    this.setState({country:user_country})
    const {
      action,
      init_sockets
    } = this.props

    // action.ToggleModal()
    // 1.2. con el country ya podemos comenzar a validar los demas endpoints, en ese momento automaticamente se crea el profile en (tx service)
    // Recuerda que el perfil se inicializa en el transaction service GET: /api/profiles/
    await action.get_all_pairs(token, user_country)

    // 2.con el country y el token le pegamos a countryvalidators/get-existant-country-validator para inicializar el status
    // 3.Con el status inicializado, le pegamos al api identity POST: "status/get-status" para obtener el status del usuario(user_id, country) y comenzar a armar el modelo del mismo
    // 4.luego le pegamos a identity POST: "profiles/get-profile" &  para obtener el profile del usuario, si no retorna nada es porque el nivel de verificación del usuario es 0 y no tiene profile en identity
    // console.log('LoaderAplication', user)
    let user = await action.get_user(token, user_country)
    if(!user){return false}

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


// ------------------------------------------------------------------------------------------------


    // get_pairs_for(param1, param2)
    // recibe 2 parametros, país y colección de monedas de usuario(array)

    // Esta función define el estado de "model_data.pairs" donde contenemos:

    // localCurrency(Moneda local definida en función al país(param1))
    // collections(lista de todos los pares disponibles que cotizan en contra(secondary_currency) de la moneda local)
    // current_pair(define por defecto el par BTC/(moneda_local), en caso de no existir el par define el que haya disponible)
    // lastUpdate(fecha de la ultima actualización de las cotizaciones(collections))
    // user_collecion(cotizaciones personalizadas del usuario, comparamos las cotizaciones disponibles y las vistas disponibles de estas monedas, si hay matches actualizamos el estado)

  }


  select_country = (new_country) =>{
    this.init_component(new_country)
  }


  render(){

    const{
      app_load_label,
      loader,
      user
    } = this.props

    const{
      country
    } = this.state

    console.log('LoaderAplication RENDER((((()))))', user)

    return(
      <div className="LoaderAplication" >
        {
          // !country && available_countries ?
          !country ?
          <SelectCountry
            select_country={this.select_country}
          />
          :
           <SimpleLoader label={`${app_load_label}`} />
        }
      </div>

    )
  }
}


function mapStateToProps(state, props){

  const { user, user_id,  wallets, all_pairs } = state.model_data
  const { loader } = state.isLoading
  const { TokenUser } = Environtment


  return{
    app_load_label:state.isLoading.app_load_label,
    user:user && user[user_id],
    wallets,
    all_pairs,
    country:null,
    // country:'colombia',
    token:TokenUser,
    loader
  }
}


function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (LoaderAplication)
