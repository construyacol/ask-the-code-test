import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { navigation_components } from '../api/ui/api.json'
import { Router, Switch, Route } from 'react-router-dom'
// import ActivityView from '../wallets/views/activity'
import AccountList from '../widgets/accountList/item_account_list'
import ItemWallet from '../widgets/accountList/items'
import SimpleLoader from '../widgets/loaders'
import PropTypes from 'prop-types'
// import { matchItem } from '../../services'



class WitdrawAccountContainer extends Component{

// userWallets, lo utilozamos para hacer validación de la respuesta del API

  state = {
    title:"Mis Cuentas de retiro",
  }


  componentDidMount(){
     // let path = this.props.match.path.replace('/', '')
     this.props.action.CurrentForm('bank')
     console.log('WithdrawAccount ====> ', this.props)
  }

  componentWillUnmount(){
    this.props.action.current_section_clean()
	}



  // init_sub_section = async(second_path, wallet_id) =>{
  //   this.props.action.section_view_to('detail')
  //   this.props.action.current_section_params({current_sub_section: second_path})
  //
  //
  //   let current_wallet = this.props.current_wallet
  //   // console.log('1!!!!!!!! CONSULTANDO::::::', current_wallet)
  //   if(!current_wallet){
  //     let wallet = await this.props.action.getWalletsById(wallet_id)
  //     if (wallet){
  //       if(!this.props.currencies){await this.props.action.get_all_currencies()}
  //       await this.get_short_currency(wallet)
  //       // console.log('1!!!!!!!! CONSULTANDO DESDE SERVER....::::::', wallet)
  //       return this.props.action.current_section_params({
  //         current_wallet:wallet
  //       })
  //     }
  //   }
  //   await this.get_short_currency(current_wallet)
  //   return current_wallet
  // }

  // get_short_currency = async(wallet) =>{
  //   if(this.props.currencies && wallet){
  //
  //     let currencies = this.props.currencies
  //     let currency_source = wallet.currency.currency
  //
  //     let currency = await matchItem(currencies, {primary:currency_source}, 'view')
  //     return this.props.action.current_section_params({
  //       short_name:currency.code
  //     })
  //   }
  // }

  // render_view = props =>{
  //   const { match } = props
  //   const { params } = match
  //   return(
  //     <Fragment>
  //       {
  //         params.path === 'activity' &&
  //         <ActivityView initial={this.init_sub_section} {...props}/>
  //       }
  //     </Fragment>
  //   )
  // }

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
      const { title }  = this.state
      const {withdraw_accounts, isAppLoaded } = this.props


      // console.log('|||||||||| °°°°°  WithdrawContainer  °°°°°||||||||||', this.props)

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
                          {/* <Route exact path="/withdraw" render={this.AccounList}  /> */}
                        {
                          !isAppLoaded ?
                            <SimpleLoader/>
                          :
                          (isAppLoaded && withdraw_accounts) &&
                          <Route exact path="/:primary_path" component={AccountList}  />
                        }
                    </DetailContainerLayout>
                  </Switch>
              </Router>
      )
    }
}



WitdrawAccountContainer.propTypes = {
  isAppLoaded:PropTypes.bool,
  currencies:PropTypes.array,
  current_wallet:PropTypes.object,
  user:PropTypes.object,
  withdraw_accounts:PropTypes.array
}




function mapStateToProps(state, props){

  const {
    user,
    user_id,
  } = state.modelData

  const {
    isAppLoaded
  } = state.isLoading

  // console.log('|||||||| withdraw_accounts', user[user_id], user[user_id].withdraw_accounts)

  return{
    withdraw_accounts:user[user_id].withdraw_accounts,
    user:user[user_id],
    current_wallet:state.ui.current_section.params.current_wallet,
    currencies:state.modelData.currencies || null,
    isAppLoaded
    // ready:user && withdraw_accounts && withdraw_providers
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WitdrawAccountContainer)
