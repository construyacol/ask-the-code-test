import React, {Fragment, Component} from 'react'
import ItemList from './viewItem'
import OrderItem from './order_item'
// import { serve_orders, ticketModalView } from '../../../services'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
// import OrderDetail from '../modal/render/orderDetail'
// import SimpleLoader from '../loaders'



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

  // componentDidMount(){
  //   this.props.action.CurrentForm('ticket')
  //   this.init_activity()
  // }

  componentDidUpdate(prevProps){
    if(this.props.tx_path !== prevProps.tx_path){
      this.contraer()
    }
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



  delete_order_confirmation = (id) =>{
    this.props.action.confirmationModalToggle()
    this.props.action.confirmationModalPayload({
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
      tx_path,
      // user
    } = this.props

    // this.props.action.isAppLoading(true)
    await this.setState({
      current_order_loader:id,
      deleting:true
    })

    let deleted = tx_path === 'deposits' && await this.props.action.delete_deposit_order(id)

    if(!deleted){
      // await this.setState({deleting:false, current_order_loader:0})
      return false
    }

      // await this.setState({deleting:false,deleted:true})

      console.log('|||||||||||||||||||||||||||||||||||||||||||||| DELETE__ORDER :', deleted, id)


      // this.setState({
      //   // expandidoMax:(this.props.expandidoMax - 100),
      //   expandible:this.state.expandido ? (this.props.expandidoMax) : '90px'
      // });

      await this.setState({deleting:false, current_order_loader:0})
      this.props.action.isAppLoading(false)
      // this.setState({deleted:true})
      // this.props.action.mensaje('Orden eliminada con exito', 'success')

  }

  confirmPayment = async(props) => {

    const{
      ticket
    } = props


    const { primary_path, account_id, path, tx_path } = this.props.match.params
    this.props.history.push(`/${primary_path}/${path}/${account_id}/${tx_path}/${ticket.id}`)

    this.props.action.toggleModal()
    setTimeout(()=>{
      this.props.action.IncreaseStep('ticket')
    }, 170)

    setTimeout(()=>{
      let inputFile = document.getElementById("TFileUpload");
      if(!inputFile){return false}
      inputFile.click()
    }, 740)

    this.props.history.push('?form=upload_deposit_payment_proof')

  }



  verTicket = async(ticket) =>{

    const { primary_path, account_id, path, tx_path } = this.props.match.params
    this.props.history.push(`/${primary_path}/${path}/${account_id}/${this.props.isWithdraws ? "withdraws" : tx_path}/${ticket.id}`)
    this.props.action.cleanNotificationItem('wallets', 'order_id')

    // const{
    //   state
    // } = ticket

    // const{
    //   current_form
    // } = this.props

    this.props.action.toggleModal()
    // console.log('||||||||||||||||||| ======> Ticket ACTIVITY ==> ',  ticket)

  }

  openOrder = async() => {
    const OrderDetail = await import('../modal/render/orderDetail')
    this.props.action.renderModal(()=><OrderDetail.default/>)
  }




  render(){

    const {
      newDepositStyle,
      loader,
      short_name,
      swap_done_out,
      // currentFilter,
      activity,
      pending,
      expandidoMax,
      lastPending,
      currencies,
      tx_path
    } = this.props

    const{
      expandible,
      expandido,
      // filter,
      current_order_loader,
      deleting,
      deleted
    } = this.state

    // console.log('|||||||||||| ____________________________________________ACTIVITY LIST! ', this.props)
    // let OrderRender
    // OrderItem

    return(
        <Fragment>
          {
            tx_path !== 'swaps' &&
            <section className="ALpendingMom" style={{display:pending ? 'block' : 'none' }}>
              <p className="ALtext fuente" style={{display:(pending) ? 'block' : 'none' }}>Pendiente </p>
              <div className="ALpendingCont" style={{height:`${expandible}px`}}>
                <div className="ALlist" style={{height:`${expandidoMax}px`}}>
                  {
                    activity &&
                    activity.map((item, indx)=>{
                      if((item.state === 'accepted' || item.state === 'canceled' || item.state === 'rejected' ) || ((tx_path === 'withdraws' && item.state === 'pending') && item.currency_type !== 'crypto')){return null}
                      if(item.state === 'pending' && item.currency_type === 'crypto'){return null}
                      if(this.props.tx_path === 'deposits' || this.props.tx_path === 'withdraws'){
                        return <OrderItem
                          order={{...item}}
                          handleAction={this.verTicket}
                          key={indx}
                        />
                      }else{
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
                          {...this.props}
                        />
                      }

                      // console.log('ConFill AFTER', item, item.state, indx, ' - ', activity.length)

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
          }

              <section className={`ALactivity ${(pending && tx_path !== 'swaps') ? 'ALactivityPending' : ''}`}>
                {/* <p className="ALtext fuente" style={{marginBottom:swap_done_out ? '115px' : '15px', transition:swap_done_out ? '1s' : '.01s'}}>Actividad</p> */}
                <p className="ALtext fuente">Actividad</p>
                <div className="ALlistAll">
                  {
                    activity.map((item, index) => {
                      if((item.state !== 'accepted' && item.state !== 'canceled' && item.state !== 'rejected') && tx_path !== 'swaps'){return false}
                        if(this.props.tx_path === 'deposits' || this.props.tx_path === 'withdraws' || this.props.tx_path === 'swaps'){
                          return <OrderItem
                                  index={index}
                                  handleAction={this.openOrder}
                                  order={item}
                                  key={index}
                                />
                        }else{
                          return (<ItemList
                            key={item.id}
                            confirmPayment={this.confirmPayment}
                            verTicket={this.verTicket}
                            delete_order={this.delete_order_confirmation}
                            ticket={item}
                            short_name={short_name}
                            notifier_type="wallets"
                            {...this.props}
                          />)
                        }
                      })
                  }
                </div>
              </section>
    </Fragment>

    )
  }
}

function mapStateToProps(state, props){

  const { user, user_id, currencies, wallets } = state.modelData
  const { params } = props.match
  // const { current_wallet } = props
  const { currentFilter } =state.ui.current_section.params
  const { activity_for_account } = state.storage
  let pending_index = `pending_${params.tx_path}`
  let current_wallet = wallets[params.account_id]

  let pending_activity = activity_for_account[params.account_id] && activity_for_account[params.account_id][pending_index]

  if(props.isWithdraws) {
    pending_activity = {}
  }

  // console.log('|||||||||||||||||||||||||||||||||||| ACTIVITY COMPONENT ==> ', pending_activity)
  let currency_list

    if(!props.isWithdraws && currencies && current_wallet.currency_type === 'crypto'){
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
    newDepositStyle:state.ui.current_section.params.new_order_style,
    currentFilter:currentFilter,
    tx_path:params.tx_path,
    loader:state.isLoading.loader,
    short_name:state.ui.current_section.params.short_name,
    swap_done_out:state.ui.current_section.params.swap_done_out,
    user:user,
    // current_activity_account:activity_for_account[current_wallet.id],
    // activity:activity_for_account[current_wallet.id] && activity_for_account[current_wallet.id][params.tx_path],
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
