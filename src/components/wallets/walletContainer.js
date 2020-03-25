import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions'
import { bindActionCreators } from 'redux'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { navigation_components } from '../api/ui/api.json'
import { Router, Switch, Route } from 'react-router-dom'
import DepositView from './views/deposit'
import ActivityView from './views/activity'
import WithdrawView from './views/withdraw'
import SwapView from './views/swap'
import AccountList from '../widgets/accountList/item_account_list'
import ItemAccount from '../widgets/accountList/item_account'
// import ItemAccount from './item_account'

import SimpleLoader from '../widgets/loaders'
import PropTypes from 'prop-types'

import { matchItem } from '../../services'


class WalletContainer extends Component{

// userWallets, lo utilozamos para hacer validación de la respuesta del API

  state = {
    title:"Mis billeteras",
    userWallets:true, //solo lo uso para validar si se estan haciendo consultas al API
  }


  componentDidMount(){
    let path = this.props.match.path.replace('/', '')
    this.props.action.CurrentForm(path)
  }

  componentWillUnmount(){
    this.props.action.section_view_to('initial')
    this.props.action.current_section_clean()
	}



  init_sub_section = async(second_path, wallet_id) =>{
    // this.props.action.section_view_to('detail')
    // this.props.action.current_section_params({current_sub_section: second_path})
    //
    //
    // let current_wallet = this.props.current_wallet
    // // console.log('1!!!!!!!! CONSULTANDO::::::', current_wallet)
    // if(!current_wallet){
    //   let wallet = await this.props.action.get_wallet_by_id(wallet_id)
    //   // console.log('|||||||||||||  init_sub_section', wallet, wallet_id)
    //   if (wallet){
    //     if(!this.props.currencies){await this.props.action.get_all_currencies()}
    //     await this.get_short_currency(wallet)
    //     // console.log('1!!!!!!!! CONSULTANDO DESDE SERVER....::::::', wallet)
    //     return this.props.action.current_section_params({
    //       current_wallet:wallet
    //     })
    //   }
    // }
    // await this.get_short_currency(current_wallet)
    // return current_wallet
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
    // console.log('||||||||||||||||||||| ===============>>>> ACTIVITY ==>', props)
    return(
      <Fragment>
        {
          params.path === 'deposit' ?
          <DepositView initial={this.init_sub_section} {...props}/>
          :
          params.path === 'withdraw' ?
          <WithdrawView initial={this.init_sub_section} {...props}/>
          :
          (params.path === 'swap' && this.props.all_pairs) &&
          <SwapView initial={this.init_sub_section} {...props}/>
        }
      </Fragment>
    )
  }

  wallet_detail = props => {

    const {
      wallets
    } = this.props

    const {
      match:{params}
    } = props
    // console.log('||||||||| - -  Wallet DETAIL', params)
    return(
      <Fragment>
          <section className="WalletContainer">
             <ItemAccount
               key={params.account_id}
               account={wallets[params.account_id]}
               account_type={params.primary_path}
             />
           </section>
      </Fragment>
    )
  }


  // DepositView

    render(){

      const { items_menu } = navigation_components.wallet
      const { title }  = this.state
      const { app_loaded } = this.props

      return(
        <Router
          history={this.props.history}
        >
            <Switch>
              <Route path={["/:primary_path/:path/:account_id/", "/:primary_path"]} render={route_props =>

                <DetailContainerLayout
                    items_menu={items_menu}
                    title={title}
                    {...this.state}
                    {...this.props}
                    {...route_props}
                  >
                      <Route strict path="/:primary_path/:path/:account_id" component={this.wallet_detail} />
                    {
                      !app_loaded ?
                        <SimpleLoader/>
                       :
                       <Fragment>
                               <Route exact path="/:primary_path" component={AccountList} />
                               <Route strict path="/:primary_path/:path/:account_id/:tx_path" component={ActivityView} />
                               <Route exact path="/:primary_path/:path/:account_id" component={this.render_view} />
                       </Fragment>
                    }
                </DetailContainerLayout>
              } />

            </Switch>
          </Router>
      )
    }
}


WalletContainer.propTypes = {
  all_pairs:PropTypes.object,
  app_loaded:PropTypes.bool,
  currencies:PropTypes.array,
  user:PropTypes.object
}



function mapStateToProps(state, props){

  const {
    user,
    user_id,
    all_pairs,
    wallets
  } = state.modelData

  // const{
  //   current_wallet
  // } = state.ui.current_section.params

  const{
    app_loaded
  } = state.isLoading

  // const { path } = props.match
  // console.log('||||||||| - -  Wallet CONTAINER', props)

  return{
    all_pairs,
    user:user[user_id],
    // current_wallet:current_wallet,
    currencies:state.modelData.currencies || null,
    wallets,
    app_loaded
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContainer)
