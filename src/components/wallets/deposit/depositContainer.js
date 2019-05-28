import React, { Component } from 'react'
import DepositLayout from './depositLayout'
import { connect } from 'react-redux'
// import { banks, coins } from '../../api/ui/api.json'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { toast, cssTransition } from 'react-toastify';
import btc from '../../../assets/btc.png'
import * as globalServices from '../../../services'
import './deposit.css'
import { SavePayment } from '../../widgets/toast/messages'
import { withRouter } from "react-router";



class DepositContainer extends Component {

  state = {
    type_currency:this.props.type_currency,
    // currency:this.props.currency,
    currency:this.props.current_wallet && this.props.current_wallet.currency.currency,
    short_currency_name:this.props.short_currency_name,
    short_bank_name:this.props.short_bank_name,
    amount:0,
    minAmount:null,
    deposit_way:this.props.deposit_way,
    deposit_service:this.props.deposit_service,
    service_mode:this.props.service_mode,
    itemActive:"",
    statusInput:"",
    final:false,
    finalButton:false,
    msgLoader:"",
    wallets_list:[],
    cost_id:this.props.cost_id,
    account_id:this.props.match.params && this.props.match.params.id,
    new_ticket:null,
    deposit_provider_list:null
  }

  componentDidMount(){
    this.props.action.CurrentForm('deposit')
    this.serve_deposit_provider_views()
    }

  update_control_form = (searchMatch) => {
    //esta función valida si tenemos un nombre item escrito y si tenemos un item coin/bank seleccionado, si cumple con esto, nos habilita el call to action para seguir hacia la proxima acción
    // console.log('update_control_form SE ESTA ACTUALIZANDO: ', searchMatch)


    if(this.props.search.length > 1){
      return  this.props.action.UpdateFormControl('deposit', false)
    }

    if (this.props.search.length === 1) {
      // Valido si hay una coincidencia en la busqueda y un nombre para el item que se esta creando, doy luz verde para continuar hacia el siguiente paso del formulario
      // console.log('esto es lo que pasa puto', this.props.search)
      return this.props.action.UpdateFormControl('deposit', true)
    }

    if(this.props.step === 3){
        if (this.state.deposit_service !=="") {
          return this.props.action.UpdateFormControl('deposit', true)
        }
      }

    if(this.props.step === 4){
        if (this.state.service_mode !=="") {
          return this.props.action.UpdateFormControl('deposit', true)
        }
    }
  }

  update_form = () => {
    this.props.action.UpdateForm('deposit', this.state)
  }

  // PASO1, SI ES EL PRIMER DEPOSITO SELECCIONAMOS EL TIPO DE MONEDA LA CUAL DESEAMOS DEPOSITAR
    select_currency = (itemName, short_name, currency_type) => {
      this.setState({
        itemActive:itemName,
        currency:itemName,
        short_currency_name:short_name,
        type_currency:currency_type
      })
      this.props.action.UpdateFormControl('deposit', true)
    }

  // SI SE SELECIONA CRYPTO, Y NO HAY WALLET DE ESA CUENTA, SE CREA UNA NUEVA, SINO LISTAMOS LAS WALLETS Y LA QUE ELIJA, LO ENVIAREMOS A DEPOSIT DE ESA WALLET SINO SE CONTINÚA CON EL FLUJO DEPOSITO DE FIAT, Y  SE PREESTABLECE LA CANTIDAD MINIMA DE DEPOSITO QUE SON 20.MIL COP
    primerDeposito = async() =>{

      let amountw = 20000
      await this.setState({
        amount:amountw
      })

      const{
        type_currency
      } = this.state

      this.update_form(this.state)
      // this.props.history.push("/wallets/deposit/5c04f873eb9c94511fd2edfa")
      // this.props.action.ToggleModal()
      // console.log('|||||||||||| PRIMER DEPOSITO', this.state.type_currency)

      let wallets = this.props.wallets

      // 1.Consultamos si hay wallets en el estado
      if(!wallets){
       this.setState({
         msgLoader:"Obteniendo tus billeteras"
       })

       this.props.action.Loader(true)
       let res = await this.props.action.get_list_user_wallets(this.props.user)
       this.props.action.Loader(false)
       if(!res){return this.handleError('No se han podido consultar tus Billeteras')}
       wallets = !res.entities.wallets ? [] : res.entities.wallets
      }


      // 2. hay wallets disponibles sobre la moneda solicitada?
      let current_wallets = await this.props.services.matchNormalizeWallet(wallets, this.state.currency)
          // 2.1 Si NO EXISTEN WALLETS en esta moneda, CREAMOS la wallet y entramos a this.wallet/deposit por medio de la ruta
          if(!current_wallets || current_wallets.length<1){
            await this.crearWallet()

            return this.props.action.CurrentForm('deposit')
            // return alert('PERRO, no tenemos wallets todavía, ya mismo creamos una..')
          }
          // 2.2, si existe solamente una wallet entonces ingrese automaticamente al deposito de esta wallet
          if(current_wallets.length===1 || (current_wallets.length >= 1 &&  type_currency === 'fiat')){
            let unica_wallet = current_wallets.pop()
            // return console.log(unica_wallet.id)
            if(this.state.type_currency !== 'fiat'){this.props.action.ToggleModal()}
            // this.props.action.ToggleModal()
            await this.to_deposit_wallet(unica_wallet.id)
            return this.props.action.CurrentForm('deposit')
          }

       // 3 Entonces muestre las wallets, para elegir en cual hacer el deposito...

       this.setState({
         wallets_list:current_wallets
       })
       return console.log('Eureka')
    }


    handleError = (msg) => {

      this.props.action.mensaje(msg, 'error')
      this.props.action.ToggleModal()
      this.props.action.CleanForm('deposit')
    }



    crearWallet = async() =>{

        this.props.action.Loader(true)
        this.setState({
          msgLoader:`Creando billetera ${this.state.currency}`
        })

          const body = {
           "data":{
               "userId": this.props.user.id,
               "name":`Mi nueva wallet ${this.state.currency}`,
               "description":"description",
               "country":this.props.user.settings.current_country,
               "currency": {
                  "currency": this.state.currency,
                  "is_token": false
                }
             }
          }

         const new_wallet = await this.props.action.create_new_wallet(body)

      // setTimeout(()=>{
        await this.props.action.get_list_user_wallets(this.props.user)

        this.props.action.Loader(false)
        this.to_deposit_wallet(new_wallet.account.id)
        if(this.state.type_currency !== 'fiat'){this.props.action.CleanForm('deposit')}
        let message = `¡Estas dentro de la nueva wallet ${this.state.currency}!`
        this.props.action.mensaje(message, 'success')

      // }, 1500)
    }




    to_deposit_wallet = id_wallet =>{
    return  this.props.history.push(`/wallets/deposit/${id_wallet}`)
    }

// PASO 1, DIGITAMOS EL MONTO DE FIAT QUE DESEAMOS COMPRAR
updateAmountOnState = async(amount) =>{
  // let amountw = await this.props.services.number_format(amount)
  await this.setState({
    amount:amount,
  })

  // this.props.action.UpdateFormControl('deposit', (!amount) ? false : (amount<20000) ? false : true)
}



// PASO 2, SELECCIONAMOS EL METODO DE PAGO....
  select_deposit_way = async(payload, deposit_way) => {

    await this.setState({
      cost_id:deposit_way === 'cash' ? 'en_efectivo' : 'otros_medios',
      deposit_way:deposit_way,
    })

    this.props.action.UpdateFormControl('deposit', true)
    this.update_form()
    await this.serve_deposit_provider_views(deposit_way === 'cash' ? 'en_efectivo' : 'otros_medios')
  }

  update_service_mode = async(value, short) =>{

    await this.setState({
      service_mode:short
    })
    await this.update_form()
    this.props.action.UpdateFormControl('deposit', true)

  }


// PASO 3, SELECCIONAMOS LA ENTIDAD BANCARIA POR LA CUAL PROCESAREMOS EL DEPOSITO....
    actualizarEstado = async(event, ppp) =>{
      const { short_name, value } = event.target
       this.update_local_state(value, short_name)
    }


    update_local_state = async(value, short_name) => {
      // console.log('Entidad bancaria',value, short_name)
      await this.setState({
        deposit_service:value,
        short_bank_name:short_name
      })

      this.update_form()
      this.update_control_form()

    }



  siguiente = (event) => {
    this.props.action.UpdateFormControl('deposit', false)
    this.update_form()
    this.props.action.IncreaseStep(this.props.current)
    // if(this.state.deposit_way === 'cash'){
    //     return this.props.action.IncreaseStep(this.props.current)
    // }

    if(!this.state.deposit_provider_list){
      return this.serve_deposit_provider_views()
    }

  }

  componentWillReceiveProps(props){
    const {
      match
    } = props

    this.setState({
     account_id:match.params && match.params.id
    })

  }


  finalizar = () =>{

    if(this.state.final){
      this.props.action.CurrentForm('wallets')
      // programamos la animación del nuevo deposito creado
      this.props.action.add_new_transaction_animation()
      this.props.action.CleanForm('deposit')

      return this.props.history.push(`/wallets/activity/${this.state.account_id}`)
    }

    this.setState({
      final:true,
      finalButton:true
    })

    setTimeout(()=>{
      this.setState({
        finalButton:false
      })
    }, 7000)
  }



  create_deposit_order = async() => {


    const {
      localCurrency,
      current_wallet,
      user,
      deposits,
      action,
      deposit_providers
    } = this.props

    const {
      amount,
      cost_id,
      deposit_service,
      account_id,
      deposit_provider_list,
      short_bank_name
    } = this.state


    // console.log('||||||||||   como envio los depositos', deposits)
    // console.log('create_deposit_order CURRENT_WALLET', current_wallet)
    // console.log('create_deposit_order PROPS', this.props)
    let deposit_provider_id = await deposit_providers.find(dep_prov => {
      return dep_prov.provider.name === short_bank_name || (cost_id === "en_efectivo" &&  dep_prov.provider_type === 'bank')
    })

    this.siguiente()
    this.props.action.Loader(true)

    let response = await this.props.action.create_deposit_order(
      current_wallet && current_wallet.currency,
      amount,
      current_wallet.id,
      cost_id,
      deposit_service,
      user,
      deposits,
      deposit_provider_id.id
    )
    // console.log('create_deposit_order response', response)

    if(!response){
      this.props.action.Loader(false)
      this.props.action.ReduceStep(this.props.current)
      return this.props.action.mensaje('No se ha podido crear la orden de deposito', 'error')
    }


    let new_deposit_model = {
      id:response.id,
      unique_id:response.unique_id,
      type_order:'deposit',
      ...response.deposit_info
    }

    // console.log('create_deposit_order new_deposit_model', new_deposit_model)

    // await this.props.action.get_deposit_list(user)
    await this.props.action.normalize_new_item(user, deposits, new_deposit_model, 'deposits')
    await this.props.action.update_activity_account(this.props.current_wallet.id, 'deposits')
    await this.props.action.update_pending_activity()

    // console.log('=> deposits UPDATE', this.props.deposits)

    // setTimeout(async()=>{
    //   await this.props.services.serve_activity_list(action.get_deposit_list, user, current_wallet, 'deposits')
    //   await this.props.action.update_activity_account(this.props.current_wallet.id, 'deposits')
    //   await this.props.action.update_pending_activity()
    // }, 5000)

    const { deposit_info } = response

    let new_deposit = [
      {
        ui_name:"Id deposito:",
        value:response.id,
        id:1
      },
      {
        ui_name:"Cantidad deposito:",
        value:`$ ${this.props.services.number_format(deposit_info.amount)} ${deposit_info.currency.currency}`,
        icon:deposit_info.currency.currency,
        id:2
      },
      {
        ui_name:"Costo deposito:",
        value:`$ ${this.props.services.number_format(deposit_info.cost)} ${deposit_info.currency.currency}`,
        id:3
      },
      {
        ui_name:"Total deposito:",
        value:`$ ${this.props.services.number_format(deposit_info.amount_neto)} ${deposit_info.currency.currency}`,
        id:4
      },
      {
        ui_name:"Debes depositar a:",
        value:deposit_provider_id.provider.ui_name,
        icon:deposit_provider_id.provider.name,
        id:5
      },
      {
        ui_name:deposit_provider_id.provider.account.account_id.ui_name,
        value:deposit_provider_id.provider.account.account_id.account_id,
        id:6
      },
      {
        ui_name:deposit_provider_id.provider.account.type.ui_name,
        value:deposit_provider_id.provider.account.type.type,
        id:7
      },
      {
        ui_name:deposit_provider_id.provider.account.bussines_name.ui_name,
        value:deposit_provider_id.provider.account.bussines_name.bussines_name,
        id:8
      }
    ]

    // setTimeout(()=>{
      this.props.action.Loader(false)
      // si la acción se lleva satisfactoriamente actualizamos el fondo del modal a un color verde
      this.props.action.ModalView('modalSuccess')
      this.props.action.success_sound()

      this.setState({
        new_ticket:new_deposit
      })
      return this.props.action.current_section_params({currentFilter:'deposits'})
    // }, 1500)
  }



  to_deposit_crypto = (wallet, history) =>{
    this.props.action.ToggleModal()
    return history.push(`wallets/deposit/${wallet.id}`)
  }



  // handleKeyPress = async(e) => {
  //   let message = await this.props.services.handleKeyPress(e, this.props.current)
  //   return this.setState({statusInput:message})
  // }



  guardarMetodo = () =>{

    toast('', {
       position: toast.POSITION.BOTTOM_RIGHT,
       pauseOnFocusLoss: false,
       draggablePercent: 60,
       className: "putito",
       bodyClassName: "putitoText",
       progressClassName: 'putitoProgress',
       toastId:2,
       autoClose: false
    });

    toast.update(2, {
      render: <SavePayment loader={true} label="Guardando Medio de pago"/>,
      autoClose: false
     })

    setTimeout(()=>{
      toast.update(2, {
        render: <SavePayment loader={false} label="Medio de pago Guardado"/>,
        autoClose: 1500
       })
    },3000)

  }



  serve_deposit_provider_views = async dep_provs =>{
    // @param dep_prov
    // otros_medios
    // en_efectivo
    const{
      deposit_providers
    } = this.props
    // console.log('||||===> deposit_providers', deposit_providers)
    let deposit_provider_list = []

    await deposit_providers.map(async dep_prov => {
      if(dep_prov.currency_type !== 'fiat'){return false}
      // console.log('serve_deposit_provider_views', dep_prov)
      let new_item = {
            code:dep_prov.provider.name,
            id:dep_prov.id,
            type:'bank',
            name:dep_prov.provider.ui_name,
            selection:false,
            min_amount:dep_prov.provider.min_amount
          }
        // console.log('dep_prov', dep_prov)
        await this.setState({minAmount:dep_prov.provider.min_amount})
        deposit_provider_list.push(new_item)
    })

    // console.log('===============> deposit_provider_list', deposit_provider_list)

    return this.setState({deposit_provider_list:deposit_provider_list.length<1 ? null : deposit_provider_list})

  }



  render(){
    // console.log('::: __PROPIEDADES_DEPOSITO__ ::', this.props.user)
    // console.log('::: __ESTADO_DEPOSITO__ ::', this.state)

    const{ deposit_provider_list } = this.state
    const { buttonActive, coins } = this.props

    // console.log('::: deposit_provider_list ::', deposit_provider_list)

    return(
      <DepositLayout
        buttonActive = {buttonActive}
        select_currency = {this.select_currency}
        siguiente = {this.siguiente}
        primerDeposito = {this.primerDeposito}
        updateAmountOnState={this.updateAmountOnState}
        select_deposit_way={this.select_deposit_way}
        actualizarEstado={this.actualizarEstado}
        update_control_form={this.update_control_form}
        update_service_mode={this.update_service_mode}
        create_deposit_order={this.create_deposit_order}
        finalizar={this.finalizar}
        update_local_state={this.update_local_state}
        // handleKeyPress={this.handleKeyPress}
        guardarMetodo={this.guardarMetodo}
        deposit={this.to_deposit_crypto}
        coins={coins}
        {...this.state}
        {...this.props}
      />
    )
  }
}

function mapStateToProps(state, props){
  // console.log('::: __ESTADO_DEPOSITO__ ::', state)
  // const { firstDeposit } = props

  const {
    short_bank_name,
    service_mode,
    deposit_way,
    step,
    short_currency_name,
    currency,
    type_currency,
    deposit_service,
    cost_id
  } = state.form.form_deposit

  const {
    short_name
  } = state.ui.current_section.params
  // console.log('::: __ESTADO_DEPOSITO__ ::', state.ui.current_section.params.current_wallet)

  const {
    user,
    user_id,
    deposit_providers,
    wallets,
    pairs,
    deposits,
    currencies
  } = state.model_data

  let deposit_providers_list =  user[user_id].deposit_providers.map(provider_id => {
    return deposit_providers[provider_id]
  })




  return{
    buttonActive:state.form.form_control_deposit,
    step:step,
    current:state.form.current,
    short_currency_name:short_currency_name ? short_currency_name : short_name,
    short_bank_name:short_bank_name,
    // currency:currency,
    deposit_service:deposit_service,
    type_currency:type_currency,
    cost_id:cost_id,
    loader:state.isLoading.loader,
    search:state.form.search_deposit,
    deposit_way:deposit_way,
    service_mode:service_mode,
    services:globalServices,
    redux_route:state.ui.menu_item_active,
    wallets:wallets,
    user:user[user_id],
    localCurrency:pairs.localCurrency,
    current_wallet:state.ui.current_section.params.current_wallet,
    deposits:deposits,
    coins:currencies,
    deposit_providers:deposit_providers_list
  }

}




function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (withRouter(DepositContainer))
