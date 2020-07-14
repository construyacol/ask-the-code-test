import React, { useEffect, useState, Fragment } from 'react'
import styled from 'styled-components'
import { AiOutlineUpload } from 'react-icons/ai';
import PaymentProofComponent, { PaymentProof } from './paymentProof'
import UseTxState from '../../../../hooks/useTxState'
import SimpleLoader from '../../../loaders'
import QRCode from 'qrcode'
import { readFile, img_compressor } from '../../../../../utils'
import OrderStatus from './orderStatus'
import DetailGenerator from './detailGenerator'
import { OnlySkeletonAnimation } from '../../../loaders/skeleton'
import IconSwitch from '../../../icons/iconSwitch'
import { AiOutlineClockCircle } from 'react-icons/ai';
import ConfirmationCounter from './confirmationCounter'
import useViewport from '../../../../../hooks/useWindowSize'
import { device } from '../../../../../const/const'


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

  const { currentOrder } = UseTxState()

  return(
    <>
      {
        currentOrder.currency_type === 'fiat' ?
        <FiatDespoitOrder order={currentOrder}/>
        :
        <CryptoDespoitOrder order={currentOrder} />
      }
    </>
  )
}

export default InProcessOrder


const CryptoDespoitOrder = ({ order }) => {

  const { actions, tx_path, currencies } = UseTxState()
  const { isTabletOrMovilViewport } = useViewport()


  return(
      <InProcessOrderContainer>

        <OrderContainer>

          <TopSection>
            <IconSwitch className="TitleIconOrder" size={35} icon={order.currency.currency || 'cop'} />
            <TitleContainer>
              <Text className="fuente">{getTitle(tx_path)}</Text>
              <Currency className="fuente">
                {order.currency.currency }
              </Currency>
            </TitleContainer>
            <DateIdContainter>
                <Text className="fuente2">#{order.id}</Text>
                <DateText className="fuente2">{moment(order.updated_at).format("LL")}</DateText>
            </DateIdContainter>
          </TopSection>

          {
            isTabletOrMovilViewport &&
            <OrderStatus order={order} movil/>
          }

          <MiddleSection state={order.state}>
            <DetailGenerator
              order={order}
              title={`${getState(order)}`}
              TitleSuffix={()=><GetIcon order={order}/>}
            />
          </MiddleSection>

          <BottomSection className={`crypto`}>
              <UploadComponent/>
              {
                tx_path === 'deposits' &&
                <ConfirmationCounter
                  confirmations={order.confirmations}
                  total_confirmations={currencies[order.currency.currency].confirmations}
                />
              }
          </BottomSection>

        </OrderContainer>

        {
          !isTabletOrMovilViewport &&
          <OrderStatus order={order}/>
        }

      </InProcessOrderContainer>
  )

}






























const FiatDespoitOrder = ({ order }) => {

  const [ onDrag, setOnDrag ] = useState(false)
  const [ imgSrc, setImgSrc ] = useState(false)
  const { actions, tx_path } = UseTxState()
  const { isTabletOrMovilViewport } = useViewport()



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
      const file = await img_compressor(e.target.files[0], 0.25)
      // console.log('result compresor', file.size)
      const imageDataUrl = await readFile(file)
      setImgSrc(imageDataUrl)
      actions.isAppLoading(true)
    }
  }

  // console.log('|||||||||||||||| FiatOrderDespoit ::', currencies)


  return(
      <InProcessOrderContainer>


        <OrderContainer onDragOver={dragOver}>

          {((onDrag && !imgSrc) && order.state === 'pending') && <DropZoneComponent dragLeave={dragLeave} goFileLoader={goFileLoader}/>}
          {imgSrc && order.state === 'pending' && <PaymentProofComponent order_id={order.id} imgSrc={imgSrc} setImgSrc={setImgSrc} />}


          <TopSection>
            <IconSwitch className="TitleIconOrder" size={35} icon={order.currency.currency || 'cop'} />
            <TitleContainer>
              <Text className="fuente">{getTitle(tx_path)}</Text>
              <Currency className="fuente">
                {order.currency.currency }
              </Currency>
            </TitleContainer>
            <DateIdContainter>
                <Text className="fuente2">#{order.id}</Text>
                <DateText className="fuente2">{moment(order.updated_at).format("LL")}</DateText>
            </DateIdContainter>
          </TopSection>

          {
            isTabletOrMovilViewport &&
            <OrderStatus order={order} movil/>
          }

          <MiddleSection state={order.state}>
            <DetailGenerator
              order={order}
              title={`${getState(order)}`}
              TitleSuffix={()=><GetIcon order={order}/>}
            />
          </MiddleSection>

          <BottomSection>
              <UploadComponent
                imgSrc={imgSrc}
                goFileLoader={goFileLoader}
                setImgSrc={setImgSrc}
              />
          </BottomSection>

        </OrderContainer>


        {
          !isTabletOrMovilViewport &&
          <OrderStatus order={order}/>
        }


      </InProcessOrderContainer>
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





const UploadComponent = ({ unButtom, title, goFileLoader, imgSrc }) => {

  const { currentOrder } = UseTxState()

  return(
    <UploadContainer className={`${imgSrc || currentOrder.state === 'confirmed' ? 'loaded' : 'unload'}`}>
      {
        (!imgSrc && currentOrder.state !== 'confirmed') ?
        <Fragment>
            <AiOutlineUpload size={45} color="gray"/>
            <UploadText className="fuente">{title || 'Arrastra el archivo que quieres subir'}</UploadText>
            {
              !unButtom &&
              <Fragment>
                <UploadMiddle>
                  <UploadTextMiddle className="fuente">o selecciona un archivo</UploadTextMiddle>
                  <hr/>
                </UploadMiddle>

                <Buttom >
                  <input id="TFileUpload" type="file" accept="image/png,image/jpeg" onChange={goFileLoader} />
                  <Text style={{color:"white"}} className="fuente">Subir comprobante</Text>
                </Buttom>
              </Fragment>
            }

        </Fragment>
        :
        <Fragment>
          <UploadMiddle className="titleSection payment fuente">
            <UploadTextMiddle className="titleSection">Comprobante de pago</UploadTextMiddle>
            <hr/>
          </UploadMiddle>
          <PaymentProof payload={imgSrc}/>
        </Fragment>
      }

    </UploadContainer>
  )

}

















const getTitle = (tx_path) => {
  return tx_path === 'deposits' ? 'Deposito' : 'Retiro'
}

const GetIcon = ({ order }) => {

  const coloIcon = order.state === 'pending' ? '#ff8660' : '#1cb179'
  const RenderIcon = order.state === 'pending' ? AiOutlineClockCircle : order.state === 'confirmed' && (()=> <SimpleLoader loader={2} color={coloIcon} justify="center"/>)

  return(
    <IconContainer>
      <RenderIcon size={25} color={coloIcon}/>
    </IconContainer>
  )
}

const getState = ({state, currency_type}) => {
  switch (currency_type) {
    case 'fiat':
      return state === 'pending' ? 'Pendiente' : (state === 'confirmed' && currency_type === 'fiat') ? 'Procesando...' : 'En proceso de aceptación...'
    case 'crypto':
      return state === 'pending' ? 'Pendiente' : 'Confirmando en blockchain...'
    default:

  }
}




















const IconContainer = styled.div`
  position: relative;
  width: 25px;
  height: 25px;
  display: grid;
`


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

export const Text = styled.p`
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
  &.payment{
    p{
      padding-left: 0 !important;
    }
    position: relative !important;
  }
}
`

const UploadText = styled(Text)`
  font-size: 16px;
  color: gray;
`

const UploadContainer = styled.section`
  display: grid;
  justify-items:center;
  row-gap:12px;
  width: 100%;
  min-height: 170px;
  height: auto;
  &.loaded{
    grid-template-rows: auto 1fr;
  }
  &.unload{
    grid-template-columns:1fr;
    max-width: 400px;
    grid-template-rows: repeat(4, auto);
  }

`



export const Section = styled.div``


const BottomSection = styled(Section)`
  height: auto;
  display: grid;
  justify-items:center;
  align-items: center;

  &.crypto{
    position: relative;
  }
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
  text-transform: uppercase;
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
    background: ${props => props.state === 'pending' ? '#ff8660' : '#1cb179' };
    top: 0;
    width: 100%;
    ${props => props.state === 'confirmed' && OnlySkeletonAnimation}
  }
  .withTitle{
    padding-top: 55px !important;
  }
`

const TopSection = styled(Section)`
  display: grid;
  align-items: center;
  grid-template-rows: auto auto;
  column-gap: 12px;
  row-gap:5px;
  grid-template-columns: auto 1fr;
  grid-template-areas: "icon titleContainer"
                       "icon dateIdContainter";
  span{
    margin-right: 15px;
  }

  .TitleIconOrder{
    grid-area: icon;
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
  @media ${device.tablet} {
    grid-template-rows: auto auto 1fr auto;
  }
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
    margin: 0;
  }

  ${OrderContainer}{
    padding: 30px 40px;
  }

  width: 1000px;
  height: auto;
  min-height: 750px;
  background: white;
  display: grid;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.1);
  grid-template-columns: 1fr 400px;

  @media ${device.laptop} {
    width: 100%;
  }

  @media ${device.tabletL} {
    grid-template-columns: 1fr;
    position: absolute;
    top: 10px;
  }

  @media ${device.tablet} {
    ${OrderContainer}{
      padding: 30px 15px;
    }
  }


`