import { useState } from 'react'
import ConfettiComponent from '../success/confetti'
import styled from 'styled-components'
import { Medal } from '../success/icons'
import { LayoutContainer, ControlContainer } from '../success/styles'
// import { initStages } from '../../utils'
import Layout from '../layout'
import loadable from '@loadable/component'

const Kyc = loadable(() => import('../../../kyc/kyc_container'))

const SuccessComponent = ({ closeModal, state, ...props }) => {

    const [ showKycComponent, setShowKycComponent ] = useState()

    if(showKycComponent){
        return (
            <Layout background="white">
                <Kyc/>
            </Layout>
        )
    }

    return(
        <Layout background="white">
            <LayoutContainer className="show fuente">
                <ConfettiComponent/>
                <h1>Genial {state?.name?.toLowerCase()}</h1>
                <Medal size={145} />
                <p className="personalSuccess">Has completado tu verificación básica</p>
                <ControlContainer>
                    <p>¿Deseas continuar con el proceso de verificación avanzada?</p>
                    <Buttons>
                        <SecondaryButton onClick={closeModal}>Lo haré despues</SecondaryButton>
                        <PrimaryButton onClick={() => setShowKycComponent(true)}>Continuar</PrimaryButton>
                    </Buttons>
                </ControlContainer>
            </LayoutContainer>
        </Layout>
    )
}

export default SuccessComponent

const Buttons = styled.div`
  display: grid;
  grid-template-columns:auto auto;
  column-gap: 25px;
`

const Button = styled.div`
  min-width:100px;
  height: 50px;
  border-radius:3px;
  align-items: center;
  justify-items: center;
  width: 100%;
  display: grid;
  cursor: pointer;
`

const SecondaryButton = styled(Button)`
  color:rgba(15,134,215,1);
  font-weight:bold; 
`

const PrimaryButton = styled(Button)`
    background: rgb(53,171,252);
    background: linear-gradient(132deg, rgba(53,171,252,1) 0%, rgba(15,134,215,1) 100%);
    color:white;
`
