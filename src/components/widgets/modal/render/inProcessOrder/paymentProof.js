import React, { useState } from 'react'
import styled from 'styled-components'
import CropImg from '../../../cropimg'
import UseTxState from '../../../../hooks/useTxState'



const PaymentProofComponent = ({ imgSrc, setImgSrc, order_id }) => {

  const [ activeSection, setActiveSection ] = useState(true)
  const { coinsendaServices, actions } = UseTxState()

  const subirImg = async({base64}) => {
    setImgSrc(base64)
    setActiveSection(null)
    actions.isAppLoading(true)
    let confirmation = await coinsendaServices.confirmDepositOrder(order_id, base64)
    if(!confirmation){
      actions.isAppLoading(false)
      actions.mensaje('El deposito No se ha confirmado', 'error')
      setImgSrc(null)
    }
  }

  const cancelarSubidaImg = () => {
    setActiveSection(null)
    setImgSrc(null)
  }

  return(
    <OverflowContainer>
      <Container className={`${activeSection ? 'activated' : ''}`}>
          <CropImg
            imageSrc={imgSrc}
            subirImg={subirImg}
            cancelarSubidaImg={cancelarSubidaImg}
          />
      </Container>
    </OverflowContainer>
  )

}

const CropEdit = styled.div`
  width: 100%;
  height: 50px;
  background: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.1);
`

const ImgContainer = styled.div`
  width: 100%;
  max-width: 550px;
  background: rgba(255, 255, 255, .4);
  border-radius: 6px;
`

const OverflowContainer = styled.section`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3;
  display: grid;
  overflow: hidden;
`

const Container = styled.div`

  padding: 50px;
  background: #232c35;
  transition: .3s;
  transform: translateX(100%);
  display: grid;
  grid-template-rows: 1fr;
  row-gap:20px;
  justify-items:center;

  .App{
    height: 100% !important;
    width: 100%;
  }

  .ImgCropcontrols{
    background: transparent !important;
  }

  &.activated{
    animation-name: activated;
    animation-duration: .8s;
    animation-fill-mode: forwards;
  }

  @keyframes activated{
    0%{
      transform: translateX(100%);
    }
    50%{
      transform: translateX(100%);
    }
    100%{
      transform: translateX(0%);
    }
  }
`

export default PaymentProofComponent
