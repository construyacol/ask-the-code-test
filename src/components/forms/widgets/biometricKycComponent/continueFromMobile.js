
import { useEffect, useState } from "react"
import styled from "styled-components"
import QRCode from 'qrcode'
import { Button } from './styles'
import { getHostName } from '../../../../environment'
import { getUserToken } from '../../../utils'
import { useCoinsendaServices } from "../../../../services/useCoinsendaServices";


const ContinueFromMobile = ({ cameraAvailable, setContinueFromMobile }) => {

    const [ qrCode, setQrCode ] = useState()
    const [ coinsendaServices ] = useCoinsendaServices();

    const generateQR = async text => {
        try {
          const code = await QRCode.toDataURL(text)
          setQrCode(code)
        } catch (err) {
          console.error(err)
        }
      }

    const createUri = async() => {
        const { refreshToken } = await getUserToken()
        const { userToken } = await coinsendaServices.getJWToken(refreshToken)
        const uri = `https://app.${getHostName()}.com?token=${userToken}&refresh_token=${refreshToken}&face_recognition`
        generateQR(uri)
    }

        
      useEffect(()=>{
        createUri()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return(
        <CameraNotAvailableContainer className="cameraNotAvailable">
        {
            cameraAvailable === false &&
            <CameraStatus>
                El dispositivo no tiene permisos para acceder o no tiene la cámara conectada &nbsp;
                <a href="https://support.google.com/chrome/answer/2693767?hl=es-419&co=GENIE.Platform%3DDesktop" target="_blank"  rel="noreferrer" alt="">¿Necesitas ayuda?</a>
            </CameraStatus>
        }
            <h1 >Reconocimiento Facial</h1>
            <h3>Ahora confirmaremos tu identidad, sigue las instrucciones que aparecen en pantalla</h3>
            <ImagesContainer>
                {/* <img className="FRscanner" src={`${getCdnPath('assets')}scanner.png`} alt="" width={200} /> */}
                <img className="FRQR" src={qrCode} alt="" width={280} />
            </ImagesContainer>
            <p>Escanea el código QR desde tu celular y continúa el proceso de verificación.</p>
            <Button className={`center-end ${!cameraAvailable ? 'disabled' : ''}`} disabled={!cameraAvailable} onClick={() => setContinueFromMobile(false)} >Regresar</Button>
        </CameraNotAvailableContainer>
    )
}

export default ContinueFromMobile

const ImagesContainer = styled.div`
    max-height: 300px;
    display: flex;
    align-items: center; 
    justify-content: center;
`




const CameraNotAvailableContainer = styled.div`
    max-width: 780px;
    padding: 70px 0;
    min-height: calc(100vh - 140px);
    display: grid;
    grid-template-rows: 130px auto auto auto auto;
    row-gap: 15px;
    align-items: stretch;
    h1, p{
        text-align:center;
    }
    @media (max-width: 768px) {
        padding: 60px 30px;
        min-height: calc(100vh - 120px);
        grid-template-rows: 100px auto auto auto auto;
        .FRscanner{
            display:none;
        }
        h1, p{
            text-align:left;
        }
        h1{
            font-size:1.8em;
        }
        .FRQR{
            width:180px;
        }
    }
`


const CameraStatus = styled.div`
    position:absolute;
    top:15px;
    left:15px;
    color:red;
    font-size:14px;

    &::before{
        content: "-.-";
        margin-right: 10px;
        background: red;
        border-radius: 50%;
    }

`

