import React, {Component} from 'react'
import NewWalletLayout from './newWalletLayout'
import { connect } from 'react-redux'
// import { updateFormControl, FormWallet } from '../../../actions'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'


class NewWallet extends Component{


  state = {
    name:this.props.form_wallet.name,
    currency:this.props.form_wallet.currency,
    address:this.props.form_wallet.address,
    short_currency_name:this.props.form_wallet.short_currency_name,
    qr:""
  }


    update_control_form = (searchMatch) => {
      //esta función valida si tenemos un nombre item escrito y si tenemos un item coin/bank seleccionado, si cumple con esto, nos habilita el call to action para seguir hacia la proxima acción
      // console.log('update_control_form SE ESTA ACTUALIZANDO: ', searchMatch)

      if (!searchMatch || this.props.search.length>1) {
            this.props.action.UpdateFormControl('wallet', false)
      }

      if (this.state.name !== "" && this.props.search.length==1) {
        // Valido si hay una coincidencia en la busqueda y un nombre para el item que se esta creando, doy luz verde para continuar hacia el siguiente paso del formulario
        this.props.action.UpdateFormControl('wallet', true)
      }
    }

    handleSubmit = (event) => {
      event.preventDefault()
      this.props.action.Loader(true)
      this.siguiente()
      this.actualizarEstado(event)
      this.crearWallet()
    }


    crearWallet = async() => {
      // simulación Endpoint Crear wallet

      const {
        user
      } = this.props

      const {
        name,
        currency
      } = this.state

      this.setState({qr:'http://noticias.universia.net.mx/net/images/ciencia-tecnologia/q/qr/qr-/qr-de-universia-mexico.png',
                    address:"1ACAgPuFFidYzPMXbiKptSrwT74Dg8hq2v"})

         const body = {
           "data":{
               "userId":  user && user.id,
               "name":name,
               "description":"description",
               "country": user && user.settings.current_country,
               "currency": {
                  "currency": currency,
                  "is_token": false
                }
             }
         }



        const wallets = await this.props.action.create_new_wallet(body)


       if(!wallets || wallets === 465 || wallets === 400){
         this.props.action.ReduceStep('wallets')
         this.props.action.Loader(false)
         let msg = !wallets ? 'ERROR DE CONEXIÓN' : 'Al parecer, aún no tenemos soporte para esta moneda'

         this.props.action.mensaje(msg, 'error')


        return console.log('||||||||||ERROR ERROR!!!!!!ERROR ERROR!!!!°°°°|||||||', wallets)
        // return false
       }

        // console.log('|||||||||| COMIDAAA!!!!!! TENGO HAMBRE!!!!°°°°|||||||', wallets)
        const {
          account
        } = wallets

        // console.log('||||||||||||| NEW WALLET', account)

        // this.update_form()
        this.props.action.Loader(false)
        this.props.action.success_sound()
        this.props.history.push(`wallets/deposit/${account.id}`)
        // si la acción se lleva satisfactoriamente actualizamos el fondo del modal a un color verde
        let msg = `Nueva wallet ${account.currency.currency} creada!`
        this.props.action.mensaje(msg, 'success')

        this.props.action.ToggleModal()
        this.props.action.get_list_user_wallets(this.props.user)
        await this.props.action.get_account_balances(this.props.user)
        this.props.action.CleanForm('wallet')

        // this.props.action.ModalView('modalSuccess')
    }

    actualizarEstado = async(event) =>{
      if(event.target.short_name){
        await this.setState({short_currency_name:event.target.short_name})
      }
      const name = event.target.name
      const value = event.target.value
      await this.setState({[name]:value})
      this.update_control_form(value)
      this.update_form()
    }

    update_form=()=>{
      // Acualizamos el estado del formulario en redux
      this.props.action.UpdateForm('wallet', this.state)
    }

  siguiente = () =>{
    return this.props.action.IncreaseStep(this.props.current)
  }

  finalizar =(event) =>{
      // reiniciamos el estado del formulario(./reducers/form)
    this.props.action.ToggleModal()
    this.props.action.CleanForm('wallet')
  }

  componentWillMount(){
    this.props.action.CurrentForm('wallets')
  	}


  render(){
    const { step } = this.props
    // console.log('|||||||||| COMIDAAA!!!!!! TENGO HAMBRE!!!!°°°°|||||||', this.props)
    return(
      <NewWalletLayout
        copy = {this.copy}
        actualizarEstado = {this.actualizarEstado}
        handleSubmit={this.handleSubmit}
        update_control_form={this.update_control_form}
        buttonActive = {this.props.buttonActive}
        loader={this.props.loader}
        finalizar={this.finalizar}
        step = {step}
        {...this.state}
      />
    )
  }
}

function mapStateToProps(state, props){
  // console.log('R E N D E R I Z A N D O  - - -- -  NEW WALLET -----::: ', state)
  const userid = state.model_data.user_id
  const user = state.model_data.user[userid]

  return {
    search:state.form.search_coin,
    form_wallet:state.form.form_wallet,
    buttonActive:state.form.form_control_wallet,
    loader:state.isLoading.loader,
    step:state.form.form_wallet.step,
    current:state.form.current,
    user:user

  }
}

function mapDispatchToProps(dispatch){
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (NewWallet)
