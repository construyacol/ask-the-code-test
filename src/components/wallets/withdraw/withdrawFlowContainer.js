import React, { Component, Fragment } from 'react'
import FlowAnimationLayout from '../../widgets/flowAnimationLayout/flowAnimationLayout'
import ViewAmountComponent from '../views/viewAmount'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WithdrawAccountList from '../../withdrawAccounts/views/withdraw_account_list'
import { SimpleLoader } from '../../widgets/loaders'
import WithdrawAccountForm from '../../withdrawAccounts/new/withdrawAccountForm'
import { ButtonModalBack } from '../../widgets/buttons/buttons'
import FinalTicket from '../../withdrawAccounts/new/views/finalTicket'
import { withdrawProvidersByType, matchItem, number_format } from '../../../services'

import actions from '../../../actions'

import './withdrawFlow.css'

class WithdrawFlow extends Component {
  // Withdraw FIAT COMPONENT

    state = {
      amount:"",
      withdraw_providers:null,
      need_new_acount:null,
      show_list_accounts:false,
      finish_step:false,
      ticket:null,
      ticket_label_loader:`Creando orden de retiro`,
      color_loader:"blue",
      new_order:null,
      AddNotification:false,
      min_amount:0,
      provider_type:'bank', //Por defecto en el flujo el tipo de retiro es por transferencia bancaria, a futuro habilitaremos cash (efectivo)
      withdraw_account_list_update:[]
      // step:1
    }

    async componentDidMount(){
      await this.props.action.CurrentForm('withdraw')
      this.init_config()
      this.props.history.push(`?form=withdraw_amount`)
    }

    updateTimes = 0


      componentDidUpdate(prevProps, prevState){

        // inserto las siguientes rutas para poder hacer seguimiento al funnel desde hotjar
        // console.log('|||||||||||||||||||||||||||||||| =======> withdraw flow CONT ==> ', this.props)
        let route
        if((prevProps.step === 1 && this.state.show_list_accounts) && this.updateTimes < 1){
          route = `?form=withdraw_select_account`
          this.updateTimes ++
          return this.props.history.push(route)
        }

        if((prevProps.step === 1 && !this.state.show_list_accounts) && this.updateTimes > 0){
          route = `?form=withdraw_amount`
          this.updateTimes --
          this.props.history.push(route)
        }

        if(prevProps.step === this.props.step){return}
        // console.log('NEXT STEP ==>', this.props.step, prevProps.step)

        if(this.props.step >= 2){
          this.updateTimes --
          route = `?form=withdraw_order_created`
        }

          this.props.history.push(route)
          // alert()
      }

    // componentWillReceiveProps({step}){
    //   this.setState({step})
    // }

    init_config = async() =>{

        const{
          currency_type,
          country,
          withdraw_providers,
          have_withdraw_accounts
        } = this.props

        if(!have_withdraw_accounts){await this.setState({need_new_acount:true})}
        let available_providers = []

        await withdraw_providers.map(provider => {
            if(
              provider.country === country &&
              provider.currency_type === currency_type &&
              provider.enabled
            ){
              return available_providers.push(provider)
            }

            return false
        })


        if(available_providers.length<1){return false}

        let withdraw_account_list_update = []
        // Calculamos los costos de retiro en función al proveedor de retiro y las cuentas de retiro disponibles
        if(this.state.provider_type === 'bank' && this.props.withdraw_account_list){
          // 1.mapear las cuentas de retiros
          // 2.matchear la cuenta de retiro contra => available_providers por medio de su provider_type ===
          // 3. Validar si el name withdraw provider es el mismo del name del withdraw account (pertenecen a la misma red de pagos) available_provider.provider.name === withdraw_account.provider_name
          // 3.1 si no pertenece a la misma red bancaria entonces buscar por withdraw_account.city.value en el modelo let plaza_type = available_provider.info_needed.city.plaza_type
          // 4.obteniendo el plaza_type agregar al withdraw_account una propiedad llamada cost = available_provider.provider.cost[plaza_type].fixed
          // con esto ya podemos validar los fondos minimos necesarios para crear la orden de retiro
          withdraw_account_list_update = await this.get_cost_struct(available_providers)
        }

        this.setState({withdraw_account_list_update})

        this.setState({
          withdraw_providers:available_providers,
          min_amount:parseInt(available_providers[0].provider.min_amount)
        })
    }


    get_cost_struct = async(available_providers, withdraw_account_list) =>{
      // console.log('||||||| ======> get_cost_struct', available_providers, withdraw_account_list)
      let providers_served = await withdrawProvidersByType(available_providers || this.props.withdraw_providers)

      let update_list = []
      let w_account_list = withdraw_account_list || this.props.withdraw_account_list

      w_account_list.map(withdraw_account => {
        if(withdraw_account.currency_type === 'crypto'){return false}
        let plaza_type
        let provider_type = withdraw_account.provider_type

        if(providers_served[provider_type].provider.name === withdraw_account.provider_name){plaza_type = 'same_bank'}
        if(!plaza_type){plaza_type = providers_served[provider_type].info_needed.city[withdraw_account.city.value].plaza_type}

        let new_withdraw_account = {
          ...withdraw_account,
          cost_struct:providers_served[provider_type].provider.costs[plaza_type],
          cost:providers_served[provider_type].provider.costs[plaza_type].fixed
        }
        return update_list.push(new_withdraw_account)
      })

      return update_list
    }




    new_account_and_withdraw = async new_account =>{
      // console.log('=======> new_account', new_account)

      const{
        withdraw_providers,
        form_withdraw
      } = this.props


      let providers_served = await withdrawProvidersByType(withdraw_providers)

      const {
        provider_type
      } = new_account

      const{
        amount
      } = form_withdraw

      const{
        min_amount
      } = this.state

      // console.log('providers_served', providers_served)
        let withdraw_account_list = await this.props.action.get_withdraw_accounts(this.props.user, withdraw_providers, `{"where": {"userId": "${this.props.user.id}"}}`)
        // console.log(' =====> this.props.withdraw_account_list', this.props.withdraw_account_list)
        // console.log(' =====> withdraw_account_list', withdraw_account_list)
        // return alert('que paja')
        let withdraw_account_list_update = await this.get_cost_struct(null, withdraw_account_list)
        await this.setState({withdraw_account_list_update})
        let new_account_update = await matchItem(withdraw_account_list_update, {primary:new_account.id}, 'id')
        let min_amount_withdraw = parseFloat(min_amount) + parseFloat(new_account_update[0].cost)


        if(parseFloat(amount) < min_amount_withdraw){

          setTimeout(async()=>{
            console.log('________________________________________new_account_and_withdraw', new_account)

            this.props.action.AddNotification('withdraw_accounts', {account_id:new_account.id}, 1)
            this.props.action.mensaje('Nueva cuenta de retiro creada', 'success')
            // await this.setState({AddNotification:false})
          },2000)

          await this.setState({show_list_accounts:false, need_new_acount:null})
          await this.volver(1)
          await this.props.action.Loader(false)
          return  this.props.action.mensaje(`Minimo de retiro por esta cuenta es de: $${number_format(min_amount_withdraw)}`, 'error')
        }

        await this.setState({AddNotification:true})
        await this.new_withdraw_order({withdraw_account:new_account.id, withdraw_provider:providers_served[provider_type].id})

    }



    new_withdraw_order = async (state_data, limit, limit_supered) =>{
      // validar que el limite maximo es permitido por el provider



      this.props.action.Loader(true)
      await this.setState({
        finish_step:limit_supered ? false : true,
        limit_supered_component:limit_supered ? true : false,
        need_new_acount:false
      })

      this.props.action.FlowAnimationLayoutAction('nextV', 'next', "withdraw")
      await this.props.action.get_withdraws(this.props.account_id, 'withdraws')

      const {
        withdraw_account,
        withdraw_provider
      } = state_data

      const {
        amount
      } = this.props.form_withdraw

      const { account_id } = this.props

      // return console.log('|||||| form_withdraw', this.props.form_withdraw, state_data)

      await this.props.action.UpdateForm('withdraw', {withdraw_account:withdraw_account, withdraw_provider:withdraw_provider})
      // console.log('||||||| ======>>> add_new_withdraw_order', amount, account_id, withdraw_provider, withdraw_account)
      let res = await this.props.action.add_new_withdraw_order(amount, account_id, withdraw_provider, withdraw_account)
      // console.log('RESPUESTA ENDPOINT RETIRO FIAT', res)

      if(!res){
        this.setState({
          finish_step:false,
          limit_supered_component:false,
          need_new_acount:true
        })
        this.props.action.FlowAnimationLayoutAction('backV', 'back', "withdraw", 1)
        this.props.action.Loader(false)
        return this.handleError('La orden no ha podido ser creada')
      }

      const {
        data
      } = res



      this.setState({
        new_order:data
      })

      this.props.action.Loader(false)
      return this.create_order(res)
    }






    new_acount= async() =>{
      await this.setState({
        need_new_acount:true,
        finish_step:false
      })
      this.siguiente()
    }


    updateAmountOnState = async(amount) =>{
      await this.setState({
        amount:amount,
      })
      this.props.action.UpdateForm('withdraw', {amount:amount})
    }






    create_order = async({data}) =>{

      const{
        account_from,
        withdraw_account,
        withdraw_provider
      } = this.props.withdraw_order


      // return console.log('_______________________________________________CREATE ORDER SUCCESS ====>', data)


      let new_order_model = [
        {
          ui_name:"El Retiro proviene desde:",
          value:`${account_from.name} - ${account_from.currency.currency}`,
          id:1,
          icon:account_from.currency.currency
        },
        {
          ui_name:"Los fondos se recibirán en:",
          value:withdraw_account.bank_name.ui_name,
          id:2,
          icon:withdraw_account.bank_name.value
        },
        {
          ui_name:`${withdraw_account.account_number.ui_name}:`,
          value:withdraw_account.account_number.value,
          id:3
        },
        {
          ui_name:`Ciudad:`,
          value:withdraw_account.city.ui_name,
          id:4
        },
        {
          ui_name:"Propietario de la cuenta:",
          value:`${withdraw_account.name} ${withdraw_account.surname}`,
          id:5
        },
        {
          ui_name:"Retiro realizado a travez de:",
          value:withdraw_provider.info_needed.bank_name[withdraw_provider.provider.name].ui_name,
          id:6,
          icon:withdraw_provider.provider.name
        },
        {
          ui_name:"Cantidad a retirar:",
          value:account_from.currency_type === 'fiat' ? `$ ${number_format(data.amount)} ${account_from.currency.currency}` : data.withdraw_info.amount,
          icon:account_from.currency.currency,
          id:7
        },
        {
          ui_name:"Costo Bancario:",
          value:`$ ${number_format(data.cost)} ${account_from.currency.currency}`,
          icon:account_from.currency.currency,
          id:8
        },
        {
          ui_name:"Total recibido:",
          value:account_from.currency_type === 'fiat' ? `$ ${number_format(data.amount_neto)} ${account_from.currency.currency}` : data.withdraw_info.amount_neto,
          icon:account_from.currency.currency,
          id:9
        }
      ]

      // console.log(this.props.withdraw_order)
      // console.log('new_order_model', new_order_model)
      // console.log('|||||||NEW   ORDER ----', data)
      // alert('ojala')

      this.props.action.success_sound()
      await this.props.action.ModalView('modalSuccess')

      this.setState({
        ticket:new_order_model
      })

    }



    confirmar = async() =>{


    await this.setState({
        ticket:null,
        color_loader:"white",
        ticket_label_loader:"Confirmando orden de retiro"
      })


      // return console.log('________________________________________CONFIRMAR ORDEN DE RETIRO', this.state)

      let res = await this.props.action.add_update_withdraw(this.state.new_order.id, 'confirmed')

      if(!res || res === 465){
        this.setState({
          finish_step:false,
          limit_supered_component:false,
          need_new_acount:true
        })
        // await this.props.action.ModalView('modalView')
        this.props.action.FlowAnimationLayoutAction('backV', 'back', "withdraw", 1)
        this.props.action.Loader(false)
        return this.handleError('La orden no ha podido ser confirmada')
      }

      const { new_order } = this.state
      //
      // let new_withdraw = {
      //   account_id:new_order.account_id,
      //   amount:new_order.amount,
      //   amount_neto:new_order.amount_neto,
      //   comment:"",
      //   country:new_order.country,
      //   currency:new_order.currency,
      //   currency_type:new_order.currency_type,
      //   cost:new_order.cost,
      //   cost_struct:new_order.cost_struct,
      //   deposit_provider_id:"",
      //   expiration_date:new Date(),
      //   id:new_order.id,
      //   state:"confirmed",
      //   unique_id:new_order.id,
      //   userId:new_order.userId,
      //   withdraw_account:new_order.withdraw_account_id,
      //   withdraw_provider:new_order.withdraw_provider_id,
      //   type_order:"withdraw"
      // }
      //
      // const{
      //   account_from
      // } = this.props.withdraw_order
      //
      //
      // await this.props.action.add_item_state('withdraws', new_withdraw)
      // await this.props.action.update_activity_state(new_order.account_id, 'withdraws')
      // await this.props.history.push(`/wallets/activity/${account_from.id}/withdraws`)
      // this.props.action.add_new_transaction_animation()



      console.log('________________________________________CONFIRMAR ORDEN DE RETIRO', this.state, res)


      await this.props.action.ToggleModal()
      await this.props.history.push(`/wallets/activity/${this.props.account_id}/withdraws?form=withdraw_success`)

      this.props.action.CleanForm('deposit')
      this.props.action.CleanForm('withdraw')
      this.props.action.CleanForm('bank')

      if(this.state.AddNotification){
        setTimeout(async()=>{
          this.props.action.AddNotification('withdraw_accounts', {account_id:new_order.withdraw_account_id}, 1)
          this.props.action.mensaje('Nueva cuenta de retiro creada', 'success')
          await this.setState({AddNotification:false})
        },2000)
      }
      setTimeout(async()=>{
        await this.props.action.ManageBalance(this.props.account_id, 'reduce', new_order.amount)
        setTimeout(()=>{
          return this.props.action.get_account_balances(this.props.user)
        },3000)
      },2000)


    }




    handleError = msg =>{
      return  this.props.action.mensaje(msg, 'error')
    }


    siguiente = (event) => {

      const{
        step
      } = this.props

      const {
        need_new_acount
      } = this.state

      if(step === 1 && !need_new_acount){return this.setState({show_list_accounts:true})}
      return this.props.action.FlowAnimationLayoutAction('nextV', 'next', "withdraw")
    }

    volver = (step) =>{
      return this.props.action.FlowAnimationLayoutAction('backV', 'back', "withdraw", step)
    }

    backAmount = () =>{
      return this.setState({show_list_accounts:false, need_new_acount:false})
    }


    cancelWithdrawOrder = async() =>{

      await this.props.action.ModalView('modalView')
      this.setState({
        ticket_label_loader:"Cancelando orden",
        ticket:null
      })

      this.props.action.Loader(true)
      // console.log(`cancelWithdrawOrder ${this.state.new_order.id}`, res, this.state.new_order)
      // alert('delete')
      await this.volver(1)
      this.props.action.Loader(false)
      this.setState({
        ticket_label_loader:"Creando orden de retiro",
        show_list_accounts:true,
      })
      // alert('cancelado')
    }







    render(){

      // console.log('=========> Min amount supported:', this.state.min_amount, typeof(this.state.min_amount))

      const {
        currency,
        available,
        step
      } = this.props

      const{
        amount,
        withdraw_providers,
        need_new_acount,
        show_list_accounts,
        finish_step,
        ticket,
        ticket_label_loader,
        color_loader,
        min_amount,
        withdraw_account_list_update
      } = this.state

      // console.log('||||||| ---- -necesita cuenta?', this.state.need_new_acount)
      // console.log('||||||| ---- -necesita cuenta?', step, show_list_accounts)

      return(
        <section className="WFC DepositLayout">
            <FlowAnimationLayout>
              {
                (step === 1 && !show_list_accounts) &&
              <ViewAmountComponent
                currency={currency}
                amount={amount}
                updateAmountOnState={this.updateAmountOnState}
                operation_type="withdraw"
                available={available}
                handleSubmit={this.siguiente}
                min_amount={min_amount}
                />
              }

              {
                (step === 1 && show_list_accounts) && (
                  (withdraw_providers) ?
                    <div className="WA">
                        <ButtonModalBack
                          color="gray"
                          volver={this.backAmount}>
                          { window.innerWidth>768 &&
                            'volver'
                          }
                        </ButtonModalBack>

                      <div className="DLcontain">
                        <p className="fuente DLtitle2" >Elige la cuenta </p>
                        <p className="fuente DLstitle" >que recibirá los fondos:</p>
                      </div>
                      <WithdrawAccountList
                        currency_type="fiat"
                        withdraw_flow={true}
                        new_withdraw_order={this.new_withdraw_order}
                        new_account_method={this.new_acount}
                        back={this.volver}
                        amount={amount}
                        withdraw_providers={withdraw_providers}
                        inherit_account_list={withdraw_account_list_update}
                      />
                    </div>
                  :
                  <SimpleLoader
                    label="Cargando"
                  />
                )
              }


              {
                (step >= 2 && need_new_acount && !finish_step)&&
                <WithdrawAccountForm
                withdraw_flow={true}
                withdraw_flow_action={this.new_account_and_withdraw}
               />
              }

              {
                (step >= 2 && !need_new_acount && finish_step)&&
                <Fragment>
                  {
                    !ticket ?
                    <SimpleLoader
                        label={ticket_label_loader}
                        color={color_loader}
                      />
                      :
                    <FinalTicket
                        finishAction={this.confirmar}
                        ticket={ticket}
                        cta_primary_label="Confirmar"
                        cta_secondary={true}
                        cta_secondary_label="Cancelar"
                        cta_secondary_action={this.cancelWithdrawOrder}
                    />
                  }
                </Fragment>
              }


            </FlowAnimationLayout>
        </section>
      )
    }
}

function mapStateToProps(state, props){

  // const{
  //   current_wallet
  // } = state.ui.current_section.params

  const { params } = props.match

  const{
    withdraw_accounts,
    user,
    user_id,
    withdraw_providers,
    wallets,
    withdraws,
    balances
  } = state.modelData

  const current_wallet = wallets[params.account_id]

  // console.log('||||||| ---- Withdraw Flow ==> ', current_wallet)

  const{
    withdraw_provider,
    withdraw_account
  } = state.form.form_withdraw

  // console.log('Antes de reeeeeeenderizar : : : : ',state.form.form_withdraw)
  let withdraw_providers_list = user[user_id].withdraw_providers.map((id_prov)=>{
    return withdraw_providers[id_prov]
  })

  let withdraw_account_list = []

  user[user_id].withdraw_accounts.map(account_id => {
    // if(withdraw_accounts[account_id].currency_type !== "fiat" || !withdraw_accounts[account_id].visible || !withdraw_accounts[account_id].inscribed){return false}
    if(withdraw_accounts[account_id].currency_type !== "fiat" || !withdraw_accounts[account_id].visible){return false}
    return withdraw_account_list.push(withdraw_accounts[account_id])
  })

  return{
    withdraw_order:{
      account_from:wallets[params.account_id],
      withdraw_account:withdraw_account && withdraw_accounts[withdraw_account],
      withdraw_provider:withdraw_provider && withdraw_providers[withdraw_provider]
    },
    account_id:params.account_id,
    withdraws,
    currency_type:current_wallet && current_wallet.currency_type,
    user:user[user_id],
    country:user[user_id].country,
    currency:current_wallet && current_wallet.currency.currency,
    available:current_wallet && balances && balances[current_wallet.id].available,
    current:state.form.current,
    step:state.form.form_withdraw.step,
    form_withdraw:state.form.form_withdraw,
    withdraw_providers:withdraw_providers_list,
    withdraw_account_list:withdraw_account_list.length>0 && withdraw_account_list,
    have_withdraw_accounts:withdraw_account_list.length>0
    // have_withdraw_accounts:false
  }
}

function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (WithdrawFlow)
