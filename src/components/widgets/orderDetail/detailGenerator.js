import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')



const DetailGenerator = ({order, title}) => {

  const [ Orders, setOrders ] = useState([])

  const formatOrderText = (itemText) => {
    switch (itemText[0]) {
      case 'to_spend_currency':
          return ['Moneda gastada:', itemText[1].currency]
      case 'to_buy_currency':
          return ['Moneda adquirida:', itemText[1].currency]
      case 'currency':
          return ['Divisa:', itemText[1].currency]
      case 'spent':
          return ['Cantidad gastada:', itemText[1]]
      case 'bought':
          return ['Cantidad adquirida:', itemText[1]]
      case 'state':
          const state = itemText[1] === 'accepted' ? 'Aceptado' :
          itemText[1] === 'confirmed' ? 'Confirmado' :
          itemText[1] === 'pending' ? 'Pendiente' :
          itemText[1] === 'rejected' ? 'Rechazado' : 'Cancelado'
          return ['Estado:', state]
      case 'price_percent':
          return ['Comisión:', itemText[1]]
      case 'id':
          return ['Número de orden:', itemText[1]]
      case 'created_at':
          return ['Creado en:', moment(itemText[1]).format("LL")]
      case 'updated_at':
          return ['Actualizado en:', moment(itemText[1]).format("LL")]
      case 'account_to':
      case 'account_from':
      case 'type':
      case 'pair_id':
      case 'taged':
      case 'action_price':
      case 'country':
      case 'userId':
      case 'user':
      case 'cost_struct':
      case 'fee_struct':
      case 'info':
      case 'tax_struct':
      case 'account_id':
      case 'locked':
      case 'currency_type':
      case 'cost_id':
      case 'deposit_provider_id':
      case 'type_order':
          return
      default:
          return itemText
    }
  }

  useEffect(()=> {
    // the order is converted to an array and formatted
    if(!order){return}
    const transOrders = []
    for (let orderItem of Object.entries(order)) {
      const ui_items = formatOrderText(orderItem)
      if(ui_items){
        transOrders.push(ui_items)
      }
    }
    setOrders(transOrders)
    // console.log(transOrders)
  }, [])

  return(
    <Container className={`${title ? 'withTitle' : ''}`}>
      {title&&<Title className="fuente">{title}</Title>}
      {
        (Orders && Orders.length) &&
        Orders.map((item, indx) => {
          return <ItemContainer key={indx}>
                    <LeftText className="fuente">{item[0]}</LeftText>
                    <MiddleSection/>
                    <RightText className="fuente2">{item[1]}</RightText>
                 </ItemContainer>
        })

      }
    </Container>
  )

}

export default DetailGenerator

const Text = styled.p`
  width: auto;
  margin:0;
  font-size: 14px;
`
const Title = styled(Text)`
  font-size: 17px;
  font-weight: bold;
`
const RightText = styled(Text)`
  text-align: right;
  padding-left: 15px;
  text-transform: capitalize;
`
const LeftText = styled(Text)`
  text-align: left;
  padding-right: 15px;
  font-weight: bold;
`
const MiddleSection = styled.span`
  border-bottom: 1px dotted;
  opacity: .15;
`
const Container = styled.section`
  width: calc(100% - 70px);
  height: calc(100% - 50px);
  display: grid;
  grid-template-rows: repeat(auto-fill, 20px);
  row-gap:7px;
  padding: 25px 35px;

  &.withTitle{
    height: calc(100% - 70px);
    padding-top: 45px !important;
    grid-template-rows: 60px repeat(auto-fill, 20px);
  }


  ${Text}, ${MiddleSection}{
    color: gray;
  }

`












const ItemContainer = styled.div`
  width: 100%;
  height: 16px;
  display: grid;
  grid-template-columns: auto 1fr auto;
`
