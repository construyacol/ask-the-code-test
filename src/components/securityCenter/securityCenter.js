import React, { Component, Fragment } from 'react'
import DetailContainerLayout from '../widgets/detailContainer/detailContainerLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import SimpleLoader from '../widgets/loaders'
import { security_center } from '../api/ui/settings.json'
import ItemSettingsInit from '../widgets/itemSettings/'

class SecurityCenter extends Component{

  componentDidMount(){
    this.props.action.Loader(true)
  }

  componentDidMount(){
    // this.props.action.MenuItemActive(this.props.location.pathname)
    // activamos el item desde aquí en caso de acceder al componente por medio de la ruta
     this.props.action.MenuItemActive('security')

     setTimeout(()=>{
       // Manejamos la respuesta en el estado, por si ocurre un error, evitamos
       // this.setState({
       //   userWallets: await this.props.action.get_list_user_wallets(this.props.user)
       // })
       this.props.action.Loader(false)
      // console.log('°°°°°°° RESPUESTA DE LAS WALLETS  °°°°°°', userWallets)
    }, 0)
  }


  render(){

    // console.log('SECURITY_CENTER::::', this.props)

    return(
      <Fragment>
        <DetailContainerLayout
          title="Centro de seguridad"
          >
        {
          this.props.loader ?
          <SimpleLoader
            label="Obteniendo configuraciones"
          />
          :
              security_center &&
              <ItemSettingsInit data={security_center} />
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



export default connect(mapStateToProps, mapDispatchToProps) (SecurityCenter)
