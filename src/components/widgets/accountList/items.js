import React, { Component, Fragment } from 'react'
import './item_wallet.css'
import backcard from '../../../assets/wallet_coins/back.png'
import Imgcop from '../../../assets/wallet_coins/cop2.png'
import { withRouter } from "react-router";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import IconSwitch from '../icons/iconSwitch'
import PopNotification from '../notifications'
import BalanceComponent from '../balance/balance'
import SimpleLoader from '../loaders'
import PropTypes from 'prop-types'
import withCoinsendaServices from '../../withCoinsendaServices';


export class ItemWallet extends Component {

  state = {
    current_wallet:this.props.wallet,
    device:window.innerWidth
  }

componentDidMount(){
  // this.update_deposit_provider()
}

   update_deposit_provider = async(init) =>{

    const { deposit_providers, wallet } = this.props
    const { dep_prov } = this.props.wallet
    // console.log('||||||||||||||||||||||||||||||| UPDATE DEPOSIT CURRENT WALL', deposit_providers, wallet)
    // alert('deposit provider')

    // this.props.action.update_deposit_provider(init, deposit_providers, wallet, dep_prov)
    let current_wallet = wallet
    if(dep_prov.length>0 && deposit_providers){

      let provider_index = (this.props.wallet.dep_prov.length)-1
      let provider_id = this.props.wallet.dep_prov[provider_index]

         let result = deposit_providers[provider_id]
         current_wallet = {
              ...this.props.wallet,
              deposit_provider:result
            }
          this.setState({
           current_wallet:current_wallet
         })

     }
     if(!init){
       await this.props.action.current_section_params({current_wallet:current_wallet})
     }
     return true
  }


  wallet_detail = async() => {

    this.props.action.cleanNotificationItem('wallets', 'account_id')
    if(this.props.current === "deposit"){
      // Esto valida cuando estoy en el formulario deposito en una lista de wallets existentes, osea cierra el modal
      await this.props.action.toggleModal()
      await this.update_deposit_provider()
      return this.props.history.push(`/wallets/deposit/${this.props.wallet.id}`)
    }
    this.update_deposit_provider()
    return this.props.history.push(`/wallets/activity/${this.props.wallet.id}`)

  }

  delete_this_account = async() => {
    const{
      wallet
    } = this.props

    const{
      type
    } = wallet

    await this.props.coinsendaServices.deleteAccount(this.props.wallet.id, type === 'withdraw' ? 'withdraw' : 'wallet')
    // console.log('CUENTA ELIMINADA', deleteA)
  }


  depositar = async() =>{


    if(this.props.wallet.currency_type === 'fiat'){
      // await this.props.action.current_section_params({current_wallet:null})

      // await this.update_deposit_provider()
      // console.log('ItemWallet', this.state)
      let verified = await this.props.coinsendaServices.getUserVerificationStatus('level_1')
      this.props.action.FiatDeposit(this.props.localCurrency)
      if(verified){this.props.action.toggleModal()}
      this.props.history.push(`/wallets/deposit/${this.props.wallet.id}`)
      return this.props.action.current_section_params({current_wallet:this.state.current_wallet, deposit_direct_access:true})
    }

    this.update_deposit_provider()
    return this.props.history.push(`/wallets/deposit/${this.props.wallet.id}`)
  }

  withdraw = async() =>{

    if(this.props.wallet.currency_type === 'fiat'){

      // this.props.action.FiatDeposit(this.props.localCurrency)
      let verified = await this.props.coinsendaServices.getUserVerificationStatus('level_1')
      this.props.history.push(`/wallets/withdraw/${this.props.wallet.id}`)
      await this.props.action.CurrentForm('withdraw')
      if(verified){this.props.action.toggleModal()}
      return this.props.action.current_section_params({current_wallet:this.state.current_wallet, deposit_direct_access:true})
    }

    this.update_deposit_provider()
    return this.props.history.push(`/wallets/withdraw/${this.props.wallet.id}`)

  }

  swap_detail = () =>{
    return this.props.history.push(`/wallets/swap/${this.props.wallet.id}`)
  }

  componentWillReceiveProps(props){
    // console.log('componentWillReceiveProps - - ITEMS:::', props)
  }


  render(){

    // console.log('||||||||°°°°°CURRENT_WALLET_BALANCE', this.props)

    const {
      wallet,
      current,
      current_view,
      account_state,
      id_wallet_action,
      balances,
      clases
    } = this.props

    const {
      currency,
      name,
      id,
      type,
      description,
      used_counter,
      inscribed,
      address
    } = wallet

    let notifier_type = type === 'trade' ? 'wallets' : type

    let id_trigger = id_wallet_action === id && true
   // console.log('|||||||||||| - - - - - este es el estado de la wallet - - - ', wallet, inscribed)

    return(
    <Fragment>
      <div className={` contWalleins ${clases} ${account_state === 'deleting' && id_trigger ? 'WIwalletDeleting' : account_state === 'deleted' && id_trigger ? 'WIwalletDeleted' : ''}`}>

              <div
                id="ItemWallet"
                className={` ${account_state === 'deleted' && id_trigger ? 'WIitemDeleted' : ''} ${current === 'deposit'?'ItemWallet2':'ItemWallet'} ${type !== 'withdraw' ? currency.currency : type === 'withdraw' && !inscribed ? 'NoInscribed' : 'cop'} ${type !== 'withdraw' ? 'cryptoWallet' : ''}`}
                // className={`ItemWallet ${currency.currency}`}
                >
                  <div className={`ItemWCta ${(current_view === 'detail' || type === 'withdraw') ? 'noVisible' : ''}`} onClick={this.wallet_detail} ></div>

                  <div className={`ItemBarra ${type} ${(current_view === 'detail') ? 'noVisible' : ''}`} >

                    <div className={`ItemBarraI ${type === 'withdraw' ? 'noVisible' : ''}`}>
                      <i className="far fa-arrow-alt-circle-up IRetiro IdeleteButton tooltip" onClick={this.withdraw}>
                        <span className="tooltiptext2 fuente">Retirar</span>
                      </i>
                    </div>

                    <div className={`ItemBarraI ${type === 'withdraw' ? 'noVisible' : ''}`}>
                      <i className="far fa-arrow-alt-circle-down Ideposit IdeleteButton tooltip" onClick={this.depositar}>
                        <span className="tooltiptext2 fuente">Depositar</span>
                      </i>
                    </div>

                    <div className="ItemBarraI retweetCont">
                      <i className="fas fa-trash-alt IdeleteButton tooltip" onClick={this.delete_this_account}>
                        <span className="tooltiptext2 fuente">Borrar</span>
                      </i>
                      {/* {
                        type === 'withdraw' ?
                        <i className="fas fa-trash-alt IdeleteButton tooltip" onClick={this.delete_this_account}>
                          <span className="tooltiptext2 fuente">Borrar</span>
                        </i>
                        :
                        <i className="fas fa-retweet tooltip" onClick={this.swap_detail}>
                          <span className="tooltiptext2 fuente">Swap</span>
                        </i>
                      } */}
                    </div>
                  </div>

                <img src={backcard} id="backCard" alt="" width="100%" height="100%"/>
                {
                  type === 'withdraw' ?
                  <div className="iconBank">
                    <IconSwitch icon={description} size={100}/>
                  </div>
                  :
                  <img id="imgCurrency" src={require(`../../../assets/wallet_coins/${currency.currency === 'cop' ? 'fiat' : currency.currency === 'usd' ? 'fiat' :currency.currency}.png`)} alt="" height="100%"/>
                }

                <h1 className="IWText titu fuente tobe_continue">{name ? name : 'Mi cartera crypto'} <PopNotification notifier={notifier_type} item_type="account_id" id={id} type="new"/></h1>
                  <p className="IWText fuente IWcurrencyText tobe_continue">
                    {
                      currency.currency === 'cop' &&
                      <img src={Imgcop} id="Imgfiat" alt="" height="20"/>
                    }

                    {
                     currency.currency === 'cop' ? '(COP)' :
                     currency.currency === 'usd' ? 'Dolar (USD)' : currency.currency
                    }
                  </p>
                    {/* {
                      this.state.current_wallet.deposit_provider &&
                        <p className="IWText fuente tobe_continue"> {this.state.current_wallet.deposit_provider.provider.account.account_id} </p>
                    } */}

                    {
                      type === 'withdraw' &&
                      <p className="IWText fuente2 IWLittleTitle">No. {address}</p>
                    }

                    {
                      type === 'withdraw' ?
                      <Fragment>
                        <div className="contSuscribed">
                          {
                            !inscribed ?
                            <div className="contLoader2">
                              <SimpleLoader color="white" loader={2}/>
                            </div>
                            :
                            <i className="far fa-check-circle"></i>
                          }
                          <p className="IWText fuente IWLittleTitle">{inscribed && used_counter>0 ? 'Aprobada' : inscribed ? 'inscrita' : 'Inscribiendo'}</p>
                        </div>
                        <p className="IWText fuente IWLittleTitle" style={{display:used_counter<1 ? 'none' : 'flex'}}>Movimientos: {used_counter}</p>
                      </Fragment>
                      :
                      <Fragment>
                        {
                          balances ?
                          <BalanceComponent account_id={id} />
                          :
                          <div className="loadItem">
                            <SimpleLoader color="white"/>
                          </div>
                        }
                      </Fragment>
                    }

              </div>
            </div>
      </Fragment>
    )
  }
}


ItemWallet.propTypes = {
  current:PropTypes.string,
  balances:PropTypes.object,
  current_view:PropTypes.string,
  delete_account:PropTypes.func,
  deposit_providers:PropTypes.object,
  label:PropTypes.string,
  localCurrency:PropTypes.string,
  user:PropTypes.object,
  verified:PropTypes.bool,
  wallet:PropTypes.object,
  account_state:PropTypes.string
}








function mapStateToProps(state, props){

  const {
    wallet
  } = props

  const{
    balances
  } = state.modelData



  // console.log('||||||||°°°°°CURRENT_WALLET', balances && balances[wallet.id])

  return{
    current:state.form.current,
    balances:balances ? balances[wallet.id] : null,
    current_view:state.ui.current_section.view,
    localCurrency:state.modelData.pairs.localCurrency,
    user:state.modelData.user
  }

}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

// export default ItemWallet
export default withRouter(connect(mapStateToProps, mapDispatchToProps) (withCoinsendaServices(ItemWallet)))
