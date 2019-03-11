import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import AccountItemList from '../../widgets/account_item_list/accountItemList'
import { SimpleLoader } from '../../widgets/loaders'
import { withdraw_provider_by_type, matchItem } from '../../../services'
import '../WAccount.css'


class WithdrawAccountList extends Component{

  state = {
    withdraw_accounts:null
  }

  componentDidMount(){
    this.init_config()
  }

  find_units = amount =>{
  // Este metodo me retorna la cantidad de ordenes en las que se ejecutaría el retiro

    let units = amount/100
    let limit = 2

    for (let i = 0; i < limit; i++) {
      // console.log(`limite: ${limit} - - percent: ${amount} - - units:${units}`)
      if(units<=1){return units=1}
      if(units<=limit){return limit}
      limit ++
    }
  }

  init_config = async() => {

    const {
      withdraw_providers,
      withdraw_accounts,
      amount
    } = this.props

    if(!withdraw_providers && !amount){return false}

    let providers_served = await withdraw_provider_by_type(withdraw_providers)

    let final_withdraw_accounts = await withdraw_accounts.map(wa => {

      let provider_max_amount = providers_served[wa.provider_type].provider.max_amount
      let limit = (amount*100)/provider_max_amount

        return {
          ...wa,
          orders:this.find_units(parseInt(limit)),
          percent:parseInt(limit),
          limit:parseFloat(amount)>=parseFloat(providers_served[wa.provider_type].provider.max_amount) && true,
        }

    })

    // console.log('||||||||||final_withdraw_accounts ', final_withdraw_accounts)
    // ------------------------------------------------------------------------
    // Este Fragmento de codigo sirve para detectar si hay cuentas de retiro que operen sobre la misma red bancaria o
    // transaccional del proveedor de retiro, definiendolas como cuentas preferenciales porque tienen un menor costo transaccional

      let preferential_accounts = []

      await withdraw_providers.map(async(withdraw_provider) => {
        if(withdraw_provider.currency_type !== 'fiat'){return false}

        let result = await matchItem(final_withdraw_accounts, {primary:withdraw_provider.provider.name}, 'provider_name')

        if(result && result.length>0){
          preferential_accounts.push(...result)
        }
      })


      if(preferential_accounts.length>0){
        let new_withdraw_list = [...preferential_accounts]
        // new_withdraw_list.push(preferential_accounts[0])

        await final_withdraw_accounts.map(async wa=>{
          let matches = await matchItem(preferential_accounts, {primary:wa.id}, 'id')
          if(!matches){
            new_withdraw_list.push(wa)
          }
        })

        let preferential_account_id = await preferential_accounts.map(p_account => {return p_account.id})

        // console.log('|||||||preferential_account_id',preferential_account_id, preferential_account_id.length)

        return this.setState({
          withdraw_accounts:new_withdraw_list,
          preferential_accounts:preferential_account_id
        })

      }

// ------------------------------------------------------------------
// Si no hay cuentas preferenciales returnamos la lista original
    this.setState({
      withdraw_accounts:final_withdraw_accounts
    })

  }


new_account = () =>{

  const {
    withdraw_flow,
    new_account_method
  } = this.props

  if(withdraw_flow){return new_account_method()}
}


  volver = () => {
    const {
      back
    } = this.props

    if(back){return setTimeout(()=>{back()}, 500)}
  }


  render(){

    const{
      amount
    } = this.props

    const {
      withdraw_accounts,
      preferential_accounts
    } = this.state

    return(
      <Fragment>
        <section className="WithdrawAccountList">

          <div className="seccionPrinWA">
            <AccountItemList
              action={this.new_account}
              addElement={true} />
          </div>

          <div className="listWA">
            {
              withdraw_accounts ?
                    withdraw_accounts.map(account => {
                        return (
                          <AccountItemList
                            key={account.id}
                            amount={amount}
                            account={account}
                            new_withdraw_order={this.props.new_withdraw_order}
                            preferential_accounts={preferential_accounts}
                          />
                        )
                    })
                    // <div>puta</div>
              :
              <SimpleLoader/>
            }
          </div>
        </section>
      </Fragment>
    )
  }
}

  function mapStateToProps(state, props){

    const {
      withdraw_accounts,
      user,
      user_id
    } = state.model_data

    const{
      currency_type,
      inherit_account_list
    } = props

    let withdraw_account_list = inherit_account_list

    if(!withdraw_account_list){
      // si no hay una lista heredada del componente padre entonces ejecute su propia consulta
      user[user_id].withdraw_accounts.map(account_id => {
        if(withdraw_accounts[account_id].currency_type !== currency_type || !withdraw_accounts[account_id].visible){return false}
        return withdraw_account_list.push(withdraw_accounts[account_id])
      })
    }



    return{
      withdraw_accounts:withdraw_account_list
    }
  }

  function mapDispatchToProps(dispatch){
    return{
      action:bindActionCreators(actions, dispatch)
    }
  }

export default connect(mapStateToProps, mapDispatchToProps) (WithdrawAccountList)
