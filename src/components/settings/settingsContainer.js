import React, { Component, Fragment } from 'react'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import SimpleLoader from '../widgets/loaders'
import ItemSettingsInit from '../widgets/itemSettings'
import { global_settings } from '../api/ui/settings.json'


class SettingsContainer extends Component{


  componentDidMount(){
    // this.props.action.MenuItemActive(this.props.location.pathname)
    this.props.action.Loader(true)

    // activamos el item desde aquí en caso de acceder al componente por medio de la ruta
     this.props.action.MenuItemActive('settings')

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


  enableToggle = () =>{
    alert('Configuración Item')
  }


  render(){

    // console.log('|||||||||| °°°°°  Security Container  °°°°°||||||||||', global_settings)
    const { item_active } = this.props

    return(
        <Fragment>
          <DetailContainerLayout
            title="Configuraciones"
            >
          {
            this.props.loader ?
            <SimpleLoader
              label="Obteniendo configuraciones"
            />
            :
                global_settings &&
                <ItemSettingsInit data={global_settings} />
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



export default connect(mapStateToProps, mapDispatchToProps) (SettingsContainer)
