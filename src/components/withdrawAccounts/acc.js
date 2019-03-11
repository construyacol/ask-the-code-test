import React, { Component, Fragment } from 'react'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import SimpleLoader from '../widgets/loaders'
import './WAccount.css'

class WitdrawAccountContainer extends Component{


  componentDidMount(){
    this.props.action.Loader(true)

    console.log('||||||||||| WitdrawAccountContainer', this.props)

    // this.props.action.MenuItemActive(this.props.location.pathname)

    // activamos el item desde aquí en caso de acceder al componente por medio de la ruta
     this.props.action.MenuItemActive('withdraw')

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

  render(){
    return(
      <Fragment>
        <DetailContainerLayout>
        {
          this.props.loader ?
          <SimpleLoader
            label="Obteniendo mis cuentas bancarias"
          />
          :
            <div>
              <p onClick={this.props.action.ToggleModal}>Cuentas de retiro</p>
            </div>
        }
      </DetailContainerLayout>
      </Fragment>
    )
  }
}

function mapStateToProps(state, props){
  return{
    loader:state.isLoading.loader
  }
}

function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}






export default connect(mapStateToProps, mapDispatchToProps) (WitdrawAccountContainer)
