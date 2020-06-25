import React, { useEffect, useState, Fragment } from 'react'
import styled from 'styled-components'
import { deposits } from './rest.json'
import { AiOutlineUpload } from 'react-icons/ai';
import PaymentProofComponent from './paymentProof'
import OtherModalLayout from '../../otherModalLayout'
import UseTxState from '../../../../hooks/useTxState'
import SimpleLoader from '../../../loaders'
import QRCode from 'qrcode'

// import { Layout } from '../orderDetail'


import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')

const orderModel = {
  "created_at":new Date(),
  "updated_at":new Date(),
  "state":"pending",
  "currency_type":"fiat"
}




const InProcessOrder = () => {

  const { actions, history, currentOrder } = UseTxState()

  const cerrar = (e) => {
    if(e.target.dataset.close_modal){
      actions.renderModal(null)
      history.goBack()
    }
  }


  return(
    <OtherModalLayout on_click={cerrar}>
      {
        currentOrder.currency_type === 'fiat' &&
        <FiatOrderDespoit order={currentOrder}/>
      }
    </OtherModalLayout>
  )
}

export default InProcessOrder



const readFile = (file) => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load',
      () => resolve(reader.result),
      false
    )
    reader.readAsDataURL(file)
  })
}


const FiatOrderDespoit = ({ order }) => {

  const [ onDrag, setOnDrag ] = useState(false)
  const [ imgSrc, setImgSrc ] = useState(false)
  const [ loader, setLoader ] = useState(false)
  const { actions  } = UseTxState()


  const dragOver = event => {
     event.preventDefault();
     if(!onDrag){
       setOnDrag(!onDrag)
     }
  }

  const dragLeave = event =>{
    event.preventDefault();
    if(onDrag){
      setOnDrag(!onDrag)
    }
  }

  const goFileLoader = async e =>{
    if (e.target.files && e.target.files.length > 0) {
      setOnDrag(false)
      if(e.target.files[0].type !== 'image/png' && e.target.files[0].type !== 'image/jpeg'){return alert('formato no permitido')}
      const data = e.target.files[0]
      // const file = await img_compressor(e.target.files[0], 0.5)
      const imageDataUrl = await readFile(data)
      setImgSrc({
        name:data.name,
        src:imageDataUrl,
        completed:null
      })
      actions.isAppLoading(true)
    }
  }
  // console.log(imgSrc)


  return(
      <InProcessOrderContainer>


        <OrderContainer onDragOver={dragOver}>

          {(onDrag && !imgSrc) && <DropZoneComponent dragLeave={dragLeave} goFileLoader={goFileLoader}/>}
          {imgSrc && order.state === 'pending' && <PaymentProofComponent order_id={order.id} imgSrc={imgSrc} setImgSrc={setImgSrc} />}


          <TopSection>
            <Icon/>
            <TitleContainer>
              <Text>Deposito</Text>
              <Currency>
                COP
              </Currency>
            </TitleContainer>
            <DateIdContainter>
                <Text>#21312321321321231232</Text>
                <DateText>{moment(order.updated_at).format("LL")}</DateText>
            </DateIdContainter>
          </TopSection>

          <MiddleSection>
          </MiddleSection>

          <BottomSection>
              <UploadComponent
                imgSrc={imgSrc}
                goFileLoader={goFileLoader}
                loader={loader}
                setImgSrc={setImgSrc}
              />
          </BottomSection>

        </OrderContainer>



        <OrderStatus order={order}/>


      </InProcessOrderContainer>
  )

}


const OrderStatus = ({ order }) => {

  const [ orderState, setOrderState ] = useState()

   useEffect(()=>{

     let orders = {}
     for (let prop in deposits) {
       orders = {
         ...orders,
         [prop]:{
           ...deposits[prop],
           completed:order.state === prop
         }
       }
     }
     // console.log(orders, deposits)
     setOrderState(Object.entries(orders))
   }, [order.state])


  return(
    <OrderStatusContainer>
      <TopSectionStatus>
        <Text>Orden pendiente de confirmación</Text>
        <SubTitle>Sube una fotografía o captura del compbrante de pago para continuar...</SubTitle>
      </TopSectionStatus>
      <StatusContainer>
        {
          orderState && orderState.map((state, index) => {
            return <StatusItem
              state={state}
              order={order}
              key={index}
              active={state[1].completed}
              className={`
                ${orderState.length === (index + 1) ? 'statusStep finalStep' : 'statusStep'}
                ${state[1].completed ? 'activeStep' : ''}
                `} />
          })
        }
      </StatusContainer>
    </OrderStatusContainer>
  )
}

const StatusItem = ({ className, state, order, active }) => {

  const activated = active && active.toString()
  // console.log((state[0] === "confirmed" && (order.state === 'pending' || order.state === 'confirmed')), state )

  return(
    <Status className={`status ${className}`}>
      <Indicator className={className}/>
      <Description>
        <StatusTitle active={activated}>{state[1].ui_text[order.currency_type] || state[1].ui_text}</StatusTitle>
        <DateStatusText active={activated}>
          {
            active && order.state === 'pending' ? 'Pendiente' :
            active ? 'En proceso...' :
            state[0] === "created" ? moment(order.created_at).format("LL") :
            state[0] === "pending" ? moment(order.updated_at).format("LL") :
            (state[0] === "confirmed" && order.state === 'confirmed') ? moment(order.updated_at).format("LL") : ''
          }
          </DateStatusText>
      </Description>
    </Status>
  )

}







const DropZoneComponent = ({ dragLeave, goFileLoader }) => {

  return(
    <DropZoneContainer >
      <input id="TFileUpload" type="file" accept="image/png,image/jpeg" onChange={goFileLoader} onDragLeave={dragLeave}/>
      <UploadComponent unButtom title="Suelta aquí el archivo que quieres subir..."/>
    </DropZoneContainer>
  )

}





const UploadComponent = ({ unButtom, title, goFileLoader, imgSrc, setImgSrc }) => {

  const { loader, currentOrder, actions, coinsendaServices, currencies } = UseTxState()

  const getPaymentProof = async(currentOrder) =>{
    if(currentOrder.paymentProof){
      const { proof_of_payment } = currentOrder.paymentProof
      // console.log(`${currencies[currentOrder.currency.currency].node_url}tx/${proof_of_payment.proof}`)
      setImgSrc({
        name:'Comprobante de pago',
        src:currentOrder.currency_type === 'fiat' ? `data:image/png;base64, ${proof_of_payment.raw}` : await QRCode.toDataURL(`${currencies[currentOrder.currency.currency].node_url}tx/${proof_of_payment.proof}`)
      })
      // if(currentOrder.currency_type === 'crypto'){
      //   setTxId(proof_of_payment.proof)
      //   setUrlExplorer(`${currencies[currentOrder.currency.currency].node_url}tx/${proof_of_payment.proof}`)
      // }
    }
    // else if(currentOrder.proof){
    //   setImgProof(await QRCode.toDataURL(`${currencies[currentOrder.currency.currency].node_url}tx/${currentOrder.proof}`))
    //   setTxId(currentOrder.proof)
    //   setUrlExplorer(`${currencies[currentOrder.currency.currency].node_url}tx/${currentOrder.proof}`)
    // }
  }

  useEffect(()=>{
    if(!currentOrder.paymentProof){
      const getData = async() => {
        const PP = await coinsendaServices.getDepositById(currentOrder.id)
        if(!PP){return}
        let updateOrder = {
          [PP.id]:{...PP}
        }
        actions.update_item_state(updateOrder, 'deposits')
        getPaymentProof(PP)
      }
      getData()
    }else{
      getPaymentProof(currentOrder)
    }
  }, [])


  console.log(currentOrder)


  return(
    <UploadContainer className={`${imgSrc || currentOrder.state === 'confirmed' ? 'loaded' : 'unload'}`}>
      {
        (!imgSrc && currentOrder.state !== 'confirmed') ?
        <Fragment>
            <AiOutlineUpload size={45} color="gray"/>
            <UploadText>{title || 'Arrastra el archivo que quieres subir'}</UploadText>
            {
              !unButtom &&
              <Fragment>
                <UploadMiddle>
                  <UploadTextMiddle>o selecciona un archivo</UploadTextMiddle>
                  <hr/>
                </UploadMiddle>

                <Buttom>
                  <input id="TFileUpload" type="file" accept="image/png,image/jpeg" onChange={goFileLoader} />
                  <Text style={{color:"white"}}>Subir comprobante</Text>
                </Buttom>
              </Fragment>
            }

        </Fragment>
        :
        <Fragment>
          <UploadMiddle className="titleSection">
            <UploadTextMiddle className="titleSection">Comprobante de pago</UploadTextMiddle>
            <hr/>
          </UploadMiddle>
          <PaymentProofDetail>
            <ImgContainer className={`${loader && 'loader' || ''}`}>
              {(loader || !imgSrc) && <SimpleLoader loader={2} justify="center" color="#206f65"/>}
                <Img src={imgSrc && imgSrc.src || null}/>
            </ImgContainer>

            {
              currentOrder.state !== 'confirmed' &&
              <>
              <PaymentTitle>
                {imgSrc.name}
              </PaymentTitle>
              <ProgressBar progresed={imgSrc.completed || '0%'}/>
              </>
            }
          </PaymentProofDetail>
        </Fragment>
      }

    </UploadContainer>
  )

}






































const DropZoneContainer = styled.section`
  position: absolute;
  width: 100%;
  height: 100%;
  background:rgba(255, 255, 255, .85);;
  z-index: 3;
  display: grid;
  align-items: center;
  justify-items:center;
  ${'' /* border: 5px solid #0198FF; */}

  svg{
    fill: #0198FF;
  }
  p{
    color: #0198FF;
  }
`

const ImgContainer = styled.div`
    width: 80px;
    height: 55px;
    position: relative;
    border: 3px solid #0198FF;
    border-radius: 4px;
    background: white;
    display: grid;
    align-items: center;
    &.loader::after{
      content: '';
      width: 100%;
      position: absolute;
      height: 100%;
      background: rgba(255, 255, 255, .8);;


    }
    .lds-roller{
      z-index: 2;
    }
`

const Img = styled.img`
  width: 80px;
  height: 55px;
  border-radius: 3px;
`

const ProgressBar = styled.span`
  height: 4px;
  width: 100%;
  background: #c5c5c5;
  transition: .3s;
  position: relative;
  ::after{
    content: '';
    width: ${props => props.progresed};
    background: #0198FF;
    height: 100%;
    position: absolute;
    transition: 3s;
    left: 0;
    top: 0;
  }
`

const Text = styled.p`
  margin: 0;
`

const PaymentTitle = styled(Text)`
  text-align: center;
  font-size: 14px;
  color: gray;
`





const PaymentProofDetail = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: auto auto auto;
  row-gap: 10px;
  justify-items: center;
  align-items: center;
  padding-top: 40px;
`


const Buttom = styled.div`
  width: 320px;
  height: 45px;
  border-radius: 6px;
  border: 2px solid #0198FF;
  background: #0198FF;
  display: grid;
  align-items: center;
  justify-items:center;
  cursor: pointer;
  position: relative;
`



const UploadTextMiddle = styled(Text)`
  z-index: 2;
  font-size: 12px;
  width: 150px;
  background: #eeeeee;
  text-align: center;
  color: gray;

  &.titleSection{
    font-size: 15px;
    width: auto;
    padding: 0 20px;
    align-self: center;
    justify-self: baseline;
  }
`

const UploadMiddle = styled.div`
  font-size: 14px;
  position: relative;
  display: grid;
  width: 100%;
  justify-items: center;
  max-width: 320px;
  hr{
    position: absolute;
    width: 100%;
    align-self: center;
  }

  &.titleSection{
    max-width: inherit;
    position: absolute;
    align-self: start;
    hr{
      border-top: 1px solid;
      color: #c5c5c5;
    }
  }
}
`

const UploadText = styled(Text)`
  font-size: 16px;
  color: gray;
`

const UploadContainer = styled.section`
  display: grid;
  grid-template-columns:1fr;
  justify-items:center;
  row-gap:12px;
  width: 100%;
  min-height: 170px;
  height: auto;
  &.loaded{

  }
  &.unload{
    max-width: 400px;
    grid-template-rows: repeat(4, auto);
  }

`



const Section = styled.div``


const BottomSection = styled(Section)`
  height: auto;
  display: grid;
  justify-items:center;
  align-items: center;
  position: relative;
`


const Description = styled.div`
  padding-left: 20px;
  display: grid;
  row-gap:5px;
  p{
    margin: 0;
  }
`

const StatusTitle = styled(Text)`
  font-size: 14px;
  color: ${props => props.active === 'true' ? '#0198FF' : 'gray'};
`

const DateStatusText = styled(Text)`
  font-size: 12px;
  color: ${props => props.active === 'true' ? '#0198FF' : '#adadad'};
`

const Indicator = styled.div`
  justify-self:center;
  width: 12px;
  height: 12px;
  background: #0198FF;
  border-radius: 50%;
  position: relative;
  z-index:2;
  display: grid;
  align-items: center;
  justify-items:center;

  &.activeStep{
    width: 14px;
    height: 14px;
    border: 2px solid #0198FF;
    background: transparent !important;
    position: relative;
    ::after{
      top: 18px !important;
      height: 60px !important;
    }
    ::before{
      content:'';
      width: 6px;
      height: 6px;
      background: #0198FF;
      border-radius: 50%;
    }
  }

  &.statusStep::after{
    content: '';
    width: 2px;
    height: 60px;
    background: #0198FF;
    position: absolute;
    -webkit-align-self: center;
    align-self: start;
    top: 14px;
    z-index: 1;
  }

  &.statusStep.finalStep::after{
    display: none;
  }
`


const Status = styled.div`
  height: 70px;
  padding: 0 20px;
  display: grid;
  align-items: center;
  grid-template-columns: 20px 1fr;


  &.activeStep ~ .status .statusStep{
    background: #dadada;
    ::after{
      background: #dadada;
    }
  }

  &.activeStep .statusStep{
    ::after{
      background: #dadada;
    }
  }
`





const StatusContainer = styled(Section)`
  padding: 45px 0;
  display: grid;
  grid-template-rows: repeat(auto-fill, 70px);
  row-gap:10px;
`

const OrderStatusContainer = styled.div`
  background: #f5f5f5;
  box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.05);
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap:25px;
`

const TopSectionStatus = styled(Section)`
  display: grid;
  row-gap:10px;
  height: auto;
`


const SubTitle = styled(Text)`
  font-size: 12px;
  color: gray;
`

const DateIdContainter = styled.div`
  display: flex;
  grid-area: dateIdContainter;
  ${Text}{
    font-size: 12px;
    color: gray
  }
`

const DateText = styled(Text)`
  margin-left: 9px !important;
  padding-left: 7px;
  border-left: 1px solid gray;
`

const TitleContainer = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
  grid-area: titleContainer;
  ${Text}{
    font-size: 20px;
  }
`

const Currency = styled(Text)`
  margin-left: 7px !important;
`

const Icon = styled.span`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #c3c3c3;
  grid-area: icon;
  ${'' /* box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.1); */}
`


const MiddleSection = styled(Section)`
  background: white;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  ::after{
    content:'';
    position: absolute;
    height: 7px;
    background: orange;
    top: 0;
    width: 100%;
  }
`

const TopSection = styled(Section)`
  display: grid;
  align-items: center;
  grid-template-rows: auto auto;
  row-gap:7px;
  grid-template-columns: auto 1fr;
  grid-template-areas: "icon titleContainer"
                       "icon dateIdContainter";
  span{
    margin-right: 15px;
  }
`

const Container = styled.section`
  width: 100vw;
  height: 100vh;
  background: #000000ba;
  display: grid;
  align-items: center;
  justify-items:center;


`



const OrderContainer = styled.div`
  background: #eeeeee;
  display: grid;
  grid-template-rows: auto 1fr auto;
  row-gap:30px;
  position: relative;
`

const InProcessOrderContainer = styled.section`

  #TFileUpload{
    position: absolute;
    z-index: 4;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  p{
    font-family: 'Raleway', sans-serif !important;
    margin: 0;
  }

  ${OrderContainer}, ${OrderStatusContainer}{
    padding: 30px 40px;
  }

  width: 1000px;
  height: auto;
  min-height: 750px;
  background: white;
  box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: 1fr 400px;
  border-radius: 6px;
  overflow: hidden;
`
