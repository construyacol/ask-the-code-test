import React, { Component, Fragment } from 'react'
import SimpleLoader from './'
import { connect } from 'react-redux'
import Environtment from '../../../environment'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'

class LoaderAplication extends Component {

  state = {
    country:null
  }

  componentDidMount(){
    this.init_component()
  }

// 'Actualizar el país del usuario'

  init_component = async() =>{

//1.recibo token y country del usuario
// 1.1. si el usuario no tiene country es por que es la primera vez que inicia sesión asi que le pedimos el country.
//
// 1.2. con el country ya podemos comenzar a validar los demas enpoints, en ese momento automaticamente se crea el profile en el transaction service
//
// 2.con el country y el token le pegamos a countryvalidators/get-existant-country-validator
//
// 3.luego le pegamos a "profiles/get-profile" & "status/get-status" para traer el status y el profile del usuario
//
// 4.continúa la carga de la aplicación

    const { IdentityService, TokenUser } = Environtment
    // si el usuario no tiene country es porque es la primera vez que entra, así que detenemos este flujo y
    // le pedimos su país de operaciones => select_country()
    if(!IdentityService.country){return this.setState({country:IdentityService.country})}

    this.setState({country:IdentityService.country})

    // console.log('|||||| - - init_component - - IdentityService', IdentityService)

    const {
      action
    } = this.props

    // action.ToggleModal()
    // await action.get_user('user_id')
    // await action.get_all_pairs(this.props.user)
    //
    // let user_collection = [{primary:'dash'}, {primary:'ethereum'}]
    // await action.get_pairs_for('colombia', user_collection)
    //
    // let get_withdraw_providers = await action.get_withdraw_providers(this.props.user)
    // await action.get_withdraw_accounts(this.props.user, get_withdraw_providers, `{"where": {"userId": "${this.props.user.id}"}}`)
    // await action.get_account_balances(this.props.user)
    // await action.get_deposit_providers(this.props.user)
    // await action.get_list_user_wallets(this.props.user)
    // await action.get_all_currencies()
    // await action.get_deposit_list(this.props.user)
    // await action.get_swap_list(this.props.user, this.props.wallets, this.props.all_pairs)
    // await action.get_withdraw_list(this.props.user)
    // await action.ready_to_play(true)



    // get_pairs_for(param1, param2)
    // recibe 2 parametros, país y colección de monedas de usuario(array)

    // Esta función define el estado de "model_data.pairs" donde contenemos:

    // localCurrency(Moneda local definida en función al país(param1))
    // collections(lista de todos los pares disponibles que cotizan en contra(secondary_currency) de la moneda local)
    // current_pair(define por defecto el par BTC/(moneda_local), en caso de no existir el par define el que haya disponible)
    // lastUpdate(fecha de la ultima actualización de las cotizaciones(collections))
    // user_collecion(cotizaciones personalizadas del usuario, comparamos las cotizaciones disponibles y las vistas disponibles de estas monedas, si hay matches actualizamos el estado)
  }


  select_country = () =>{

  }


  render(){

    const{
      app_load_label
    } = this.props

    // const{
    //   country
    // } = IdentityService

    console.log('|||||||  - - LoaderAplication', this.state)

    const styles = {
      width:'100%',
      height:'100%',
      display:'grid',
      alignItems:'center',
      justifyItems:'center'
    }

    return(
      <div className="LoaderAplication" style={styles}>
          <SimpleLoader label={`${app_load_label}`} />
      </div>
    )

  }

}

function mapStateToProps(state, props){
  // console.log('||||||||| LoaderAplication', state.isLoading.app_load_label)
  return{
    app_load_label:state.isLoading.app_load_label
  }
}


function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (LoaderAplication)
