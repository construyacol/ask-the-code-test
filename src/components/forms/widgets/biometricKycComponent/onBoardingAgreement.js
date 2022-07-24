import { useState } from "react"
import styled from "styled-components"
import { getCdnPath } from '../../../../environment'
import UseWindowDimensions from '../../hooks/useWindowDimensions'
import ContinueFromMobile from './continueFromMobile'
import { Button } from './styles'
import { device } from '../../../../const/const'


const OnBoardingAgreement = ({ handleAction, cameraAvailable }) => {

    const [ continueFromMobile, setContinueFromMobile ] = useState(false)
    const [ isDesktopDevice ] = UseWindowDimensions()
    
    
    return(
        <Layout className="boarding_layout__">
        {
            continueFromMobile || cameraAvailable === false ?
            <ContinueFromMobile
                cameraAvailable={cameraAvailable}
                setContinueFromMobile={setContinueFromMobile}
            />
            :
            <OnBoardingContainer className="boarding_init__">
                <h1 className="fuente">Reconocimiento Facial</h1>
                <img src={`${getCdnPath('assets')}recognition.gif`}  alt="" width={250} height={200} />
                <Content>
                    <h3 className="fuente">Ahora confirmaremos tu identidad, sigue las instrucciones que aparecen en pantalla</h3>
                    <h4 className="fuente">Recomendaciones importantes:</h4>
                    <ul className="fuente">
                        <li>
                            <p>Evita usar articulos en tu rostro(sombreros, gafas, gorras etc...).</p>
                        </li>
                        <li>
                            <p>Haz el proceso en un espacio con suficiente iluminación.</p>
                        </li>
                        <li>
                            <p>Completa este proceso desde tu celular.</p>
                        </li>
                    </ul>
                </Content>
                {
                    isDesktopDevice ?
                        <ButtonContainer>
                            <Button onClick={() => setContinueFromMobile(true)} className={`center-end ${!cameraAvailable ? 'disabled' : ''}`} disabled={!cameraAvailable} type="button">Continuar desde el celular</Button>
                            <Button className={`center-end secondary ${!cameraAvailable ? 'disabled' : ''}`}  disabled={!cameraAvailable} onClick={handleAction} type="button">Continuar desde este dispositivo</Button>
                        </ButtonContainer>
                        :
                        <Button className="center-end" onClick={handleAction} type="button">Continuar</Button>
                }
            </OnBoardingContainer>
        }
        </Layout>
    )
}




export default OnBoardingAgreement



const ButtonContainer = styled.div`
    column-gap: 20px;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: auto auto;
    max-width: 650px;
    justify-self: center;
   
`

const Content = styled.div`
    display: grid;
    grid-template-rows: auto auto 1fr;
    row-gap: 20px;
    h4{
        margin-bottom:0;
    }

    li {
        margin: 0;
        padding: 0px 35px;
        list-style: none;
        background-image: url(./check-mark.png);
        background-repeat: no-repeat;
        background-position: left center;
        background-size: 20px;
        height: 20px;
    }

    @media ${device.tablet} {
         width: calc(100vw - 30px);
         padding: 0 15px;
         ul{
             width:calc(100vw - 30px);
             padding: 0 15px;
             li{
                 padding:0
             }
         }
    }

`



const OnBoardingContainer = styled.div`
    max-width: 780px;
    padding: 70px 0;
    min-height: calc(100vh - 140px);
    display: grid;
    grid-template-rows: 80px 200px;
    row-gap:center;

  img{
      justify-self:center;
  }
  
  h1{
      text-align: center;
      width:100%;
  }

  ul{
        padding-left:0px;
    }

  @media (max-width: 768px) {
   max-width: 780px;
    padding: 30px 20px;
    min-height: calc(100vh - 60px);
    display: grid;
    grid-template-rows: auto 200px 1fr auto;
    h1{
      font-size:1.5rem;
    }
    h3{
      font-size:1rem;
    }
    ul{
        padding-left:10px;
    }
    li{
        padding: 0px 0 0 35px;
        height:auto;
    }
  }

    @media ${device.laptopM} {
        padding: 30px 0;
        height: calc(100vh - 60px);
        > img{
            display:none;
        }
    }

    @media ${device.tablet} {
        > img{
            display:initial;
        }
    }
`


const Layout = styled.div`
  position:absolute;
  top:0;
  left:0;
  z-index:2;
  width:100vw;
  height:100vh;
  background: white;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`




