import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../loaders'
// import ItemWallet from './items'
import ItemAccount from './item_account'
import { AddNewItem } from '../buttons/buttons'
import { withRouter } from "react-router"
import IconSwitch from '../icons/iconSwitch'
import PropTypes from 'prop-types'
import { AccountListContainer } from './styles'

import '../../wallets/views/wallet_views.css'

class AccountList extends Component{

  state = {
    label:`Obteniendo tus ${this.props.path === 'wallets' ? 'Billeteras' : 'Cuentas de retiro' }`,
    account_state:"done",
    id_wallet_action:null,
    verified:false,
    state_verification:null
  }

  componentDidMount(){
    // UpdateHistoryRouter
    // this.props.action.section_view_to('initial')
    // this.props.action.current_section_params({current_pair:null})
    // this.props.action.current_section_params({activity:false})
    // const{
    //   match
    // } = this.props
    // let path = match.path.replace('/', '')
    this.props.action.current_section_clean()
    // this.props.action.CurrentForm(this.props.match.params.primary_path)
    // console.log('|||||||||||||||| ==============>>> pathname', this.props.match.params.primary_path)
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
    let message = this.props.path === 'wallets' ? 'billeteras crypto/fiat.' :
    this.props.path === 'withdraw_accounts' ? ' cuentas de retiro fiat.' : ''

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


  delete_account = async(account_id, type) => {

    // this.props.action.Loader(true)
    this.setState({label:"Eliminando Wallet", account_state:"deleting", id_wallet_action:account_id})
    let wallet_delete = await this.props.action.delete_account(account_id, type)

    let msg = "Wallet eliminada con exito"
    let success = true

    if(wallet_delete === 404 || !wallet_delete){
       msg = "La wallet no se ha podido eliminar"
       success = false
    }

    this.props.action.exit_sound()
    this.setState({label:"Obteniendo tus Cuentas", account_state:"deleted"})
    type === 'withdraw_accounts' ? await this.props.action.get_withdraw_accounts(this.props.user, this.props.withdraw_providers) : await this.props.action.get_list_user_wallets(this.props.user)


    this.props.action.mensaje(msg, success ? 'success' : 'error')
  }



  // delete_account_confirmation = async(account_id, type) => {
  //   this.props.action.ConfirmationModalToggle()
  //   this.props.action.ConfirmationModalPayload({
  //     title:"Esto es importante, estas a punto de...",
  //     description:"Eliminar una cuenta, una vez hecho esto, no podrás recuperar los datos asociados a esta.",
  //     txtPrimary:"Eliminar",
  //     txtSecondary:"Cancelar",
  //     payload:account_id,
  //     action:(this.delete_account),
  //     img:"deletewallet",
  //     code:type === 'withdraw' ? "withdraw" : "wallet"
  //   })
  // }


  render(){

    const{
      path
    } = this.props

    // console.log('||||||||||||||||||||||||||||||||||||||| ================== item_list ==================> ', this.props.item_list)

    return(
      <Fragment>
        {
          (this.props.item_list && this.props.item_list.length>0)?
            <AccountListContainer>
              {
                this.props.item_list.map((account, id)=>{
                  if(!account.visible){return null}
                  return <ItemAccount
                    key={id}
                    account={account}
                    account_type={path}
                    actions
                    {...this.props}
                  />
                })
              }
            </AccountListContainer>
          :
          this.props.loader ?
          <SimpleLoader
            color="blue"
            label={this.state.label}
          />
          :
          (this.props.item_list.length<1 && !this.props.loader) &&
             <AccountsNotFound account_type={path} />
        }

        {
          (!this.props.loader)  &&
          <AddNewItem
            label={`${path === 'withdraw_accounts' ? 'Añadir nueva cuenta de retiro' : 'Añadir nueva billetera'}`}
            type="primary"
            handleClick={this.new_wallet}
          />
        }

      </Fragment>
    )
  }
}




AccountList.propTypes = {
  all_pairs:PropTypes.object,
  app_loaded:PropTypes.bool,
  currencies:PropTypes.array,
  current_wallet:PropTypes.object,
  deposit_providers:PropTypes.object,
  have_items:PropTypes.number,
  item_list:PropTypes.array,
  loader:PropTypes.bool,
  path:PropTypes.string,
  user:PropTypes.object
}




function mapStateToProps(state, props){


  let path = props.match.params.primary_path
  // console.log('||||||||||||||||||||||||||||||||||||||| ================== path ==================> ', props)

  const{
    user,
    user_id,
    withdraw_providers
  } = state.model_data

  let withdraw_provider_list = (path !== 'wallets' && user && withdraw_providers) && user[user_id].withdraw_providers.map(w_id=>{
    return withdraw_providers[w_id]
  })

  let item_list = []


   item_list = user[user_id][path].map((item_id)=>{
     if(path === 'withdraw_accounts' && state.model_data[path][item_id].currency_type === 'crypto'){return false}
   return state.model_data[path][item_id]
   })

  return{
    item_list:item_list,
    path,
    have_items:user[user_id][path] && user[user_id][path].length,
    deposit_providers:path !== 'wallets' ? null : state.model_data.deposit_providers,
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


export default connect(mapStateToProps, mapDispatchToProps) (withRouter(AccountList))







const AccountsNotFound = ({account_type}) =>{

  return(
    <div className="withdraw_accounts_screen">
      <div className="withdraw_accounts_screen_cont">
        <IconSwitch icon="withdraw_account" size={110} color="#989898"/>
        <p id="WalletList2" className="fuente" >
          {
            account_type === 'withdraw_accounts' ?
            'Aún no tienes cuentas de retiro agregadas, añade y gestiona retiros en tu moneda local.'
            :
            'Aún no tienes billeteras agregadas, añade y gestiona Billeteras de Bitcoin, Ethereum, etc... para que puedas hacer retiros y depositos'
          }
        </p>
      </div>
    </div>
  )
}
