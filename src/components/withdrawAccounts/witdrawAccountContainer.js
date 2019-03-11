import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { navigation_components } from '../api/ui/api.json'
import { Router, Switch, Redirect, Link, Route } from 'react-router-dom'
// import { BrowserRouter as Router, Switch, Redirect, Link, Route } from 'react-router-dom'
import ActivityView from '../wallets/views/activity'

// import WalletList from './views/walletList'
import WithdrawAccountList from '../widgets/accountList/item_account_list'
import list_wallets_data from '../api/ui/model_account.json'
import ItemWallet from '../widgets/accountList/items'
import SimpleLoader from '../widgets/loaders'

import { matchItem } from '../../services'

class witdrawAccountContainer extends Component{

// userWallets, lo utilozamos para hacer validación de la respuesta del API

  state = {
    title:"Mis Cuentas de retiro",
    userWallets:true, //solo lo uso para validar si se estan haciendo consultas al API
  }


  componentDidMount(){
     this.props.action.MenuItemActive('withdraw')
  }

  componentWillUnmount(){
    this.props.action.current_section_clean()
	}


  AccounList = () => {
    return(
      <WithdrawAccountList lista="withdraw_accounts" {...this.props} />
    )
  }


  init_sub_section = async(second_path, wallet_id) =>{
    this.props.action.section_view_to('detail')
    this.props.action.current_section_params({current_sub_section: second_path})


    let current_wallet = this.props.current_wallet
    // console.log('1!!!!!!!! CONSULTANDO::::::', current_wallet)
    if(!current_wallet){
      let wallet = await this.props.action.get_wallet_by_id(wallet_id)
      if (wallet){
        if(!this.props.currencies){await this.props.action.get_all_currencies()}
        await this.get_short_currency(wallet)
        // console.log('1!!!!!!!! CONSULTANDO DESDE SERVER....::::::', wallet)
        return this.props.action.current_section_params({
          current_wallet:wallet
        })
      }
    }
    await this.get_short_currency(current_wallet)
    return current_wallet
  }

  get_short_currency = async(wallet) =>{
    if(this.props.currencies && wallet){

      let currencies = this.props.currencies
      let currency_source = wallet.currency.currency

      let currency = await matchItem(currencies, {primary:currency_source}, 'view')
      return this.props.action.current_section_params({
        short_name:currency.code
      })
    }
  }

  render_view = props =>{
    const { match } = props
    const { params } = match
    return(
      <Fragment>
        {
          params.path === 'activity' &&
          <ActivityView initial={this.init_sub_section} {...props}/>
        }
      </Fragment>
    )
  }

  wallet_detail = props => {
    // console.log('this is america___', props)
    // console.log('this is AMERICAAA!!!', this.props)
    return(
      <Fragment>
        {
          this.props.current_wallet &&
          <section className="WalletContainer">
            <ItemWallet
            //   deposit_providers={this.props.deposit_providers}
            //   delete_wallet={this.delete_wallet_confirmation}
              wallet={this.props.current_wallet}
              history={props.history}
             />
           </section>
        }
      </Fragment>
    )
  }


    render(){

      const { items_menu } = navigation_components.wallet
      const url = this.state.currentUrl
      const { title }  = this.state
      const { ready } = this.props

      // console.log('|||||||||| °°°°°  WalletContainer  °°°°°||||||||||', this.props.history)

      return(
              <Router
                history={this.props.history}
              >
                  <Switch>
                    <DetailContainerLayout
                        items_menu={items_menu}
                        title={title}
                        {...this.props}
                        {...this.state}
                      >
                          {/* <Route exact path="/withdraw/:path/:id" component={this.wallet_detail} /> */}
                        {
                          (!this.state.userWallets) ?
                          <p className="fuente">Ooops!, ha ocurrido algo inesperado posiblemente con la conexión, vuelve a intentarlo</p>
                           :
                           <Fragment>{
                                      ready ?
                                        <Route exact path="/withdraw" render={this.AccounList}  />
                                      :
                                        <SimpleLoader/>
                                     }

                                   {/* <Route exact path="/wallets/:path/:id" component={this.render_view} /> */}
                           </Fragment>
                        }
                    </DetailContainerLayout>
                  </Switch>
              </Router>
      )
    }
}




function mapStateToProps(state, props){

  const {
    user,
    user_id,
    withdraw_accounts,
    withdraw_providers
  } = state.model_data

  return{
    redux_route:state.ui.menu_item_active,
    user:user[user_id],
    current_wallet:state.ui.current_section.params.current_wallet,
    currencies:state.model_data.currencies || null,
    ready:user && withdraw_accounts && withdraw_providers
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(witdrawAccountContainer)
