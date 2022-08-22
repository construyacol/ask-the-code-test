import React, { useEffect, useRef, useState } from 'react'
import loadable from '@loadable/component'
import styled from 'styled-components'
import { CameraPreview } from '@awesome-cordova-plugins/camera-preview';
import { useSelector } from "react-redux";
import useStage from '../../hooks/useStage'
import validations from './validations.js';
import StatusIndicator from './biometricStatus'
import { Scanner } from './scanner'
import { getCdnPath } from '../../../../environment'
import loadDynamicScript from '../../../../utils/loadDynamicScript'
import { funcDebounces } from '../../../../utils'
import { useCoinsendaServices } from "../../../../services/useCoinsendaServices";
import { ENVIRONMENT_VAR, device } from '../../../../const/const'
import useSocket from 'hooks/useSocket'
import { CAPACITOR_PLATFORM } from 'const/const'
import sleep from 'utils/sleep';
import Captures from './captures'
import {
  Layout,
  ContentContainer
} from '../sharedStyles'


// Interval to evaluate the snapshot taken from the canvas
const DETECTION_INTERVAL_MS = 500;

const ONE_SECOND_MS = 1000;

// camera options (Size and location). In the following example, the preview uses the rear camera and display the preview in the back of the webview
const cameraPreviewOpts = {
  x: 0,
  y: 0,
  width: 260,
  height: 260,
  camera: 'front',
  tapPhoto: false,
  previewDrag: false,
  toBack: false
}

const pictureOpts = {
  width: 720,
  height: 720,
  quality: 85
}


const modelsPath = ENVIRONMENT_VAR === 'development' ? '/models' : `${getCdnPath('tensor')}/`
const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))

// Evaluates userMedia for web, it is not needed inside the functions, this can be seen as a constant
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

function BiometricKycComponent({ handleDataForm, handleState, ...props }) {
 
  const { dataForm } = handleDataForm
  const { setState, state } = handleState
  const [isLoadingFaceApi, setIsLoadingFaceApi] = useState(false)
  const [cameraAvailable, setCameraAvailable] = useState()
  const [boardingAgreement, setBoardingAgreement] = useState(false)
  const [coinsendaServices] = useCoinsendaServices();
  const modelData = useSelector((state) => state.modelData);
  const [biometricData] = useSocket(`/biometric_data/${modelData.authData.userId}`)


  const mediaElementRef = useRef(null);
  const scannerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const faceApi = useRef(window.faceapi);

  const stageManager = useStage(
    // create the form stages
    Object.keys(dataForm?.handleError?.errors || dataForm.stages),
    dataForm.stages
  )

  const {
    stageData,
    currentStage,
    nextStage,
    finalStage,
    setStageData,
    // stageController
  } = stageManager

  const displaySize = React.useMemo(function () {
    if (!mediaElementRef.current) {
      return {
        width: 120,
        height: 120
      }
    }
    return {
      width: mediaElementRef.current.clientWidth || mediaElementRef.current.width,
      height: mediaElementRef.current.clientHeight || mediaElementRef.current.height
    };
  }, [mediaElementRef]);

  const handleVideo = stream => {
    setCameraAvailable(true);
    if (mediaElementRef.current) {
      mediaElementRef.current.srcObject = stream;
    }
  }

  const videoError = () => setCameraAvailable(false)


  const takeMobileSnapshot = React.useCallback(function (mediaElementRef) {
    return new Promise(async resolve => {
      try {
        const base64ImageData = await CameraPreview.takeSnapshot(pictureOpts);
        mediaElementRef.src = `data:image/jpg;base64,${base64ImageData}`;
        mediaElementRef.onload = async () => {
          faceApi.current.matchDimensions(faceApi.current.createCanvasFromMedia(mediaElementRef), displaySize)
          resolve(`data:image/jpg;base64,${base64ImageData}`);
        };
      } catch {
        resolve(``)
      }
    });
  }, [displaySize])

  const startMobileStreaming = async function () {
    try {
      const rect = videoContainerRef.current.getBoundingClientRect();
      await CameraPreview.startCamera({
        ...cameraPreviewOpts,
        x: rect.left,
        y: rect.top,
      });
      setCameraAvailable(true);
    } catch (e) {
      setCameraAvailable(false);
    }
  }

  const startStreaming = () => {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    navigator.getUserMedia && navigator.getUserMedia({ video: true }, handleVideo, videoError);
  }

  const challengeIsSolved = React.useCallback(async () => {
    setStageData(prevState => ({ ...prevState, solved: true }));
    await sleep(ONE_SECOND_MS);
    nextStage();
  }, [setStageData, nextStage]);

  const initDetections = React.useCallback(async () => {
    const scanner = scannerRef.current;
    let base64SnapShot = null;
    // sessionStorage.removeItem(stageData?.key);
    if (CAPACITOR_PLATFORM !== 'web') {
      base64SnapShot = await takeMobileSnapshot(mediaElementRef.current);
    } else {
      base64SnapShot = getFrame(displaySize, mediaElementRef.current, faceApi);
    }

    const detections = await faceApi.current.detectAllFaces(mediaElementRef.current,
      new faceApi.current.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();

      
    if (detections?.length) {
      scanner && !scanner?.classList?.value?.includes('scanning') && scanner.classList.add('scanning');
      if (!validations[stageData?.key]) return alert('No existe validación para este stage, contácta con soporte');

      const _value = validations[stageData.key](detections[0], base64SnapShot);

      // if (!_value || sessionStorage.getItem(stageData?.key)) {
        console.log('RES ==> : ', stageData.key, detections[0].expressions[stageData.key] || detections[0].expressions.happy)
        if (!_value) {
        console.log('BAD VALUE RES: ', stageData.key, _value)
        await sleep(DETECTION_INTERVAL_MS);
        return initDetections();
      }

      setState(prevState => ({ ...prevState, [stageData?.key]: _value }))
      // sessionStorage.setItem(stageData?.key, stageData?.biometricId);
      const res = await coinsendaServices.addNewBiometricData({
        file: _value.split(',')[1],
        biometric_id: stageData.biometricId,
        challenge_name: stageData.key
      })
      res.data === false && challengeIsSolved();
    } else {
      console.log('sin detección', DETECTION_INTERVAL_MS)
      await sleep(DETECTION_INTERVAL_MS);
      initDetections();
    }
    scanner && scanner?.classList?.value.includes('scanning') && scanner.classList.remove('scanning');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeIsSolved, coinsendaServices, displaySize, setState, stageData?.key, stageData?.biometricId, takeMobileSnapshot])


  useEffect(() => {
    boardingAgreement && cameraAvailable && initDetections();
    // eslint-disable-next-line
  }, [cameraAvailable, boardingAgreement, stageData?.key])


  useEffect(() => {
    (boardingAgreement && !isLoadingFaceApi) && CAPACITOR_PLATFORM !== 'web' && startMobileStreaming();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingFaceApi, boardingAgreement])


  useEffect(() => {
    if (finalStage) {
      const disableTransactionSecutiry = async () => {
        await coinsendaServices.disableTransactionSecutiry("biometric");
        if (!props.orderData) return;
        const { orderData: { order, paymentProof } } = props
        return coinsendaServices.confirmDepositOrder(order.id, paymentProof);
      }
      disableTransactionSecutiry();
      CAPACITOR_PLATFORM !== 'web' && CameraPreview.stopCamera();
    }
  }, [finalStage, coinsendaServices, props])


  useEffect(() => {
    const mediaElementNode = mediaElementRef.current;
    loadDynamicScript(async () => {
      setIsLoadingFaceApi(true);
      if (!window.faceapi) return alert('No están cargando las librerías FACE_API');
      faceApi.current = window.faceapi
      await faceApi.current.nets.tinyFaceDetector.loadFromUri(modelsPath)
      await faceApi.current.nets.faceLandmark68Net.loadFromUri(modelsPath)
      await faceApi.current.nets.faceRecognitionNet.loadFromUri(modelsPath)
      await faceApi.current.nets.faceExpressionNet.loadFromUri(modelsPath)
      setIsLoadingFaceApi(false);
      CAPACITOR_PLATFORM === 'web' && startStreaming()
    }, `${getCdnPath('faceApi')}`, 'faceApi');

    return () => {
      if (CAPACITOR_PLATFORM === 'web' && mediaElementNode) {
        mediaElementNode.pause();
        mediaElementNode.srcObject?.getTracks()[0].stop()
      } else {
        return CameraPreview.stopCamera();
      }
    }
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    if (typeof (stageData?.key) === 'string' && biometricData?.challenge_name === stageData?.key) {
      funcDebounces({
        keyId: { [biometricData.state]: biometricData.id },
        storageType: "sessionStorage",
        timeExect: 1500,
        callback: () => {
          biometricData.state === 'accepted' && challengeIsSolved()
          biometricData.state === 'rejected' && initDetections()
          console.log('biometricData', biometricData)
        }
      })
    }
    // !biometricData && stageData?.key === 'surprised' && initDetections();
    // eslint-disable-next-line
  }, [biometricData]);



  if (finalStage) {
    // Render success Stage
    return (
      <>
        <DynamicLoadComponent
          component={`${dataForm?.wrapperComponent}/success`}
          handleDataForm={handleDataForm}
          handleState={handleState}
          coinsendaServices={coinsendaServices}
          {...props}
        />
      </>
    )
  }

  return (
    <>
      { process.env.NODE_ENV === "development" && <Captures state={state}/> }
      <Layout className="faceApiLayout__">
        {
          !boardingAgreement &&
          <DynamicLoadComponent
            component="biometricKycComponent/onBoardingAgreement"
            cameraAvailable={cameraAvailable}
            handleAction={() => {
              setBoardingAgreement(true)
            }}
          />
        }
        <ContentContainers>
          <StatusIndicator
            data={stageData?.solved}
          />
          <h3 className="FRecTitle fuente">Reconocimiento Facial</h3>
          <VideoContainer ref={videoContainerRef}>
            {isLoadingFaceApi && <div className="biometricLoaderContainer" />}
            <Scanner ref={scannerRef} className="FRecScanner" />
            {CAPACITOR_PLATFORM === 'web' && <video ref={mediaElementRef} autoPlay={true} width={'100%'} height={'100%'} />}
            {CAPACITOR_PLATFORM !== 'web' && <img style={{ display: 'none', objectFit: 'cover' }} ref={mediaElementRef} width={260} height={260} alt="streaming snapshot" />}
            {CAPACITOR_PLATFORM !== 'web' && !isLoadingFaceApi && <BlinkText><em />SCANNING</BlinkText>}
          </VideoContainer>
          <IndicatorStage>
            <Indicator className={`${currentStage === 0 ? 'active' : ''}`} />
            <Indicator className={`${currentStage === 1 ? 'active' : ''}`} />
          </IndicatorStage>
          <h1 className="fuente">{stageData?.uiName}</h1>
          <p className="fuente">Mantén tu cabeza erguida y asegurate que tu rostro encaje dentro del circulo</p>
        </ContentContainers>
      </Layout>
    </>
  )
};

const getFrame = (displaySize, mediaElement, faceApi) => {
  try {
    const { width, height } = displaySize;
    const canvas = faceApi.current.createCanvasFromMedia(mediaElement);
    faceApi.current.matchDimensions(canvas, displaySize)
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(mediaElement, 0, 0, width, height)
    return canvas.toDataURL('image/jpeg')
  } catch {
    return '';
  }
}

export default BiometricKycComponent

const BlinkText = styled.p`
  position: absolute;
  bottom: -10px;
  width: 100%;
  color: #18c89b !important;
  font-weight: bold;
  animation: blink-animation 1s steps(5, start) infinite;
  -webkit-animation: blink-animation 1s steps(5, start) infinite;
  @keyframes blink-animation {
    50% { opacity: 0; }
  }
  @-webkit-keyframes blink-animation {
    50% { opacity: 0; }
  }
  &::before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #18c89b;
    position: relative;
    right: 4px;
  }
`;

const Indicator = styled.div`
  width:7px;
  height:12px;
  background:#c9c9c9;
  border-radius:5px;
  margin:0 4px;
  transition:.3s;
  &.active{
    height:22px;
    background:#0198ff;
  }
`

const IndicatorStage = styled.div`
  height:30px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const VideoContainer = styled.div`
  position: relative;
  clip-path: circle(37% at 50% 50%);
  min-width: 260px;
  @media ${device.laptopM} {
    max-height: 300px;
    clip-path: none;
    width: fit-content;
    justify-self: center;
    overflow: hidden;
    border-radius: 15px;
  }
`

const ContentContainers = styled(ContentContainer)`

  justify-self:center;

  .FRecTitle{
    color:#0198ff;
    font-weight:bold;
  }
  p{
    text-align:center;
    color:gray;
    font-size: 1.2em;
    max-width: 500px;
    justify-self: center;
  }
  h1{
    text-align:center;
    font-size: 2.7em;
    margin-bottom:0;
  }
  h3{
    span{
      color: transparent;
      border-radius: 50%;
      background: #2ad083;
      margin-right: 10px;
      font-size:15px;
    }
  }

  @media ${device.laptopM} {
    padding: 10px 0;
    height: calc(100vh - 20px);
  }

  @media (max-width: 768px) {
    ${VideoContainer}{
      ${'' /* clip-path: circle(29% at 50% 50%); */}
    }

    padding: 30px 20px;
    width:calc(100vw - 40px);
    height: calc(100vh - 60px);

    p{
      font-size:1em;
    }
    h1{
      font-size:2em;
    }

  }


`

// Pitch: 'Rotate head' 
// Rigth: +,
// Left:-

// Roll: 'Tilt head'
// Rigth: +,
// Left:-

// Open the mouth
// Smile

// crear developer mode
// true = no toma screenshots, muestra indicadores face expressions|detections|logs
// false = user mood, funcionamiento para usuario final

// Detectar la camara handle camera error | notFound(continous flow from mobile)
// Agregar marca de agua
// Copy: Desarrollado por Coinsenda

// Cargar librería de forma dinámica
// cargar modelos desde cdn 

// modularizar en component/utils todas las funciones de utilidad y de validación correspondientes a cada componente
// diseñar la interfaz

// tener en cuenta el factor tiempo 
// Detectar progresividad de los gestos
// enviar 3 frames al backend


// acceder nativamente a la camara del celular