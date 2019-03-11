import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../loaders'
import ItemWallet from './items'
import { AddNewItem } from '../buttons/buttons'
import { toast } from 'react-toastify'
import PropTypes from "prop-types"
import { withRouter } from "react-router"


import '../../wallets/views/wallet_views.css'

class WalletList extends Component{

  state = {
    label:`Obteniendo tus ${this.props.type_list === 'wallets' ? 'Billeteras' : 'Cuentas de retiro' }`,
    wallet_state:"done",
    id_wallet_action:null
  }

  componentDidMount(){
    // alert(this.props.history)
    // UpdateHistoryRouter
    // this.props.action.section_view_to('initial')
    // this.props.action.current_section_params({current_pair:null})
    // this.props.action.current_section_params({activity:false})

    const{
      match
    } = this.props

    let path = match.path.replace('/', '')
    // console.log('|||||||||| ACCOUNT LIST FIND HISTORY', path)

    this.props.action.current_section_clean()
    this.props.action.CurrentForm(path)
  }


  new_wallet = () => {
    this.props.action.ToggleModal()
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
    let wall = type === 'withdraw' ? await this.props.action.get_withdraw_accounts(this.props.user, this.props.withdraw_providers, `{"where": {"userId": "${this.props.user.id}"}}`) :
    await this.props.action.get_list_user_wallets(this.props.user)


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
      have_items
    } = this.props

    return(
      <Fragment>
        {
          (this.props.item_list.length>0)?
          <section id="WalletList">
            {
              this.props.item_list.map(wallet=>{
                return <ItemWallet
                  key={wallet.id}
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
          <p id="WalletList2" >Aún no tienes billeteras agregadas, añade y gestiona Billeteras de Bitcoin, Ethereum, etc... para que puedas hacer retiros y depositos</p>

        }

        {
          !this.props.loader &&
          <AddNewItem
            label="Añadir nueva billetera"
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

  let withdraw_provider_list = lista !== 'wallets' && user[user_id].withdraw_providers.map(w_id=>{
    return withdraw_providers[w_id]
  })

  let item_list = []

  // console.log('ITEM LIST - - - - - -- - 1 1 1 | | | | | | |- - - - - :::', state.model_data[lista])

if(lista !== 'wallets'){
   user[user_id][lista].map((item_id)=>{
     if(state.model_data[lista][item_id].currency_type === 'crypto'){return false}
         return item_list.push({
          active: true,
          app: "Coinsenda",
          available: null,
          country: null,
          currency: {currency: state.model_data[lista][item_id].account_type.ui_name},
          currency_type: state.model_data[lista][item_id].currency_type,
          dep_prov: [],
          address:state.model_data[lista][item_id].id_number,
          description:state.model_data[lista][item_id].bank_name.value,
          enabled: true,
          id: state.model_data[lista][item_id].id,
          internal: true,
          name:state.model_data[lista][item_id].bank_name.ui_name,
          reserved: 0,
          type: "withdraw",
          userId: user_id,
          used_counter:state.model_data[lista][item_id].used_counter
         })
   })
 }else{
   item_list = user[user_id][lista].map((item_id)=>{
   return state.model_data[lista][item_id]
   })
 }

 // console.log('|||||||||||||||||||||||||WalletList|||||||||||||||||||||||||||||||------------||||', state.model_data.user[state.model_data.user_id])

  return{
    item_list:item_list,
    type_list:lista,
    have_items:user[user_id][lista].length,
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
