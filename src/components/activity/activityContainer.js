import React, { Component, Fragment } from 'react'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import { ButtonForms } from '../widgets/buttons/buttons'

// import { withRouter } from 'react-router-dom'
import './activity.css'

class ActivityContainer extends Component{

  componentWillMount(){
     this.props.action.Loader(true)
  }

  componentDidMount(){
    // this.props.action.MenuItemActive(this.props.location.pathname)
    // activamos el item desde aquí en caso de acceder al componente por medio de la ruta
     this.props.action.MenuItemActive('activity')

     setTimeout(async()=>{
       // Manejamos la respuesta en el estado, por si ocurre un error, evitamos
       // this.setState({
       //   userWallets: await this.props.action.get_list_user_wallets(this.props.user)
       // })
       this.props.action.Loader(false)
      // console.log('°°°°°°° RESPUESTA DE LAS WALLETS  °°°°°°', userWallets)
    }, 0)
     // console.log('|||||||||| °°°°°  WalletContainer  °°°°°||||||||||')
  }

deposit = () =>{
  // this.props.action.FiatDeposit('cop')
  // this.props.action.UpdateFormControl('deposit', true)
  this.props.action.CleanForm('deposit')
  this.props.action.ToggleModal()
}

toWallets = async() =>{

  await this.props.history.push("/withdraw/deposit/5c04f873eb9c94511fd2edfa")
  // console.log(' - - - ||  DetailContainerLayout  || -- - - - -', this.props.history)
}

  render(){
    // console.log(' - - - ||  DetailContainerLayout  || -- - - - -', this.props.history)
// ActivityList

// console.log('||||||||||||||||||||||||||||||||||||||||||||| SWAPS - - - ', swaps)
    return(
      <Fragment>
        <DetailContainerLayout
          >
        {/* {
          (!deposits || !swaps) ?
          <SimpleLoader
            label="Obteniendo mi historial de actividad"
          />
          :
            <Fragment>
              <ButtonForms
                type="primary"
                active={true}
                siguiente={this.deposit}
              >Hacer mi primer Deposito</ButtonForms>

              <ActivityList
                general={true}
                {...this.props}
              />

            </Fragment>
        } */}

        <ButtonForms
          type="primary"
          active={true}
          siguiente={this.deposit}
        >Hacer mi primer Deposito</ButtonForms>

      </DetailContainerLayout>
      </Fragment>
    )
  }
}

function mapStateToProps(state, props){

  const { current_wallet } = state.ui.current_section.params
  const { user, user_id, wallets, withdrawals, deposits, swaps, activity, all_pairs } = state.model_data

  return{
    loader:state.isLoading.loader,
    wallet_router:state.ui.router_wallet_container,
    local_currency:state.model_data.pairs.localCurrency,
    current_pair:!current_wallet ? null : (state.ui.current_section.params.pairs_for_account[current_wallet.id] && state.ui.current_section.params.pairs_for_account[current_wallet.id].current_pair),
    user:user[user_id],
    wallets,
    withdrawals,
    deposits,
    swaps,
    activity,
    all_pairs:all_pairs
  }
}

function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}






export default connect(mapStateToProps, mapDispatchToProps) (ActivityContainer)
