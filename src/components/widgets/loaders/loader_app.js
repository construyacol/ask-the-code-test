import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SelectCountry from '../maps/select_country/select_country'
import Coinsenda from '../icons/logos/coinsenda.js'
import IconSwitch from '../icons/iconSwitch'
import './loader.css'

class LoaderAplication extends Component {

  state = {
    country:'colombia',
    progressBarWidth:0,
    anim:'in'
  }

  componentDidMount(){
    this.init_component()
    this.registerColors()
  }


  registerColors = () => {

  if((window && window.CSS) && window.CSS.registerProperty){
    window.CSS.registerProperty({
      name: '--primary',
      syntax: '<color>',
      inherits: true,
      initialValue: '#014c7d',
    });

    window.CSS.registerProperty({
      name: '--secondary',
      syntax: '<color>',
      inherits: true,
      initialValue: '#0198ff',
    });
  }


  }

// 'Actualizar el país del usuario'

  init_component = async(new_country) =>{

    const {
      user_data
    } = this.props

    const {
      token,
      userId,
      logOut,
      // email
    } = user_data
    console.log('|||||||| user_data ==>', user_data)

    const {
      action
    } = this.props


    const { country } = this.state
    let profile = await action.get_profile(userId, token)

    if(!profile){
      if(!new_country){return this.setState({country:null})}
      profile = await action.add_new_profile(new_country, token)
      action.Loader(false)
    }
    console.log('|||||||| profile res ==>', profile)

    if(!profile.countries[country] && !profile.countries[new_country]){return false}
    // console.log('===================================>>>>   profile', profile)
    // alert()

    // const{
    //   country,
    //   token
    // } = this.props
    //el country y el token deben llegar desde el auth service, si no llega el country es la primera vez del usuario


  // let user_with_token = {
  //
  // }
  // Primero validamos la legitimidad del token, para definir si el usuario esta loggedIn o el token no es valido
  // Si el token no es valido, borramos el token del localForage
  // si es valido continuamos con la validación del usuario y actualizamos el estado de authenticación a loggedIn:true


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
    let user_country = new_country ? new_country : country

    let res = await action.countryvalidators()

    if(!res){
      // return this.go_to_select_country()
      return logOut()
    }


    // Verificamos que el país sea valido, si no, retornamos al componente para seleccionar país
    if(!res.countries[user_country]){
      this.go_to_select_country()
      return false
    }
    await this.animation('out')
    await this.setState({country:user_country})
    await this.animation('in')



    // action.ToggleModal()
    // 1.2. con el country ya podemos comenzar a validar los demas endpoints, en ese momento automaticamente se crea el profile en (tx service)
    // Recuerda que el perfil se inicializa en el transaction service GET: /api/profiles/
    // este endpoint inicializa la normalización de los modelos, a partir de aquí ya tenemos user en redux

    // alert('llega')


    let pairs = await action.get_all_pairs(token, user_country)
    // return console.log('____________________pairs', pairs)
    if(!pairs){
      return logOut()
    }



    // 2.con el country y el token le pegamos a countryvalidators/get-existant-country-validator para inicializar el status
    // 3.Con el status inicializado, le pegamos al api identity POST: "status/get-status" para obtener el status del usuario(user_id, country) y comenzar a armar el modelo del mismo
    // 4.luego le pegamos a identity POST: "profiles/get-profile" &  para obtener el profile del usuario, si no retorna nada es porque el nivel de verificación del usuario es 0 y no tiene profile en identity
    // console.log('LoaderAplication', user)

    let user = await action.get_user(token, user_country, profile.userId, user_data.email, profile.restore_id)
    // console.log('===================================>>>>   tx profile', profile)
    // alert('user')
    if(!user){return false}



    // Seteamos el token del usuario al modelo en redux
    let user_update = {
      ...this.props.user,
      TokenUser:token
    }


    await action.update_user(user_update)
    await this.props.action.logged_in(true)

    // Si se carga desde este punto no podemos cargar los pares normalizados en la propiedad available pairs del modelo usuario porque no contamos con su id
    // await this.props.action.get_ref_code()


     await action.get_all_currencies()

    // let user_collection = [{primary:'ethereum'}]
    await action.get_pairs_for(this.props.user.country)

    await action.get_account_balances(this.props.user)
    await action.get_deposit_providers(this.props.user)
    await action.get_list_user_wallets(this.props.user)
    // return false
    // console.log('||||||||||||||| USER COUNTRY ::', this.props.user)
    let get_withdraw_providers = await action.get_withdraw_providers(this.props.user)
    await action.get_withdraw_accounts(this.props.user, get_withdraw_providers)

    // await action.get_deposit_list(this.props.user)
    // await action.get_swap_list()
    // await action.get_withdraw_list(this.props.user)

    let verification_state = await action.get_verification_state()

    // si al usuario se le ha rejectado o solo ha enviado la info de la verificación basica('personal') su verificación lo redirigimos hacia centro de seguridad
    if(verification_state !== 'accepted'){
      await this.props.action.AddNotification('security', null, 1)
      await this.props.history.push('/security')
      return action.ready_to_play(true)
    }

    await this.props.history.push('/wallets')
    return action.ready_to_play(true)

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





  componentDidUpdate(prevProps){
    if(prevProps.app_load_label !== this.props.app_load_label){
      let progressBarWidth = this.state.progressBarWidth
      this.setState({
        progressBarWidth: progressBarWidth+= 8
      })
    }
  }

  go_to_select_country = async() =>{
    await this.animation('out')
    await this.setState({country:null, progressBarWidth:0})
    await this.animation('in')
  }

  select_country = (new_country) =>{
    this.props.action.Loader(true)
    this.init_component(new_country)
  }

  animation = async(anim) =>{
    return new Promise(async(resolve, reject)=>{
      await this.setState({anim})
      setTimeout(()=>{
        return resolve(true)
      }, 300)
    })
  }


  render(){

    const{
      app_load_label
    } = this.props

    const{
      country,
      progressBarWidth,
      anim
    } = this.state


    // console.log('LoaderAplication RENDER((((()))))', user)

    return(
      <div className={`LoaderAplication ${!country ? 'withOutContry' : ''}`}>
        {
          // !country && available_countries ?
          !country ?
          <div className={`LoaderAplication loaderLayout ${anim}`}>
            <SelectCountry
              select_country={this.select_country}
            />
          </div>
          :
          <div className={`LoaderContainer loaderLayout ${anim}`}>
            <IconSwitch icon={country}  size={60}/>

            <div className="logotypes">
              <Coinsenda size={50} color="white"/>
              <h1 className="fuente">Coinsenda</h1>
            </div>
            {/* <Coinsenda color="#0198FF" size={70}/> */}
            {/* <SimpleLoader label={`${app_load_label}`} /> */}
            <p className="fuente">{app_load_label}</p>
          </div>
        }
        <div className="KycprogressBar loader">
          <div className="kycPropgressed" style={{width:`${progressBarWidth}%`}}></div>
        </div>
      </div>

    )
  }
}


function mapStateToProps(state, props){

  const { user, user_id,  wallets, all_pairs } = state.model_data
  // const { loader } = state.isLoading
  const { token } = props
  const { loggedIn } = state.auth
  // console.log('|||||| mapStateToProps', props)

  return{
    app_load_label:state.isLoading.app_load_label,
    user:user && user[user_id],
    wallets,
    all_pairs,
    // country:null,
    token:token,
    // loader,
    loggedIn
  }
}


function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (LoaderAplication)
