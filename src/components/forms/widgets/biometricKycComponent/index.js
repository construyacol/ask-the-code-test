import { useEffect, useRef, useState } from 'react'
import useStage from '../../hooks/useStage'
import useValidations from '../../hooks/useInputValidations'
import { getDisplaySize } from './utils'
import loadable from '@loadable/component'
import styled from 'styled-components'
import StatusIndicator from '../biometricStatus'
import { Scanner } from './scanner'
import Captures from './captures'
import { getCdnPath } from '../../../../environment'
import loadDynamicScript from '../../../../utils/loadDynamicScript'
import { useCoinsendaServices } from "../../../../services/useCoinsendaServices";
import useSocket from '../../../hooks/useSocket'
import { useSelector } from "react-redux";
import { ENVIRONMENT_VAR } from '../../../../const/const'
import {
  Layout,
  ContentContainer
} from '../sharedStyles'
import './styles.css'


const modelsPath = ENVIRONMENT_VAR === 'development' ? '/models' : `${getCdnPath('tensor')}/`


const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))

 
const BiometricKycComponent = ({ handleDataForm, handleState }) => {

  const modelData = useSelector((state) => state.modelData);
  const { dataForm } = handleDataForm
  const { state, setState } = handleState
  const [ loading, setLoading ] = useState(false)
  const [ cameraAvailable, setCameraAvailable ] = useState()
  const [ boardingAgreement, setBoardingAgreement ] = useState(false)
  const [ coinsendaServices ] = useCoinsendaServices();
  const validations = useValidations()

  const videoEl = useRef(null);
  let intervalDetection = useRef(null);
  const faceApi = useRef(window.faceapi)
  const [ developerMood ] = useState(window?.location?.search?.includes('developer=true'))
  const [ biometricData ] = useSocket(`/biometric_data/${modelData.user.id}`)

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
    stageController
  } = stageManager


  const setupFaceApi = async() => {
    setLoading(true)
    if(!window.faceapi) return alert('No están cargando las librerías');
    faceApi.current = window.faceapi
    await faceApi.current.nets.tinyFaceDetector.loadFromUri(modelsPath)
    await faceApi.current.nets.faceLandmark68Net.loadFromUri(modelsPath)
    await faceApi.current.nets.faceRecognitionNet.loadFromUri(modelsPath)
    await faceApi.current.nets.faceExpressionNet.loadFromUri(modelsPath)
    startStreaming()
  } 

  const handleVideo = stream => {
    setCameraAvailable(true)
    if(!videoEl.current) return;
    videoEl.current.srcObject = stream;
  }

  const videoError = err => {
    console.log('No hay camara conectada o los permisos han sido denegados', err) 
    setCameraAvailable(false)
  } 


  const startStreaming = () => {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    if (navigator.getUserMedia) {     
      navigator.getUserMedia({video: true}, handleVideo, videoError);
      if(!videoEl.current?.addEventListener) return;
      videoEl.current.addEventListener('play', () => {
        console.log('el streaming a comenzado', faceApi.current)
        const canvas = faceApi.current.createCanvasFromMedia(videoEl.current)
        canvas.style.display = 'none'
        canvas.id = "faceApiCanvas"
        document.querySelector('#videoContainer').append(canvas)
        faceApi.current.matchDimensions(canvas, getDisplaySize())
        setLoading(false)
      })
    }
  }

  const startDeveloperMood = (canvas, detections) => {
    canvas.style.display = 'initial'
    const resizedDetections = faceApi.current.resizeResults(detections, getDisplaySize())
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceApi.current.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceApi.current.draw.drawDetections(canvas, resizedDetections)
    faceApi.current.draw.drawFaceExpressions(canvas, resizedDetections)
  }


  const initDetections = (canvas, intervalTime) => {
    const scanner = document.querySelector('.FRecScanner')
    let counter = 1
    intervalDetection.current = setInterval(async() =>{
      const detections = await faceApi.current.detectAllFaces(videoEl.current, 
        new faceApi.current.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions(); 

        if(developerMood) startDeveloperMood(canvas, detections);
        if(detections?.length){

          console.log('validations', stageData?.key)
          if(scanner && !scanner?.classList?.value?.includes('scanning')) scanner.classList.add('scanning');
          if(!validations[stageData?.key]){return}

          const [ _value ] = validations[stageData.key](detections[0], {...stageData, state, dataForm});
          if(!_value || counter > 1){return}
          canvas.style.display = 'none'
          setState(prevState => {
            return { ...prevState, [stageData?.key]: _value ? _value : prevState[stageData?.key] }
          })
          clearInterval(intervalDetection.current)
          counter++
          const res = await coinsendaServices.addNewBiometricData({
            file:_value.split(',')[1],
            biometric_id:stageData.biometricId,
            challenge_name:stageData.key
          })
          if(res?.data === false){
            challengeIsSolved()
          }
          console.log('|||||||||||||||  addNewBiometricData res ==> ', res)
        }else{
          console.log('Detectando...')
          if(scanner && scanner?.classList?.value.includes('scanning'))scanner.classList.remove('scanning');
        }
        
    }, intervalTime)
  }

  useEffect(() => {
    const canvas = document.querySelector('#faceApiCanvas')
    if((boardingAgreement && canvas) && (!stageData?.solved && !finalStage)){
      initDetections(canvas, 600)
    }
    // console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||  stageData ==> ', stageData, state)
    return () => clearInterval(intervalDetection.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageData, boardingAgreement, loading])

  const challengeIsSolved = () => {
    setStageData(prevState => { return {...prevState, solved:true} })
    setTimeout(()=> nextStage(), 1500)
  }

  const tryToSolveChallenge = async() => {
      const userBiometric = await coinsendaServices.getUserBiometric()
      if(!userBiometric?.solved) return;
      nextStage(stageController.length+1)
      // await coinsendaServices.fetchCompleteUserData()
  }

 
  useEffect( () => {

    console.log('|||||||||||||  biometricData ==> ', biometricData)
    if(biometricData?.state === 'accepted' && !cameraAvailable){
      console.log('cameraAvailable', cameraAvailable)
      tryToSolveChallenge()
    }

    if(biometricData?.challenge_name === stageData?.key){
      if(biometricData.state === 'accepted'){
        challengeIsSolved()
      }else if(biometricData.state === 'rejected'){
        setState(prevState => { return { ...prevState, [stageData?.key]: '' } })
        const canvas = document.querySelector('#faceApiCanvas')
        initDetections(canvas, 600)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biometricData])


  useEffect(()=>{
    if(finalStage){
      const disableTransactionSecutiry = async() => await coinsendaServices.disableTransactionSecutiry("biometric")
      disableTransactionSecutiry()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalStage])

  useEffect(()=>{
    // setupFaceApi()
    loadDynamicScript(setupFaceApi, `${getCdnPath('faceApi')}`, 'faceApi')
    return () => {
      videoEl.current?.pause();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      videoEl.current?.srcObject?.getTracks()[0].stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log('modelsPath', modelsPath)
  

   if(finalStage){
    // Render success Stage
    return (
      <>
        { developerMood && <Captures state={state}/> }
        <DynamicLoadComponent
              component={dataForm?.successStage?.component}
              handleDataForm={handleDataForm}
              handleState={handleState}
        />
      </>
    )
  }

    return(
      <Layout>
        { 
          !boardingAgreement &&
            <DynamicLoadComponent
              component="onBoardingAgreement"
              cameraAvailable={cameraAvailable}
              handleAction={() => {
                setBoardingAgreement(true)
              }}
            /> 
        }

        { developerMood &&<Captures state={state}/> }

        <ContentContainers id="faceApiContainer">
          <StatusIndicator 
            data={stageData?.solved}
          />
          <h3 className="FRecTitle fuente">Reconocimiento Facial</h3>
          <VideoContainer id="videoContainer">            
            { loading && <div className="biometricLoaderContainer"></div>}
            { !developerMood && <Scanner className="FRecScanner"/>}
            <video id="streamingVideo" autoPlay={true} ref={videoEl} width={'100%'} height={'100%'} />
          </VideoContainer>
          <IndicatorStage>
            <Indicator className={`${currentStage === 0 ? 'active' : ''}`}/>
            <Indicator className={`${currentStage === 1 ? 'active' : ''}`}/>
          </IndicatorStage>
          <h1 className="fuente">{stageData?.uiName}</h1>
          <p className="fuente">Mantén tu cabeza erguida y asegurate que tu rostro encaje dentro del circulo</p>
        </ContentContainers>
      </Layout>
    )
} 


export default BiometricKycComponent





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
`

const ContentContainers = styled(ContentContainer)`

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
  @media (max-width: 768px) {
  ${VideoContainer}{
    clip-path: circle(29% at 50% 50%);
  }

  padding: 30px 20px;
  width:calc(100vw - 40px);

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