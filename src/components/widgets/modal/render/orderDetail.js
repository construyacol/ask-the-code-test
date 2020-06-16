import React from 'react'
import OtherModalLayout from '../otherModalLayout'
import styled from 'styled-components'
import { swing_in_bottom_bck, socketIconContainerIntro, backTopSection } from '../../animations'
import IconSwitch from '../../icons/iconSwitch'
import {useActions} from '../../../../hooks/useActions'

const OrderDetail = ({callback}) => {

  const actions = useActions()

  const cerrar = () => {
    actions.renderModal(null)
  }

    return(
      <OtherModalLayout>
        <Layout>
          <CloseButton onClick={cerrar}>
            <i className="fas fa-times"></i>
          </CloseButton>
          <TopSection>
            <Title className="fuente">Autenticación de retiro</Title>
            <CircleIconContainer>
              <IconSwitch size={60} icon="accepted" />
            </CircleIconContainer>
            <ContBackTopSection>
              <BackTopSection />
            </ContBackTopSection>
          </TopSection>


        </Layout>
      </OtherModalLayout>
    )
  }

  export default OrderDetail

  const BackTopSection = styled.div`
    width: 120%;
    height: 120%;
    position: absolute;
    background-image: url(/static/media/back.fe9a1b62.png);
    background-size: contain;
    background-repeat: repeat;
    background-position: right;
    opacity: 0.05 !important;
    animation: ${backTopSection};
    animation-duration: 80s;
    animation-iteration-count: infinite;
  `

  const ContBackTopSection = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
  `

  const CloseButton = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 35px;
    height: 35px;
    background: white;
    border-radius: 50%;
    z-index: 2;
    display: grid;
    align-items: center;
    justify-items: center;
    cursor: pointer;
    -webkit-transition: .15s;
    transition: .15s;

    i{
      color: gray;
    }
  `



  const CircleIconContainer = styled.div`
    display: grid;
    align-items: center;
    justify-content: center;
    justify-self: end;
    width: 90px;
    height: 90px;
    background: white;
    border-radius: 50%;
    align-self: flex-end;
    position: relative;
    transform: translate(-30px, 10px) !important;
  `

  const Title = styled.h3`
    text-align: center;
    color: white;
    margin: 30px 0 10px 0;
  `

  const TopSection = styled.section`
    background: linear-gradient(to bottom right, #0175c3, #039aff);
    width: 100%;
    height: 100%;
    display: grid;
    position: relative;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  `

  const Layout = styled.div`
    width: 100%;
    max-width: 550px;
    height: 650px;
    background: white;
    display: grid;
    align-items: center;
    justify-items: center;
    -webkit-transition: .3s;
    transition: .3s;
    border-radius: 11px;
    position: relative;
    grid-template-rows: 115px 70%;

    -webkit-animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
    animation: ${swing_in_bottom_bck} 1s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
  `
