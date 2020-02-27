import React, {Fragment, Component} from 'react'
import ItemList from './viewItem'
import { serve_orders, ticketModalView } from '../../../services'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../loaders'
import ActivityFilters from './filters'

import './activity_view.css'



class ActivityList extends Component {

  state = {
    activity:null,
    expandible:90,
    expandido:false,
    filter:true,
    current_order_loader:null,
    deleting:null,
    deleted:null
  }

  componentDidMount(){
    this.props.action.CurrentForm('ticket')
    // console.log('|||||||||||||||||||||||||||||||||||| ACTIVITY COMPONENT ==> ', this.props)
    this.init_activity()
  }



  init_activity = async() =>{


        const {
          current_wallet,
          local_currency,
          current_pair,
          history,
          currentFilter
        } = this.props


        let activity_list = []


        // Si hay actividad previa en redux, cargue esa actividad
        if(this.props.activity){
          // alert('si hay activity')
          activity_list = this.props.activity
        }

        // Si no hay actividad entonces procesela por el tipo de actividad activo (currentFilter)
        if(activity_list.length<1){
          // console.log('|||||||||||||||||||||||||||||||||||| ACTIVITY COMPONENT ==> ', this.props)
        activity_list = await this.filter_activity(currentFilter)
        }

        // Si no hay actividad de ese tipo (currentFilter), entonces busque por cada uno de los tipos disponibles (deposito, withdraw, currentFilter), Hasta que encuentre..

        if(activity_list.length<1){
        activity_list = await this.filter_activity('deposits')
        await this.props.action.current_section_params({currentFilter:'deposits'})
        }

        if(activity_list.length<1){
        activity_list = await this.filter_activity('withdrawals')
        await this.props.action.current_section_params({currentFilter:'withdrawals'})
        }

        if(activity_list.length<1){
          activity_list = await this.filter_activity('swaps')
          await this.props.action.current_section_params({currentFilter:'swaps'})
        }


        if(!activity_list){return false}
        await this.props.action.update_activity_account(current_wallet.id, this.props.currentFilter, activity_list)
        let updated_activity = await this.filter_activity(this.props.currentFilter)

        if(this.props.activity.length !== updated_activity.length){
          await this.props.action.update_activity_account(current_wallet.id, this.props.currentFilter, updated_activity)
        }


        if(!current_pair){this.props.action.get_pair_default(current_wallet, local_currency, current_pair)}

        if(this.props.activity.length<1 && current_wallet){
          history.push(`/wallets/deposit/${current_wallet.id}`)
          return this.props.action.current_section_params({activity:false})
        }

        await this.props.action.current_section_params({activity:true})
        await this.props.action.update_pending_activity()



  }








  filter_activity = async(filter) =>{

    const {
      current_wallet,
      user
    } = this.props

    let activity_list = []

    // console.log('||||||||||||||||||||||||||||||||| filter_activity', filter, this.props[filter])
    if(this.props[filter] && user[filter].length>0){
        activity_list = await serve_orders(current_wallet.id, filter)
      }

    return activity_list
  }








  expandir = () =>{


    const {
      expandidoMax
    } = this.props

    this.setState({
      expandible:expandidoMax,
      expandido:true
    })
  }



  contraer = () =>{

    this.setState({
      expandible:90,
      expandido:false
    })
  }


  trigger_action = filter =>{
    return (filter === 'deposits' ? 'get_deposit_list' :
            filter === 'withdrawals' ? 'get_withdraw_list' :
            filter === 'swaps' ? 'get_swap_list' :
            filter === 'activity' && 'get_activity_list')
  }





  delete_order_confirmation = (id) =>{
    alert('delete')

    this.props.action.ConfirmationModalToggle()
    this.props.action.ConfirmationModalPayload({
      title:"Esto es importante, estas a punto de...",
      description:"Eliminar esta orden, ¿Estas seguro de hacer esto?",
      txtPrimary:"Eliminar",
      txtSecondary:"Cancelar",
      payload:id,
      action:this.delete_order,
      img:"deleteticket"
    })

  }

  delete_order = async(id) =>{

    alert('delete order')

    const{
      currentFilter,
      user
    } = this.props

    this.props.action.Loader(true)
    await this.setState({
      current_order_loader:id,
      deleting:true
    })

    let deleted = await this.props.action.delete_deposit_order(id)
    // let deleted = currentFilter === 'withdraws' ? await this.props.action.delete_withdraw_order(id) : await this.props.action.delete_deposit_order(id)

    // const {
    //   count
    // } = deleted
    return console.log('_______________________DELETE API SERVICE ENDPOINT', deleted)

    if(!deleted){
      await this.setState({deleting:false, current_order_loader:0})
      return false
    }

    await this.setState({deleting:false,deleted:true})

      this.props.action.exit_sound()
      let trigger_action = await this.trigger_action(currentFilter)
      await this.props.action[trigger_action](user)

      // console.log('|||| CURRENT DEPOSIT LIST BEFORE - trigger_action', currentFilter,  trigger_action)

      await this.props.action.update_pending_activity(this.props.current_wallet.id, currentFilter)
      await this.props.action.update_activity_account(this.props.current_wallet.id, currentFilter)
      await this.props.action.update_pending_activity(this.props.current_wallet.id, currentFilter)


      // await this.setState({
      //   activity:current_activity,
      //   expandible:90,
      //   expandido:false
      // })

      this.setState({
        // expandidoMax:(this.props.expandidoMax - 100),
        expandible:this.state.expandido ? (this.props.expandidoMax) : '90px'
      });
      this.props.action.Loader(false)
      this.setState({deleted:false})
      this.props.action.mensaje('Orden eliminada con exito', 'success')

  }

  confirmPayment = async(props) =>{

    const{
      ticket
    } = props

    const{
      state
    } = ticket

    const{
      current_form
    } = this.props

    // console.log(`Confirmando pago ${current_form}`)


    await this.props.action.CleanForm(current_form)
    let view = await ticketModalView(state)
    await this.props.action.UpdateForm(current_form, ticket)
    await this.props.action.ModalView(view)
    this.props.action.ToggleModal()
    setTimeout(()=>{
      this.props.action.IncreaseStep(current_form)
    }, 170)
    // console.log(`Confirmando pago ${current_form} -- ${view}`)

    setTimeout(()=>{
      let inputFile = document.getElementById("TFileUpload");
      inputFile.click()
    }, 740)




  }



  verTicket = async(props) =>{

    this.props.action.CleanItemNotifications('wallets', 'order_id')

    const{
      ticket
    } = props


    const{
      state
    } = ticket

    const{
      current_form
    } = this.props

    await this.props.action.CleanForm(current_form)
    let view = await ticketModalView(state)
    // await this.props.action.CurrentForm('ticket')
    // console.log('verTicket', props)
    await this.props.action.UpdateForm(current_form, ticket)

    await this.props.action.ModalView(view)
    this.props.action.ToggleModal()

  }


  toggleFilter = () => {
    this.setState({
      filter:!this.state.filter
    })
  }


  filterChange = async(e) =>{
    let value = e.target.id


    // let current_activity = await this.filter_activity(value)

    await this.props.action.current_section_params({currentFilter:value})
    let current_activity = this.props.current_activity_account[value] || []
    current_activity = current_activity.length>0 ? current_activity : await this.filter_activity(value)
    if(current_activity && current_activity.length === 0){
      return this.init_activity()
    }

    // console.log('________________________CURRENT ACTIVITY:::::', current_activity)

    await this.props.action.update_activity_account(this.props.current_wallet.id, value, current_activity)
    await this.setState({
      activity:current_activity,
      expandible:90,
      expandido:false
    })

    await this.props.action.update_pending_activity()

  }








  render(){
    const {
      newDepositStyle,
      loader,
      short_name,
      swap_done_out,
      currentFilter,
      activity,
      pending,
      expandidoMax,
      lastPending,
      currencies
    } = this.props

    const{
      expandible,
      expandido,
      filter,
      current_order_loader,
      deleting,
      deleted
    } = this.state

    // console.log('|||||||||||| ____________________________________________ACTIVITY LIST! ', this.props)

    return(
      <div className="ActivityView">

        <ActivityFilters
          filter={filter}
          currentFilter={currentFilter}
          filterChange={this.filterChange}
          toggleFilter={this.toggleFilter}
        />


        {
          (activity && activity.length>0) ?
            <Fragment>

              <section className="ALpendingMom" style={{display:pending ? 'block' : 'none' }}>
                <p className="ALtext" style={{display:(pending) ? 'block' : 'none' }}>Pendiente </p>
                  <div className="ALpendingCont" style={{height:`${expandible}px`}}>
                    <div className="ALlist" style={{height:`${expandidoMax}px`}}>
                      {
                          activity &&
                            activity.map(item=>{
                              // console.log('ConFill', item)
                              if((item.state === 'accepted' || item.state === 'canceled' || item.state === 'rejected') || (item.type_order === 'withdraw' && item.state === 'pending' && item.currency_type !== 'crypto')){return false}
                              return <ItemList key={item.id}
                                      confirmPayment={this.confirmPayment}
                                      lastPendingId={lastPending}
                                      newDepositStyle={newDepositStyle}
                                      verTicket={this.verTicket}
                                      delete_order={this.delete_order_confirmation}
                                      ticket={item}
                                      loader={loader}
                                      current_order_loader={current_order_loader}
                                      deleting={deleting}
                                      deleted={deleted}
                                      currencies={currencies}
                                       />
                            })
                      }
                    </div>
                  </div>
                  <p className="ALverTodo" onClick={this.expandir} style={{display:((expandidoMax/100) <2 || expandido) ? 'none' : 'block'}}>
                  {/* <p className="ALverTodo" onClick={this.expandir} style={{display:expandido ? 'none' : 'block'}}> */}
                    Ver todo
                    <span>+{(expandidoMax/100)-1}</span>
                    <i className="fas fa-angle-down"></i>
                  </p>
                  <p className="ALverTodo" onClick={this.contraer} style={{display:(expandidoMax/100) <2 || !expandido ? 'none' : 'block'}}>Reducir
                    <i className="fas fa-angle-up"></i>
                  </p>
              </section>

              <section className={`ALactivity ${pending ? 'ALactivityPending' : ''}`}>
                <p className="ALtext" style={{marginBottom:swap_done_out ? '115px' : '15px', transition:swap_done_out ? '1s' : '.01s'}}>Actividad</p>
                <div className="ALlistAll">
                  {
                    activity.map(item=>{
                      if(item.state !== 'accepted' && item.state !== 'canceled' && item.state !== 'rejected'){return false}
                      return (<ItemList
                              key={item.id}
                              confirmPayment={this.confirmPayment}
                              verTicket={this.verTicket}
                              delete_order={this.delete_order_confirmation}
                              ticket={item}
                              short_name={short_name}
                              notifier_type="wallets"
                               />)
                      })
                  }
                </div>
              </section>
            </Fragment>
          :
          <div className="loaderActivityList">
            <SimpleLoader label="Cargando tu actividad..."/>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state, props){


  // console.log('|||||||||||||||||||||||||||||||||||| ACTIVITY COMPONENT ==> ', props)

  const { user, user_id, currencies } = state.model_data
  const { current_wallet } = props
  const { currentFilter } =state.ui.current_section.params
  const { activity_for_account } = state.storage
  let pending_index = `pending_${currentFilter}`
  let pending_activity = activity_for_account[current_wallet.id] && activity_for_account[current_wallet.id][pending_index]

  let currency_list

    if(currencies && current_wallet.currency_type === 'crypto'){
      currencies.map(currency=>{
        return currency_list = {
          ...currency_list,
          [currency.currency]:{
            ...currency
          }
        }
      })
    }

  return{
    newDepositStyle:state.ui.current_section.params.new_deposit_style,
    currentFilter:currentFilter,
    current_form:state.form.current,
    loader:state.isLoading.loader,
    short_name:state.ui.current_section.params.short_name,
    swap_done_out:state.ui.current_section.params.swap_done_out,
    user:user[user_id],
    current_activity_account:activity_for_account[current_wallet.id],
    activity:activity_for_account[current_wallet.id] && activity_for_account[current_wallet.id][currentFilter],
    currencies:currency_list,
    ...pending_activity
  }
}

function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}



export default connect(mapStateToProps, mapDispatchToProps) (ActivityList)
