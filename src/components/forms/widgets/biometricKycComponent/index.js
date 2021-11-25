import { useEffect, useRef, useState } from 'react'
import useStage from '../../hooks/useStage'
import useValidations from '../../hooks/useInputValidations'
import { getDisplaySize } from './utils'
import loadable from '@loadable/component'
import styled from 'styled-components'
// import StatusIndicator from '../biometricStatus'
import { Scanner } from './scanner'
import Captures from './captures'
import './styles.css'

const modelsPath = '/models'
const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))


const BiometricKycComponent = ({ handleDataForm, handleState }) => {

  const { dataForm } = handleDataForm
  const { state, setState } = handleState
  const [ loading, setLoading ] = useState(false)
  const [ cameraAvailable, setCameraAvailable ] = useState()
  const [ boardingAgreement, setBoardingAgreement ] = useState(false)
  
  const validations = useValidations()

  const videoEl = useRef(null);
  let intervalDetection = useRef(null);
  const faceApi = useRef(window.faceapi)
  const [ developerMood ] = useState(window?.location?.search?.includes('developer=true'))

  const stageManager = useStage(
    // create the form stages
    Object.keys(dataForm?.handleError?.errors || dataForm.stages),
    dataForm.stages
  )

  const {
    stageData,
    currentStage,
    stageController,
    nextStage,
    finalStage
  } = stageManager

  
  const setupFaceApi = async() => {
    setLoading(true)
    if(!faceApi.current){alert('No está cargando las librerías')}
    await faceApi.current.nets.tinyFaceDetector.loadFromUri(modelsPath)
    await faceApi.current.nets.faceLandmark68Net.loadFromUri(modelsPath)
    await faceApi.current.nets.faceRecognitionNet.loadFromUri(modelsPath)
    await faceApi.current.nets.faceExpressionNet.loadFromUri(modelsPath)
    startStreaming()
  } 

  const handleVideo = stream => {
    setCameraAvailable(true)
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
      videoEl.current.addEventListener('play', () => {
        console.log('el streaming a comenzado')
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
          if(scanner && !scanner?.classList?.value?.includes('scanning'))scanner.classList.add('scanning');
          if(!validations[stageData?.key]){return}

          const [ _value ] = validations[stageData.key](detections[0], {...stageData, state, dataForm});
          if(!_value || counter > 1){return}
          canvas.style.display = 'none'
          setState(prevState => {
            return { ...prevState, [stageData?.key]: _value ? _value : prevState[stageData?.key] }
          })
          clearInterval(intervalDetection.current)
          setTimeout(()=>nextStage(), 1500)
          counter++
        }else{
          console.log('Detectando...')
          if(scanner && scanner?.classList?.value.includes('scanning'))scanner.classList.remove('scanning');
        }
        
    }, intervalTime)
  }

  useEffect(()=>{
    const canvas = document.querySelector('#faceApiCanvas')
    const _stageData = dataForm.stages[stageController[currentStage]]
    if((boardingAgreement && canvas) && (stageData === _stageData && !state[_stageData?.key]) && !finalStage){
      initDetections(canvas, 600)
    }
    return () => clearInterval(intervalDetection.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageData, boardingAgreement, loading])


  useEffect(()=>{
    console.log('developerMood', developerMood)
    setupFaceApi()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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
      <>
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

        <ContentContainer>
          {/* <StatusIndicator 
            data={state[stageData?.key]}
          /> */}
          <h3 className="FRecTitle">Reconocimiento Facial</h3>
          <VideoContainer id="videoContainer">            
            { loading && <div className="biometricLoaderContainer"></div>}
            { !developerMood && <Scanner className="FRecScanner"/>}
            <video id="streamingVideo" autoPlay={true} ref={videoEl} width={'100%'} height={'100%'} />
          </VideoContainer>
          <IndicatorStage>
            <Indicator className={`${currentStage === 0 ? 'active' : ''}`}/>
            <Indicator className={`${currentStage === 1 ? 'active' : ''}`}/>
          </IndicatorStage>
          <h1>{stageData?.uiName}</h1>
          <p>Mantén tu cabeza erguida y asegurate que tu rostro encaje dentro del circulo</p>
        </ContentContainer>
      </>
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

const ContentContainer = styled.div`

  position:relative;
  width:100vw;
  height:auto;
  max-width:800px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto auto auto;
  height: calc(100vh - 80px);
  padding: 40px 0;
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