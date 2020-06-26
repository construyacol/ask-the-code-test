import React, { useEffect, useState, Fragment } from 'react'
import styled from 'styled-components'
import { AiOutlineUpload } from 'react-icons/ai';
import PaymentProofComponent, { PaymentProof } from './paymentProof'
import UseTxState from '../../../../hooks/useTxState'
import SimpleLoader from '../../../loaders'
import QRCode from 'qrcode'
// import { PaymentProof } from '../orderDetail'
import { readFile, img_compressor } from '../../../../../utils'
import OrderStatus from './orderStatus'
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

  const { currentOrder } = UseTxState()

  return(
    <>
      {
        currentOrder.currency_type === 'fiat' &&
        <FiatOrderDespoit order={currentOrder}/>
      }
    </>
  )
}

export default InProcessOrder



const FiatOrderDespoit = ({ order }) => {

  const [ onDrag, setOnDrag ] = useState(false)
  const [ imgSrc, setImgSrc ] = useState(false)
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
      const file = await img_compressor(e.target.files[0], 0.25)
      // console.log('result compresor', file.size)
      const imageDataUrl = await readFile(file)
      setImgSrc(imageDataUrl)
      actions.isAppLoading(true)
    }
  }
  // console.log(imgSrc)


  return(
      <InProcessOrderContainer>


        <OrderContainer onDragOver={dragOver}>

          {((onDrag && !imgSrc) && order.state === 'pending') && <DropZoneComponent dragLeave={dragLeave} goFileLoader={goFileLoader}/>}
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
                <Text className="fuente2">#21312321321321231232</Text>
                <DateText className="fuente2">{moment(order.updated_at).format("LL")}</DateText>
            </DateIdContainter>
          </TopSection>

          <MiddleSection>
          </MiddleSection>

          <BottomSection>
              <UploadComponent
                imgSrc={imgSrc}
                goFileLoader={goFileLoader}
                setImgSrc={setImgSrc}
              />
          </BottomSection>

        </OrderContainer>



        <OrderStatus order={order}/>


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
          <UploadMiddle className="titleSection payment">
            <UploadTextMiddle className="titleSection">Comprobante de pago</UploadTextMiddle>
            <hr/>
          </UploadMiddle>
          <PaymentProof payload={imgSrc}/>
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
    font-family: 'Raleway', sans-serif;
    margin: 0;
  }

  ${OrderContainer}{
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
