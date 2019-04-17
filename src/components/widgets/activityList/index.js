import React, {Fragment, Component} from 'react'
import ItemList from './viewItem'
import { matchItem, serve_orders, serve_activity_list, ticketModalView } from '../../../services'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../loaders'
import ActivityFilters from './filters'

import './activity_view.css'

class ActivityList extends Component {

  state = {
    activity:null,
    pending:false,
    expandible:90,
    expandidoMax:0,
    expandido:false,
    lastPending:"",
    filter:true,
    current_order_loader:null,
    deleting:null,
    deleted:null
  }

  componentDidMount(){
    this.props.action.CurrentForm('ticket')
    this.init_activity()
    this.props.action.current_section_params({methods:{activity:{update_list:this.update_state_list}}})
  }

  componentWillReceiveProps(nextProps){
    // console.log('componentWillReceiveProps', nextProps.currentFilter !== this.props.currentFilter, this.props)
    if(this.state.activity && this.state.activity.length<1){
      this.init_activity()
    }

    // nextProps.currentFilter !== this.props.currentFilter ||
  }


  init_activity = async() =>{

        const {
          wallets,
          current_wallet,
          local_currency,
          current_pair,
          history,
          user,
          action,
          currentFilter
        } = this.props


        let activity_list = []
        activity_list = await this.filter_activity(currentFilter)

        // console.log('|||||||||||||||||||||||||||||ESTE ES EL FILTRO ACTUAL:::::', currentFilter, user[currentFilter], 'USER:::', user, '::::::activity_list::', activity_list)

        if(activity_list.length<1){
        activity_list = await this.filter_activity('deposits')
        this.props.action.current_section_params({currentFilter:'deposits'})
        }

        if(activity_list.length<1){
        activity_list = await this.filter_activity('withdrawals')
        this.props.action.current_section_params({currentFilter:'withdrawals'})
        }

        if(activity_list.length<1){
          activity_list = await this.filter_activity('swaps')
          this.props.action.current_section_params({currentFilter:'swaps'})
        }

        // console.log('||||||||||||||| activity_list', activity_list)

        if(!activity_list){return false}
        await this.setState({
          activity:activity_list
        })

        if(!current_pair){this.props.action.get_pair_default(current_wallet, local_currency, current_pair)}

        if(this.state.activity.length<1 && current_wallet){
          history.push(`/wallets/deposit/${current_wallet.id}`)
          return this.props.action.current_section_params({activity:false})
        }

        this.props.action.current_section_params({activity:true})
        this.calcul_pending_section()
  }






  trigger_action = filter =>{
    let trigger_action
    return  trigger_action = (filter === 'deposits' ? 'get_deposit_list' :
                              filter === 'withdrawals' ? 'get_withdraw_list' :
                              filter === 'swaps' ? 'get_swap_list' :
                              filter === 'activity' && 'get_activity_list')
  }


  filter_activity = async(filter) =>{

    const {
      current_wallet,
      user,
      action,
      wallets
    } = this.props

    let activity_list = []

    // let trigger_action = await this.trigger_action(filter)
    // console.log('||||||||||||||||||||||||||||||||| ESTA ES LA LISTA TALES', filter, this.props[filter])
    if(this.props[filter] &&  user[filter].length>0){
        activity_list = await serve_orders(user[filter], this.props[filter], current_wallet && current_wallet.id, filter)
      }

    // if(!this.props[filter]){activity_list = await serve_activity_list(action[trigger_action], user, current_wallet, filter, wallets)}
    return activity_list
  }





  calcul_pending_section = async()=>{

    const{ activity} = this.state
    const{ currentFilter, current_wallet } = this.props

    // let pending = await matchItem(activity, {primary:'pending'}, 'state', true)
    let pending = (currentFilter === 'withdrawals' && current_wallet.currency_type === 'fiat') ? 0 : await matchItem(activity, {primary:'pending'}, 'state', true)
    let confirmed = await matchItem(activity, {primary:'confirmed'}, 'state', true)
    let rejected = await matchItem(activity, {primary:'rejected'}, 'state', true)
    this.setState({expandidoMax:(((pending && pending.length) + (confirmed && confirmed.length) + (rejected && rejected.length))*100)});

    pending ? this.setState({pending:true, lastPending:(currentFilter === 'withdrawals' && current_wallet.currency_type === 'fiat') ? confirmed[0].id : pending[0].id}) :
    // pending ? this.setState({pending:true, lastPending:pending[0].id}) :
    rejected ?  this.setState({pending:true, lastPending:rejected[0].id}) :
    confirmed ?  this.setState({pending:true, lastPending:confirmed[0].id}):
    this.setState({pending:false, lastPending:false})


  }


  expandir = () =>{
    const {
      activity
    } = this.props

    const {
      expandidoMax
    } = this.state

    this.setState({
      expandible:expandidoMax,
      expandido:true
    })
  }



  contraer = () =>{

    const {
      expandidoMax
    } = this.state

    this.setState({
      expandible:90,
      expandido:false
    })
  }


  update_state_list = (list) =>{
    this.setState({
      activity:list
    })
    setTimeout(()=>{
      this.calcul_pending_section()
    }, 1500)
  }

  update_activity_list = async() =>{

    const {
      action,
      user,
      current_wallet,
      wallets,
      currentFilter
    } = this.props

    let trigger_action = await this.trigger_action(currentFilter)

    // console.log('CURRENT DEPOSIT LIST BEFORE', currentFilter)

    let activity_list = await serve_activity_list(action[trigger_action], user, current_wallet, currentFilter, wallets)

    // console.log('|11|||||||  TRIGGER ACTION::::::', activity_list)
    // console.log('CURRENT DEPOSIT LIST AFTER', activity_list)

    await this.setState({
      activity:activity_list
    })

    let pending = await matchItem(this.state.activity, {primary:'pending'}, 'state', true);
    pending && this.setState({pending:true, lastPending:pending[0].id})

  }




  delete_order_confirmation = (id) =>{
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

    const{
      currentFilter
    } = this.props

    this.props.action.Loader(true)
    await this.setState({
      current_order_loader:id,
      deleting:true
    })

    let deleted = currentFilter === 'withdrawals' ? await this.props.action.delete_withdraw_order(id) : await this.props.action.delete_deposit_order(id)

    const {
      count
    } = deleted

    if(count<0){
      await this.setState({deleting:false, current_order_loader:0})
      return false
    }

    await this.setState({deleting:false,deleted:true})

    this.props.action.exit_sound()
      await this.update_activity_list()

      this.calcul_pending_section()
      this.setState({
        expandidoMax:(this.state.expandidoMax - 100),
        expandible:this.state.expandido ? (this.state.expandidoMax - 100) : '90px'
      });
      this.props.action.Loader(false)
      this.setState({deleted:false})
      this.props.action.mensaje('Orden eliminada con exito', 'success')

  }

  confirmPayment = async(props) =>{

    const{
      ticket
    } = props


    let new_ticket = {
      ...ticket,
      update_activity_list:this.update_activity_list
    }

    const{
      state
    } = ticket

    const{
      current_form
    } = this.props

    // console.log(`Confirmando pago ${current_form}`)


    await this.props.action.CleanForm(current_form)
    let view = await ticketModalView(state)
    await this.props.action.UpdateForm(current_form, new_ticket)
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

    const{
      ticket
    } = props

    // console.log('|||||||||  ver TICKET', ticket)
    let new_ticket = {
      ...ticket,
      update_activity_list:this.update_activity_list
    }

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
    await this.props.action.UpdateForm(current_form, new_ticket)

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

    let current_activity = await this.filter_activity(value)

    this.props.action.current_section_params({currentFilter:value})
    await this.setState({
      activity:current_activity,
      expandible:90,
      expandido:false
    })

    this.calcul_pending_section()

    // this.toggleFilter()
  }



// handleSongLoading = props =>{
//   console.log('handleSongLoading', props)
//   props.play()
// }




  render(){
    const {
      newDepositStyle,
      loader,
      short_name,
      swap_done_out,
      currentFilter
    } = this.props

    const{
      pending,
      expandible,
      expandido,
      expandidoMax,
      lastPending,
      filter,
      current_order_loader,
      activity,
      deleting,
      deleted
    } = this.state

    // console.log('|||||||||||| PENDIENTE PARIENTE ARRE! ', activity)

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
                              if(item.state === 'accepted' || item.state === 'canceled' || (item.type_order === 'withdraw' && item.state === 'pending' && item.currency_type !== 'crypto')){return false}
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
                      if(item.state !== 'accepted' && item.state !== 'canceled'){return false}
                      return (<ItemList
                              key={item.id}
                              confirmPayment={this.confirmPayment}
                              verTicket={this.verTicket}
                              ticket={item}
                              short_name={short_name}
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
  const { deposits, withdrawals, swaps, activity } = state.model_data
  return{
    newDepositStyle:state.ui.current_section.params.new_deposit_style,
    currentFilter:state.ui.current_section.params.currentFilter,
    current_form:state.form.current,
    loader:state.isLoading.loader,
    short_name:state.ui.current_section.params.short_name,
    swap_done_out:state.ui.current_section.params.swap_done_out
  }
}

function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}



export default connect(mapStateToProps, mapDispatchToProps) (ActivityList)
