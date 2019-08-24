import React, { Fragment, Component } from 'react'
import { number_format } from '../../../services'
import { PaymentConfirButton } from '../buttons/buttons'
import IconSwitch from '../icons/iconSwitch'
import { connect } from 'react-redux'
import SimpleLoader from '../loaders'
import SwapAnimation from '../swapAnimation/swapAnimation'
import moment from 'moment'
import 'moment/locale/es'
import PopNotification from '../notifications'
 moment.locale('es')

class ItemList extends Component{

// states:
// pending
// processing
// done / error



detail = async() =>{
  // console.log('Ey arnold',this.props.ticket)
  let proceed = await this.can_proceed()
  if(proceed){return false}
  this.props.verTicket(this.props)
}


detail_payment = async() =>{
  let proceed = await this.can_proceed()
  if(proceed){return false}

  this.props.confirmPayment(this.props)
}


delete = async() => {
  let proceed = await this.can_proceed()
  if(proceed){return false}
  this.props.delete_order(this.props.ticket.id)
}


can_proceed = () =>{
  const {
    deleting,
    current_order_loader
  } = this.props

  if(deleting && current_order_loader){return false}
}




render(){

  let movil_viewport = window.innerWidth < 768


  const {
    newDepositStyle,
    ticket,
    loader,
    current_order_loader,
    deleting,
    deleted,
    short_name,
    lastPendingId,
    socket_swap,
    swap_done_id,
    swap_done_out,
    swap_done_in,
    account_to
  } = this.props

  const {
    state,
    id,
    amount,
    currency_type,
    type_order,
    spent,
    currency,
    currency_bought
  } = ticket

    // let new_date = new Date(ticket.created_at).toLocaleDateString()
    // console.log('||||||||||||||||| -- - - -- DÍA ', moment(ticket.created_at).format("DD"), '==>', new_date)
    // console.log('||||||||||||||||| -- - - -- MES ', moment(ticket.created_at).format("MMM"), '==>', new_date)

    // if(ticket.state === 'confirmed'){
    //   console.log('__________________________________________this.props', this.props.currencies, ticket)
    // }

  const atributos ={
    icon:currency_bought && currency_bought.currency,
    size:18,
    color:'#1babec'
    // color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`
  }

  const atributos2 ={
    icon:currency && currency.currency,
    size:14,
    color:'#1babec'
  }


  // cost lo tomamos como referencia para diferenciarlo como deposito


  let statePendingSwap = socket_swap.state && socket_swap.id === id ? socket_swap.state : state
  // let pendingSwap = unique_id === id && type_order === 'swap'
  let pendingSwap = type_order === 'swap' && (statePendingSwap === 'pending' || statePendingSwap === 'processing' || statePendingSwap === 'done' ) ? true : false

  const current_swap_done = swap_done_id === id ? swap_done_id : null

  return(
    <div className={`NDCont ${statePendingSwap === 'error' ? 'errorSwap' : ''}     ${account_to ? 'swap_bought': ''} ${(current_swap_done && swap_done_out) ? 'current_swap_done_out' : (current_swap_done && swap_done_in) ? 'current_swap_done_in' : ''} ${(lastPendingId === id && newDepositStyle)? 'newDepositContainer' : (deleting && current_order_loader === id) ? 'deletingWallet' : (deleted && current_order_loader === id) ? 'walletDeleted' :  'newDepositContainern' }`}>
    <div  id={`${id}`} className={`ItemList fuente  ${(current_swap_done && swap_done_out) ? 'current_swap_done_item_out' : (current_swap_done && swap_done_in) ? 'current_swap_done_item_in' : ''}  ${(pendingSwap && statePendingSwap === 'processing') ? 'swaProcessing' : (pendingSwap && statePendingSwap === 'done') ? 'swapDone' : ''}   ${(lastPendingId === id && newDepositStyle)? 'newDepositStyle' : (deleted && current_order_loader === id) ? 'deletedDepositStyle' : '' } ${state === 'pending' ? 'pending' : state === 'accepted' ? 'accepted' : (state === 'confirmed' && currency_type === 'crypto') ? 'confirmedCrypto' : (state === 'confirmed' && currency_type !== 'crypto') ? 'confirmed' : state === 'rejected' ? 'rejected' : 'canceled'}`} >

      {
        pendingSwap &&
        <div className="barraSwap">
          <div className={`relleno ${(statePendingSwap === 'pending') ? 'swaPending' :
            (statePendingSwap === 'processing') ? 'swaProcessing' :
            (statePendingSwap === 'done') ? 'swapDone' : ''
            }`}>
          </div>
        </div>
      }

      {
       statePendingSwap !== 'error' &&
       <div className={`ALDetail ${(loader && current_order_loader === id) ? 'InProcess' : ''}`} onClick={this.detail}></div>
      }

      <div className={`ItemLeft ${(currency_type !== 'crypto' && (state === 'pending' || state === 'rejected') && type_order !== 'swap') ? 'delete' : 'normal' }`}>
        {
          ((state === 'pending' || state === 'rejected') && type_order !== 'swap')&&
          <div className="contenDe tooltip" onClick={this.delete}>
            <div id="Aldelete">
              <i className="far fa-times-circle "></i>
            </div>
            <span className="tooltipDelete fuente">Eliminar</span>
          </div>
        }


        {
          !movil_viewport &&
          <Fragment>
            {
              (type_order === 'swap' && pendingSwap) ?
                <div className="loaderViewItem" >
                  {
                    statePendingSwap !== 'done' ?
                    <SimpleLoader loader={2}/>
                    :
                    <div className="successIcon">
                      <IconSwitch  icon="success" size={80}  color="#1cb179" />
                    </div>
                  }
                </div>
              :
                  (currency_type === 'crypto' && state === 'confirmed' && type_order === 'deposit') ?
                    <div className="ConfirmedTxT fuente2">
                      <p>
                        {ticket.confirmations} <span>/{this.props.currencies && this.props.currencies[ticket.currency.currency].confirmations}</span>
                      </p>
                    </div>
                  :
                    <div className="fecha">


                      <p className="ALdayDate fuente2"  style={{color:(currency_type === 'fiat'  && (state === 'pending' || state === 'confirmed')) ? '#ff8660' : '#1cb179'}}>{moment(ticket.created_at).format("DD")}</p>
                      <p className="ALmonthDate" style={{color:(currency_type === 'fiat' && (state === 'pending' || state === 'confirmed')) ? '#ff8660' :'#1cb179'}}>{moment(ticket.created_at).format("MMM").toUpperCase()}</p>
                    </div>
            }
          </Fragment>
        }




        {
          ((type_order === 'swap' && pendingSwap) && statePendingSwap !== 'done') ?
            <SwapAnimation
              from={currency.currency}
              to={currency_bought}
              colorIcon={statePendingSwap === 'done' ? '#1cb179' : statePendingSwap === 'processing' ? '#77b59d' : statePendingSwap === 'pending' && '#ff8660' }
            />
          :
          <Fragment>
            {
              (state === 'canceled' || statePendingSwap === 'error') ?
                <i className={`fas fa-times`} style={{color:'#1cb179'}}></i>
              :
                <i
                  style={{color:(state === 'accepted' || statePendingSwap === 'done') ? '#1cb179': state === 'pending' ? '#ff8660':((state === 'pending' && !pendingSwap) || (state === 'confirmed' && !pendingSwap && currency_type !== 'crypto')) ? '#ff8660' : (state === 'confirmed' && currency_type === 'crypto') && '#1cb179'}}
                  className={`action_type ${type_order === 'deposit' ? 'fas fa-arrow-down' : type_order === 'swap' ? 'fas fa-retweet' : type_order === 'withdraw' ? 'fas fa-arrow-up' : ''}`} ></i>
            }

            <p className="action_type_text"  style={{color:statePendingSwap === 'done' ? '#1cb179' :
              ((state === 'pending' && !pendingSwap) || (state === 'confirmed' && !pendingSwap && currency_type !== 'crypto') ) ? '#ff8660':
              (state === 'confirmed' && currency_type === 'crypto') ? '#1cb179':
              (state === 'accepted' && !pendingSwap ) ? '#1cb179':
              (pendingSwap && statePendingSwap === 'processing') ? '#67867a' :
              (pendingSwap && statePendingSwap === 'done') ? '#1cb179' :'gray'}}
                id={`${statePendingSwap === 'done' ? 'doneState' : ''}`}
              >
              {
                type_order === 'deposit' ? 'Deposito' :
                type_order === 'swap' ? 'Intercambio' :
                type_order === 'withdraw' && 'Retiro'
              }
            </p>

            {
              movil_viewport &&
              <div className="action_date fuente2">
                {
                  moment(ticket.created_at).format("l")
                }
              </div>
            }
          </Fragment>
        }
        <PopNotification notifier={this.props.notifier_type} item_type="order_id" id={id} type="new"/>
      </div>




      <div className="ALstatus" style={{background:(statePendingSwap === 'pending') ? '#ff8660' :
        (statePendingSwap === 'processing') ? '#77b59d' :
        (statePendingSwap === 'done') ? '#1cb179' :
        (type_order !== 'swap' && state === 'pending') ? '#ff8660' :
        (state === 'accepted') ? '#1cb179' :
        (type_order !== 'swap' && (state === 'rejected' || state === 'canceled'  || statePendingSwap === 'error')) ? '#f44336' :
        (type_order !== 'swap' && state === 'confirmed') ? '#1cb179' : '#80808029'}}
      >

        <p style={{color:"white !important"}}>
          {
            type_order === 'swap' && statePendingSwap !== 'accepted' ?
            <Fragment></Fragment>
            :
            <i id="ALfar" className={`far ${state === 'pending' ? 'fa-clock' : (state === 'rejected' || state === 'canceled' || statePendingSwap === 'error') ? 'fas fa-times' : state === 'accepted' ? 'fas fa-check' : state === 'confirmed' ? 'fa-clock' : ''} `}></i>
          }

          {
            !movil_viewport &&
            <Fragment>
              {
              currency_type === 'crypto' && state ==='confirmed' && type_order === 'deposit'?
              <Fragment>
                Confirmado:
                <span className="fuente2 confirmedNumber">
                  {ticket.confirmations}/{this.props.currencies && this.props.currencies[ticket.currency.currency].confirmations}
                </span>
              </Fragment>
              :
              (type_order === 'swap' && pendingSwap) ?
              statePendingSwap === 'done' ? 'aceptado' :  statePendingSwap
                 :
              statePendingSwap === 'error' ? 'Error' : state === 'confirmed' && type_order === 'withdraw' ? 'Procesando' : state
               }
            </Fragment>
          }
        </p>
      </div>


      <div className="ItemRight">
        {
          (state === 'confirmed' && currency_type !== 'crypto' && type_order !== 'withdraw' ) ?
          <p className="fuente" id="ALrevised">En revisión <i className="far fa-clock"></i></p>
          :
          state === 'rejected' ?
            // <div>Resubir Comprobante</div>
            <PaymentConfirButton
              id="ALconfirmButton"
              clases="laReputas"
              active={true}
              type="primary"
              siguiente={this.detail_payment}
              label="Confirmar"
            />
          :
          (state === 'pending' && type_order !== 'swap' && type_order !== 'withdraw') ?
          <PaymentConfirButton
            id="ALconfirmButton"
            clases={` ${lastPendingId === id ? 'ALbuttonActive' : 'laReputas' }`}
            active={true}
            type="primary"
            siguiente={this.detail_payment}
            label="Confirmar"
          />
          :
          <Fragment>
            <div className="jopolo" style={{gridTemplateRows:(type_order === 'swap' && !account_to) ? 'repeat(2, 1fr)' : '1fr' }}>
              <div className="fuente2 ALamount pentoni"
                style={{"fontSize":'17px',
               }}>
               <p className="swapAmount" style={{
                 color:(type_order === 'deposit' || type_order === 'swap') ?'#1cb179': type_order === 'withdraw' ? 'red' : 'gray'
               }}>
                {
                  `${(type_order === 'deposit' || type_order === 'swap') ? '+' : '-'}
                   ${(currency_type ==='fiat'  && type_order !== 'swap') ? '$' : ''}`
                }
                {`${(currency_type ==='fiat' && type_order !== 'swap') ? number_format(amount) : amount  }`}
              </p>

                {
                  type_order === 'swap' ?
                  <IconSwitch {...atributos} />
                  :
                  <IconSwitch {...atributos2} />
                }
              </div>
              {
                (type_order === 'swap' && !account_to) &&
                <div className="fuente2 ALamount ALamount2 pentoni" >
                  <p style={{color:'#f44336'}}>
                    {`- ${currency_type ==='fiat' ? '$' : ''}`}
                    {`${currency_type ==='fiat' ? number_format(spent) : spent }`}
                  </p>
                  {
                    short_name ?
                    <span>{short_name.toUpperCase()}</span>
                    :
                    <IconSwitch {...atributos2} />
                  }
                </div>
              }
            </div>

              {
                !movil_viewport &&
                <i id="ALgoto" className="fas fa-angle-right" style={{color:state === 'accepted' ?'#1cb179':'gray'}}></i>
              }

          </Fragment>
        }

      </div>
    </div>
    </div>
  )
 }
}


function mapStateToProps (state, props){
  // console.log('||||||||||||||||||| - - - - ESTADO DESDE EL ITEM DE ACTIVITY', state)

  return {
    socket_swap:state.ui.current_section.params.swap_socket_channel,
    swap_done_id:state.ui.current_section.params.swap_done_id,
    swap_done_out:state.ui.current_section.params.swap_done_out,
    swap_done_in:state.ui.current_section.params.swap_done_in,
    account_to:state.ui.current_section.params.current_wallet.id === props.ticket.account_to
  }
}


export default connect(mapStateToProps) (ItemList)
