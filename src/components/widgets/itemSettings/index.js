import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import ItemSettings from './itemSettings'

const country = [
  "colombia",
  "chile",
  "peru",
  "republica dominicana",
  "argentina"
]



class ItemSettingsInit extends Component{


    item_action = async(item) =>{
      const { user, advace_global_step } = this.props
      const { authenticator, kyc } = user.security_center
      const { phone } = user.settings
      const { name } = item

      console.log('CODE SWITCH', name)

      switch (name) {
        case 'kyc_basic':
          return this.props.action.ToggleModal()

        case 'kyc_advance':

              await this.props.action.IncreaseStep('kyc_global_step')
              await this.props.action.IncreaseStep('kyc_global_step')

              return this.props.action.ToggleModal()

        case 'phone':
            await this.props.action.current_section_params({settings:{
              title:"Actualizar numero de movil",
              description:`${phone ? `Tu numero actual es: ${phone}` : 'Aún no tienes numero celular de respaldo'}`,
              txtPrimary:"Actualizar",
              txtSecondary:"Cancelar",
              // action:this.update_phone,
              payload:phone,
              code:name,
              type:"number",
              placeholder:"Escribe el nuevo numero",
              authenticator:authenticator
            }})
            return this.props.action.other_modal_toggle()

        case 'pass':
            await this.props.action.current_section_params({settings:{
              title:"Cambia tu contraseña",
              description:`Esta contraseña es la que utilizas para acceder a tu cuenta`,
              txtPrimary:"Actualizar",
              txtSecondary:"Cancelar",
              code:name,
              type:"number",
              placeholder:"Escribe el nuevo numero",
              authenticator:authenticator
            }})
            return this.props.action.other_modal_toggle()

        case 'transaction':
            await this.props.action.current_section_params({settings:{
              title:"Agregando capa de seguridad",
              description:`Activa el segundo factor para hacer operaciones de intercambio en coinsenda`,
              txtPrimary:"Agregar",
              txtSecondary:"Cancelar",
              authenticator:authenticator,
              code:name
            }})
            return this.props.action.other_modal_toggle()
        case 'withdraw':
            await this.props.action.current_section_params({settings:{
              title:"Agregando capa de seguridad",
              description:`Activa el segundo factor para hacer operaciones de Retiro en coinsenda`,
              txtPrimary:"Agregar",
              txtSecondary:"Cancelar",
              authenticator:authenticator,
              code:name
            }})
            return this.props.action.other_modal_toggle()
        case 'country':
            await this.props.action.current_section_params({settings:{
              title:"Elige el país de operación actual",
              txtPrimary:"Agregar",
              txtSecondary:"Cancelar",
              authenticator:false,
              code:name
            }})
            return this.props.action.other_modal_toggle()
        case 'currency':
            await this.props.action.current_section_params({settings:{
              title:"Elige tu divisa de cotización",
              txtPrimary:"Agregar",
              txtSecondary:"Cancelar",
              authenticator:false,
              code:name
            }})
            return this.props.action.other_modal_toggle()

        default:

      }
    }

    update_state = async(payload) =>{
      const{
        name
      } = payload

      const{
        user
      } = this.props

      const {
        security_center
      } = user

      const {
        advanced,
        basic
      } = security_center.kyc

      const{
        auth,
        transactional,
        withdraw
      } = security_center.authenticator

      // console.log('desde en el compoenente pricni update_state', name, user)

      switch (name) {

        case 'email':

            return {
              available:true,
              verify:security_center.email
            }

        case 'identity':
            return {
              available:true,
              verify:true
            }

        case 'kyc_basic':
            return {
              available:true,
              verify:basic
            }

        case 'kyc_advance':
            return {
              available:basic && true,
              verify:basic ? advanced : false
            }

        case '2auth':
            return {
              available:true,
              verify:auth
            }

        case 'transaction':
            return {
              available:auth && true,
              verify:auth && transactional
            }

        case 'withdraw':
            return {
              available:auth && true,
              verify:auth && withdraw
            }


        default:
        return false

      }
    }


    update_phone = (prop) =>{
      // console.log('update_phone update_phone update_phone', prop)
    }

  render(){

    const{
      data
    } = this.props

    // console.log('ItemSettingsInit', this.props)

    return(
          <section className="SecurityCenter">
            {
              data &&
                data.map(item => {
                  return <ItemSettings
                    item={item}
                    key={item.id}
                    item_action={this.item_action}
                    update_state={this.update_state}
                  />
                })
            }
          </section>
    )
  }
}

function mapStateToProps(state, props){
  const { user, user_id } = state.model_data
  return{
    loader:state.isLoading.loader,
    advace_global_step:state.form.globalStep,
    user:user[user_id]
  }
}

function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}



export default connect(mapStateToProps, mapDispatchToProps) (ItemSettingsInit)
