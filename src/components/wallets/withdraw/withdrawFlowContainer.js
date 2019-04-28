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
import { number_format } from '../../../services'
import { withdraw_provider_by_type } from '../../../services'

import actions from '../../../actions'


import './withdrawFlow.css'

class WithdrawFlow extends Component {

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
      AddNotification:false
      // step:1
    }

    componentDidMount(){
      this.init_config()
    }

    componentWillReceiveProps({step}){

      let lastStep = this.state.step
      this.setState({step})

    }

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
            ){return available_providers.push(provider)}
        })

        this.setState({
          withdraw_providers:available_providers.length>0 && available_providers
        })
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



    new_withdraw_order = async (state_data, limit, limit_supered) =>{
      // validar que el limite maximo es permitido por el provider
      // si es así continue por aca
      // alert('epa')
      this.props.action.Loader(true)
      await this.setState({
        finish_step:limit_supered ? false : true,
        limit_supered_component:limit_supered ? true : false,
        need_new_acount:false
      })

      this.props.action.FlowAnimationLayoutAction('nextV', 'next', "withdraw")

      const {
        withdraw_account,
        withdraw_provider
      } = state_data

      const {
        account_from,
        amount
      } = this.props.form_withdraw

      const{
        user
      } = this.props

      await this.props.action.UpdateForm('withdraw', {withdraw_account:withdraw_account, withdraw_provider:withdraw_provider})
      let res = await this.props.action.add_new_withdraw_order(amount, account_from, withdraw_provider, withdraw_account)

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








    create_order = async({data}) =>{

      const{
        account_from,
        withdraw_account,
        withdraw_provider
      } = this.props.withdraw_order


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
          value:account_from.currency_type === 'fiat' ? `$ ${number_format(data.withdraw_info.amount)}` : data.withdraw_info.amount,
          id:7
        },
        {
          ui_name:"Total:",
          value:account_from.currency_type === 'fiat' ? `$ ${number_format(data.withdraw_info.amount_neto)}` : data.withdraw_info.amount_neto,
          icon:account_from.currency.currency,
          id:8
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

      const{
        unique_id,
        withdraw_info
      } = this.state.new_order

      let res = await this.props.action.add_update_withdraw(unique_id, 'confirmed', withdraw_info.account_from)

      if(!res){
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

      // const { data } = res
      const { new_order } = this.state

      console.log('CONFIRMAR ORDEN DATA RES', new_order)

      let new_withdraw = {
        account_id:withdraw_info.account_from,
        amount:withdraw_info.amount,
        amount_neto:withdraw_info.amount_neto,
        comment:"",
        country:withdraw_info.country,
        currency:withdraw_info.currency,
        currency_type:withdraw_info.currency_type,
        cost:withdraw_info.cost,
        cost_struct:withdraw_info.cost_struct,
        deposit_provider_id:"",
        expiration_date:new Date(),
        id:new_order.id,
        state:"confirmed",
        unique_id:new_order.unique_id,
        userId:withdraw_info.userId,
        withdraw_account:withdraw_info.withdraw_account,
        withdraw_provider:withdraw_info.withdraw_provider,
        type_order:"withdraw"
      }

      // let retiros_lista = await this.props.action.get_withdraw_list(this.props.user)
      // console.log('||||||||||||||||  Respuesta retiros lista', new_withdraw)

      const{
        account_from
      } = this.props.withdraw_order

      // console.log('FINALIZANDO', this.props)
      // alert('Finish_Him')
      // this.props.action.CurrentForm('wallets')
      await this.props.action.add_order_to('withdrawals', this.props.withdrawals, this.props.user, new_withdraw)
      await this.props.action.current_section_params({currentFilter:'withdrawals'})
      await this.props.action.update_activity_account(new_withdraw.account_id, 'withdrawals')

      await this.props.action.ToggleModal()
      this.props.history.push(`/wallets/activity/${account_from.id}`)
      this.props.action.add_new_transaction_animation()

      this.props.action.CleanForm('deposit')
      this.props.action.CleanForm('withdraw')
      this.props.action.CleanForm('bank')


      if(this.state.AddNotification){
        setTimeout(async()=>{
          const {withdraw_account} = new_withdraw
          this.props.action.AddNotification('withdraw', {id:withdraw_account})
          this.props.action.mensaje('Nueva cuenta de retiro creada', 'success')
          await this.setState({AddNotification:false})
        },2000)
      }
      setTimeout(async()=>{
        await this.props.action.ManageBalance(account_from.id, 'reduce', withdraw_info.amount)
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
        step,
        have_withdraw_accounts
      } = this.props

      const {
        need_new_acount,
        finish_step
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



    new_account_and_withdraw = async new_account =>{
      // console.log(new_account)
      const{
        withdraw_providers
      } = this.props

      let providers_served = await withdraw_provider_by_type(withdraw_providers)

      const {
        id,
        provider_type
      } = new_account

      // console.log('new_account_and_withdraw', new_account)
      // console.log('providers_served', providers_served)
        let withdraw_list = await this.props.action.get_withdraw_accounts(this.props.user, withdraw_providers, `{"where": {"userId": "${this.props.user.id}"}}`)

      await this.setState({AddNotification:true})
      await this.new_withdraw_order({withdraw_account:id, withdraw_provider:providers_served[provider_type].id})
      // console.log('withdraw_account_list', withdraw_list)

    }



    render(){

      const {
        currency,
        available,
        step,
        withdraw_account_list
      } = this.props

      const{
        amount,
        withdraw_providers,
        need_new_acount,
        show_list_accounts,
        finish_step,
        ticket,
        ticket_label_loader,
        color_loader
      } = this.state

      // console.log('||||||| ---- -Esta gonorrea necesita cuenta?', this.state.need_new_acount)

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
                        inherit_account_list={withdraw_account_list}
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

  const{
    current_wallet
  } = state.ui.current_section.params

  const{
    withdraw_accounts,
    user,
    user_id,
    withdraw_providers,
    wallets,
    withdrawals,
    balances
  } = state.model_data

  const{
    withdraw_provider,
    withdraw_account,
    account_from
  } = state.form.form_withdraw

  // console.log('Antes de reeeeeeenderizar : : : : ', user[user_id].withdraw_accounts.length>0)
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
      account_from:account_from && wallets[account_from],
      withdraw_account:withdraw_account && withdraw_accounts[withdraw_account],
      withdraw_provider:withdraw_provider && withdraw_providers[withdraw_provider]
    },
    withdrawals:withdrawals,
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
