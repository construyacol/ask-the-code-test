
import React, { useState, useEffect } from 'react'
import useToastMessage from "../../../../../hooks/useToastMessage";
import useViewport from 'hooks/useViewport'
import { osDevice } from 'utils/index'
import useStage from '../../../hooks/useStage'
import loadable from '@loadable/component'
import { img_compressor, readFile } from '../../../../../utils'
import { ApiPostIdentityFiles } from './api'
import IdentityKycSuccess from './success'
import { UI_NAMES } from '../../../../../const/uiNames'
import { CAPACITOR_PLATFORM } from 'const/const'
import { H2, P } from 'components/widgets/typography'
import InfoStateComponent from 'components/forms/widgets/infoPanel/mobile'
import DocumentViewer, { DocumentManager } from 'components/widgets/documentViewer'
import { Wrapper as Layout } from '../../layout/styles'
import { checkCameraPermission } from 'utils'
import UploadComponent from './uploadComponent'
import DropZoneComponent from './dropZone'
import CallToAction from './cta'
import StageListComponent from './stageList'
import { 
  FilesContainer,
  Header
} from '../styles' 
import { 
  MobileControlContainer,
  Main
} from './styles'
import kycHoc from 'components/hoc/kycHoc'

const DynamicLoadComponent = loadable(() => import('../../../dynamicLoadComponent'))

const IdentityKycComponent = ({ handleDataForm, handleState, title, ...props }) => {

  const { dataForm } = handleDataForm
  const [ toastMessage ] = useToastMessage();
  const stageManager = useStage(
    // create the form stages
    Object.keys(dataForm.stages),
    dataForm.stages
  )

  const {
    prevStage,
    nextStage,
    finalStage,
    stageController,
    stageData,
    currentStage,
    goToStage
  } = stageManager

  const { isMobile } = useViewport()
  const [ onDrag, setOnDrag ] = useState()
  const [ maxHeight, setMaxHeight ] = useState(0)
  // const [ imgSrc ] = useState()
  const [ loading, setLoading ] = useState(false)

  const { 
    state, 
    setState 
  } = handleState
  
  const dragLeave = (event) => {
    event.preventDefault();
    if (onDrag) {
      setOnDrag(!onDrag);
    } 
  };

  const dragOver = (event) => {
    event.preventDefault();
    if (!onDrag) {
      setOnDrag(!onDrag);
    }
  };

  const goFileLoader = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setOnDrag(false);
      if(!e?.target?.files[0]?.type?.includes("image"))return toastMessage("Solo se permiten imagenes.");
      setLoading(true)
      const data = e.target.files[0];
      const file = await img_compressor(data, 0.25);
      const dataBase64 = await readFile(file);
      setTimeout(() => {
        setDataStageInfo({
          name:file?.name,
          size:file?.size,
          type:file?.type,
          img:dataBase64
        })
        setLoading(false)
      }, 500)     
    }
  };


  const getCameraPhoto = async() => {
    // Runs only on native app
    if (CAPACITOR_PLATFORM !== 'web' && await checkCameraPermission()) {
      try {
        const { Camera, CameraResultType } = await import("@capacitor/camera");
        setLoading(true)
        const image = await Camera.getPhoto({
          quality: 70,
          resultType: CameraResultType.Base64,
          // source:CameraSource.Camera,
          promptLabelHeader:"Tomar imagen desde...",
          promptLabelPicture:"Cámara",
          promptLabelPhoto:"Galería"
        });

        // setTimeout(() => {
        //   setState(prevState => {
        //     return { ...prevState, [stageData?.key]: {
        //       img:image?.base64String
        //     }}
        //   })
        //   nextStage()
        //   setLoading(false)
        // }, 500)  

        setTimeout(() => {
          setDataStageInfo({ img:image?.base64String })
          // setState(prevState => {
          //   const newState = { 
          //     ...prevState, 
          //     [stageData?.key]: { img:image?.base64String }
          //   }
          //   const targetStage = Object.keys(newState).find(element => !newState[element])
          //   handleStage(targetStage)
          //   return newState
          // })
          setLoading(false)
        }, 500)     


      } catch (error) {
        console.log('getCameraPhoto err => ', error?.message)
        setLoading(false)
      }
    }
  }

  const setDataStageInfo = data => {
    setState(prevState => {
      const newState = { 
        ...prevState, 
        [stageData?.key]: data
      }
      const targetStage = Object.keys(newState).find(element => !newState[element])
      handleStage(targetStage)
      return newState
    })
  }

  const handleStage = (stageKey) => {
    const targetStage = stageController.indexOf(stageKey)
    goToStage(targetStage)
  }

  useEffect(() => {
    if(!Object.keys(state).find(element => !state[element])){
      const execPost = async() => {
        setLoading(true) 
        let res = await ApiPostIdentityFiles({state, dataForm})
        setLoading(false) 
        if(!res)return prevStage();
        nextStage(stageController?.length)
      }
      execPost()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  useEffect(() => {
    const kycHeader = document.querySelector(".documentKycHeader")
    const paddingContTopBottom = (kycHeader?.offsetTop*2)
    const innerPadding = 80
    const rowGap = 50
    const total = window.innerHeight - (paddingContTopBottom + kycHeader?.offsetHeight + rowGap + innerPadding)
    setMaxHeight(total)
  }, []) 
 
  if(!loading && finalStage){
      return <IdentityKycSuccess/>
  }
  
  const { stages } = dataForm
  const currentIdentity = dataForm?.config?.currentIdentity


  return( 
    <>
      <Layout 
        style={{background:"white"}} 
      > 
        <Layout className='infoPanel' style={{background:"white", left:"auto"}}>
        
          <DynamicLoadComponent
            component="infoPanel"
            title="Completa tu identidad"
            state={state}
            stageData={stageData}
            dataForm={dataForm}
            {...props}
          />
 
          <FilesContainer className={`${osDevice()}`}>
            <Header className="item_ documentKycHeader">
                <H2 size={30} id="titleContainer__" color="title_color" style={{margin:0}} className="align-left ">{title || "Verificación de identidad"}</H2>
                {
                  isMobile &&
                    <InfoStateComponent 
                      id="infoStatemobile__"
                      currentStage={currentStage}
                      stageController={stageController}
                      dataForm={dataForm}
                      customStage={dataForm?.handleError?.errors ? 0.99 : 6}
                      currentIdentity={currentIdentity}
                      {...props}
                    />
                }
                <P className='fuente subtitle'>
                  Sube las fotografías de tu {UI_NAMES?.documents[currentIdentity?.id_type]}&nbsp;
                  {!isMobile && <span className="fuente2">No. {currentIdentity?.document_info?.id_number}</span>}
                </P>
            </Header>
            
            <Main className={`item_ ${(state[stageData?.key] && !loading) ? 'onManager' : ''}`} onDragOver={dragOver} maxHeight={maxHeight}>
              {
                (state[stageData?.key] && !loading) ? 
                  <DocumentManager
                    stageData={stageData}
                    state={state}
                    setState={setState}
                    handleStage={handleStage}
                  />
                :
                <>
                  <DocumentViewer 
                    stageData={stageData}
                    currentIdentity={currentIdentity}
                    stageManager={stageManager}
                  />
                  {
                    !isMobile &&
                      <UploadComponent
                        goFileLoader={goFileLoader}
                        loading={loading}
                      />
                  }
                </>
              }

              {onDrag && (
                <DropZoneComponent
                  dragLeave={dragLeave}
                  goFileLoader={goFileLoader}
                />
              )} 
              
            </Main>

            <StageListComponent  
              stages={stages}
              state={state}
              stageData={stageData}
              loading={loading}
              idType={currentIdentity?.id_type}
              stageController={stageController}
              handleStage={handleStage}
            />

            { 
              (isMobile && !state[stageData?.key]) &&
                <MobileControlContainer className="_controlContainerFiles">
                  <CallToAction
                    getCameraPhoto={getCameraPhoto}
                    goFileLoader={goFileLoader}
                    loading={loading}
                  />
                </MobileControlContainer>
            }

          </FilesContainer>
        </Layout>
      </Layout>
    </>
  )
}

export default kycHoc(IdentityKycComponent)







