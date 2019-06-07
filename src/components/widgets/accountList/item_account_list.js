import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../loaders'
import ItemWallet from './items'
import { AddNewItem } from '../buttons/buttons'
import { withRouter } from "react-router"
import IconSwitch from '../icons/iconSwitch'

import '../../wallets/views/wallet_views.css'

class WalletList extends Component{

  state = {
    label:`Obteniendo tus ${this.props.type_list === 'wallets' ? 'Billeteras' : 'Cuentas de retiro' }`,
    wallet_state:"done",
    id_wallet_action:null,
    verified:false,
    state_verification:null
  }

  componentDidMount(){
    // UpdateHistoryRouter
    // this.props.action.section_view_to('initial')
    // this.props.action.current_section_params({current_pair:null})
    // this.props.action.current_section_params({activity:false})
    const{
      match
    } = this.props
    let path = match.path.replace('/', '')
    this.props.action.current_section_clean()
    this.props.action.CurrentForm(path)
    this.init_component()
  }

  init_component = async() => {
    let state_verification = await this.props.action.get_verification_state()
    this.setState({state_verification})
    let verified = await this.props.action.user_verification_status('level_1')
    await this.setState({verified})
  }

  new_wallet = () => {

    if(this.state.state_verification === 'confirmed'){
      return this.wait_for_validate()
    }

    if(!this.state.verified){
      return this.wanna_validate()
    }
    this.props.action.ToggleModal()
  }

  no_action = () =>{}

  wait_for_validate = () =>{
    this.props.action.ConfirmationModalToggle()
    this.props.action.ConfirmationModalPayload({
      title:"Estamos trabajando en esto...",
      description:"Hemos recibido satisfactoriamente tus datos de verificación, en breve podrás operar en coinsenda.",
      txtPrimary:"Entendido",
      action:this.no_action,
      svg:"verified"
    })
  }

  goto_verification = async() => {
    // await this.props.action.section_view_to('initial')
    // console.log('|||||| goto_verification ======>', this.props.user)

    let verification_state = await this.props.action.get_verification_state()


    if(verification_state === 'confirmed' || verification_state === 'pending'){
      await this.props.action.ToStep('globalStep', 2)
    }


    if(verification_state === 'rejected'){
      await this.props.action.ToStep('globalStep', 0)
    }

    await this.props.history.push(`/security`)
    setTimeout(()=>{
      this.props.action.ToggleModal()
    },0)
  }


  wanna_validate = () =>{
    // console.log('lista', this.props.lista)
    // alert('wanna validate')
    let message = this.props.lista === 'wallets' ? 'billeteras crypto/fiat.' :
    this.props.lista === 'withdraw_accounts' ? ' cuentas de retiro fiat.' : ''

    this.props.action.ConfirmationModalToggle()
    this.props.action.ConfirmationModalPayload({
      title:"Aún no estas listo para esto...",
      description:`Debes completar el nivel de verificación avanzada para poder agregar ${message}`,
      txtPrimary:"Verificarme",
      txtSecondary:"Cancelar",
      payload:'account_id',
      action:(this.goto_verification),
      svg:"verified"
    })
  }


  delete_account = async(wallet_id, type) => {

    // this.props.action.Loader(true)
    this.setState({label:"Eliminando Wallet", wallet_state:"deleting", id_wallet_action:wallet_id})
    let wallet_delete = await this.props.action.delete_account(wallet_id, type)

    let msg = "Wallet eliminada con exito"
    let success = true

    if(wallet_delete === 404 || !wallet_delete){
       msg = "La wallet no se ha podido eliminar"
       success = false
    }

    this.props.action.exit_sound()
    this.setState({label:"Obteniendo tus Cuentas", wallet_state:"deleted"})
    type === 'withdraw' ? await this.props.action.get_withdraw_accounts(this.props.user, this.props.withdraw_providers, `{"where": {"userId": "${this.props.user.id}"}}`) : await this.props.action.get_list_user_wallets(this.props.user)


    this.props.action.mensaje(msg, success ? 'success' : 'error')
  }



  delete_account_confirmation = async(account_id, type) => {
    this.props.action.ConfirmationModalToggle()
    this.props.action.ConfirmationModalPayload({
      title:"Esto es importante, estas a punto de...",
      description:"Eliminar una cuenta, una vez hecho esto, no podrás recuperar los datos asociados a esta.",
      txtPrimary:"Eliminar",
      txtSecondary:"Cancelar",
      payload:account_id,
      action:(this.delete_account),
      img:"deletewallet",
      code:type === 'withdraw' ? "withdraw" : "wallet"
    })
  }


  render(){

    // console.log('|||||||   WALLET LIST   ||||',  this.props)

    const{
      lista
    } = this.props

    return(
      <Fragment>
        {
          (this.props.item_list && this.props.item_list.length>0)?
          <section id="WalletList">
            {
              this.props.item_list.map(wallet=>{
                return <ItemWallet
                  key={wallet && wallet.id}
                  deposit_providers={this.props.deposit_providers}
                  delete_account={this.delete_account_confirmation}
                  wallet={wallet}
                  history={this.props.history}
                  {...this.state}
                 />
              })
            }
          </section>
          :
          this.props.loader ?
          <SimpleLoader
            color="blue"
            label={this.state.label}
          />
          :
          (this.props.item_list.length<1 && !this.props.loader) &&
              lista === 'withdraw_accounts' ?
              <WithdrawAccountsScreen/>
              :
              <p id="WalletList2" >
                Aún no tienes billeteras agregadas, añade y gestiona Billeteras de Bitcoin, Ethereum, etc... para que puedas hacer retiros y depositos
              </p>
        }

        {
          (!this.props.loader)  &&
          <AddNewItem
            label={`${lista === 'withdraw_accounts' ? 'Añadir nueva cuenta de retiro' : 'Añadir nueva billetera'}`}
            type="primary"
            handleClick={this.new_wallet}
          />
        }

      </Fragment>
    )
  }
}


function mapStateToProps(state, props){

  const {
    lista
  } = props

  const{
    user,
    user_id,
    withdraw_providers
  } = state.model_data



  let withdraw_provider_list = (lista !== 'wallets' && user && withdraw_providers) && user[user_id].withdraw_providers.map(w_id=>{
    return withdraw_providers[w_id]
  })




  let item_list = []

  // console.log('ITEM LIST - - - - - -- - 1 1 1 | | | | | | |- - - - - :::', state.model_data[lista])

if(lista === 'withdraw_accounts'){
   user[user_id][lista].map((item_id)=>{
     if(state.model_data[lista][item_id].currency_type === 'crypto'){return false}
     if(!state.model_data[lista][item_id].visible){return false}
     // console.log('|||||||||| withdraw_account', state.model_data[lista][item_id])
         return item_list.push({
          active: true,
          app: "Coinsenda",
          available: null,
          country: null,
          currency: {currency: state.model_data[lista][item_id].account_type.ui_name},
          currency_type: state.model_data[lista][item_id].currency_type,
          dep_prov: [],
          address:state.model_data[lista][item_id].account_number.value,
          description:state.model_data[lista][item_id].bank_name.value,
          enabled: true,
          id: state.model_data[lista][item_id].id,
          internal: true,
          name:state.model_data[lista][item_id].bank_name.ui_name,
          reserved: 0,
          type: "withdraw",
          userId: user_id,
          used_counter:state.model_data[lista][item_id].used_counter,
          // inscribed:state.model_data[lista][item_id].inscribed
          // used_counter:0,
          inscribed:true
         })
   })
 }
 if(lista === 'wallets'){
   item_list = user[user_id][lista].map((item_id)=>{
   return state.model_data[lista][item_id]
   })
 }

 // console.log('|||||||||||||||||||||||||ITE_LIST', state.model_data.user[state.model_data.user_id])
 // console.log('|||||||||||||||||||||||||ITEM_LIST', item_list)

  return{
    item_list:item_list,
    type_list:lista,
    have_items:user[user_id][lista] && user[user_id][lista].length,
    deposit_providers:lista !== 'wallets' ? null : state.model_data.deposit_providers,
    withdraw_providers:withdraw_provider_list,
    user:state.model_data.user[state.model_data.user_id],
    loader:state.isLoading.loader
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (withRouter(WalletList))







const WithdrawAccountsScreen = () =>{

  return(
    <div className="withdraw_accounts_screen">
      <div className="withdraw_accounts_screen_cont">
        <IconSwitch icon="withdraw_account" size={110} color="#989898"/>
        <p id="WalletList2" className="fuente" >
          Aún no tienes cuentas de retiro agregadas, añade y gestiona retiros en tu moneda local.
        </p>
      </div>
    </div>
  )
}
