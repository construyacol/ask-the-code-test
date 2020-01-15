import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import OtherModalLayout from '../../widgets/modal/otherModalLayout'
import IconSwitch from '../../widgets/icons/iconSwitch'
import { ButtonNofity } from '../../widgets/buttons/buttons'
import { formatToCurrency } from '../../../services/convert_currency'

import './socketNotify.css'






const SocketNotify = props => {

  const [ formatCurrency, setFormatCurrency ] = useState(null)
  const { item_type, title } = props.socket_notify
  let ui_text =  `${item_type === 'deposits' ? 'deposito' : item_type === 'withdraws' ? 'retiro' : ''}`

  useEffect(()=>{

    if(props.socket_notify && props.socket_notify.amount){
      const { amount, currency } = props.socket_notify
      formatToCurrencies(amount, currency)
    }
  },[props.socket_notify])


  const formatToCurrencies = async (amount, currency) =>{
    let resul = await formatToCurrency(amount, currency, true)
    setFormatCurrency(resul)
  }

  // const modal_click = e => {
  //   const { target } = e
  //   if(target.dataset.close_modal){
  //     props.action.socket_notify(null)
  //     props.action.other_modal_toggle()
  //   }
  // }

  const close_modal = () => {
    props.action.socket_notify(null)
    props.action.other_modal_toggle()
  }



  return(
    // <OtherModalLayout on_click={modal_click}>
    <OtherModalLayout>
      {
        item_type === 'deposits' ?
          <OrderNotifyView
            title={`${title ? title : `Nuevo ${ui_text} aprobado.`}`}
            button_tittle={`Ver ${ui_text}`}
            item_type={item_type}
            formatCurrency={formatCurrency}
            close_modal={close_modal}
            {...props} />

          :

        item_type === 'withdraws' &&
          <OrderNotifyView
            title={`${title ? title : `Nuevo ${ui_text} enviado`}`}
            button_tittle={`Ver ${ui_text}.`}
            item_type={item_type}
            formatCurrency={formatCurrency}
            close_modal={close_modal}
            {...props} />

      }
    </OtherModalLayout>
  )
}


















const OrderNotifyView = props => {

  const { socket_notify, formatCurrency, currencies, close_modal, title, button_tittle } = props

  const {
    item_type,
    currency,
    // state
  } = props.socket_notify

  // console.log('||||||||||||||_____________________________________________socket_notify', props)
  const buttonAction = async(wallet_id) => {
    // console.log('||||||||||||||_____________________________________________buttonAction', wallet_id)
    props.action.socket_notify(null)
    await props.action.other_modal_toggle()
    // await props.action.current_section_params({currentFilter:item_type})
    props.history.push(`/wallets/activity/${wallet_id}/${item_type}`)
  }

  return(
    <LayoutSocketNotify>
      <div className="close_modal_btn" onClick={close_modal}><i className="fas fa-times"></i></div>

      <div className="topSection">
        <div className="backTopSection animate"></div>
        <div className="socketIconContainer in">
          <div className="wavExpansive in"></div>
          <IconSwitch
            icon={item_type}
            size={45}
            color="#11998e"
          />
        </div>
      </div>

      <div className="bottomSection">
        <h3 className="fuente">{title}</h3>
        <div className="depositAmount">
          <IconSwitch
            icon={currency.currency}
            size={35}
          />
          <p id="order_amount" className="fuenteMuseo">{formatCurrency} <span>{currencies[socket_notify.currency.currency].symbol}</span></p>
        </div>
        <ButtonNofity buttonAction={buttonAction} item_id={socket_notify.account_id}>
          <p id="ButtonNofityText" className="fuente">{button_tittle}</p>
        </ButtonNofity>
      </div>
    </LayoutSocketNotify>
  )
}










const LayoutSocketNotify = props => {

  return(
    <div className="LayoutSocketNotify swing-in-bottom-bck">
      <div className="socketContent">
        {props.children}
      </div>
    </div>
  )

}










const mapStateToProps = (state, props) => {

  const { socket_notify } = state.ui.notifications
  const { currencies } = state.model_data

  let currency_list

    if(currencies){
      currencies.map(currency=>{
        return currency_list = {
          ...currency_list,
          [currency.currency]:{
            ...currency
          }
        }
      })
    }

  return {
    socket_notify:socket_notify && socket_notify[0],
    currencies:currency_list
  }

}

const mapDispatchToProps = (dispatch) => {
  return{
    action: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (SocketNotify)
