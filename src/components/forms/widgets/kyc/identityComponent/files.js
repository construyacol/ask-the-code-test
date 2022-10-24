
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { AiOutlineUpload } from "react-icons/ai";
import { IoFileTray } from 'react-icons/io5'
import useToastMessage from "../../../../../hooks/useToastMessage";
import { 
  UploadContainer,
  UploadText,
  UploadMiddle, 
  UploadTextMiddle,
  Buttom,
  DropZoneContainer
} from '../../../../widgets/shared-styles'
import useViewport from 'hooks/useViewport'
import SimpleLoader, { LoaderContainer } from "../../../../widgets/loaders";
import { osDevice } from 'utils/index'
import useStage from '../../../hooks/useStage'
import loadable from '@loadable/component'
import { img_compressor, readFile } from '../../../../../utils'
import { ApiPostIdentityFiles } from './api'
import IdentityKycSuccess from './success'
import { UI_NAMES } from '../../../../../const/uiNames'
import { device } from '../../../../../const/const'
import { CAPACITOR_PLATFORM } from 'const/const'
import { H2, P } from 'components/widgets/typography'
import InfoStateComponent from 'components/forms/widgets/infoPanel/mobile'
// import DocumentViewer from './documentViewer'
import { Wrapper as Layout } from '../../layout/styles'
import { checkCameraPermission } from 'utils'

import { 
  FilesContainer,
  Header
} from '../styles' 
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
    currentStage
  } = stageManager

  const { isMobile } = useViewport()
  const [ onDrag, setOnDrag ] = useState()
  const [ imgSrc ] = useState()
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
        setState(prevState => {
          return { ...prevState, [stageData?.key]: {
            name:file?.name,
            size:file?.size,
            type:file?.type,
            img:dataBase64
          }}
        })
        nextStage(true)
        setLoading(false)
      }, 500)     
      // const isAnImage = includesAnyImageMime(dataBase64.split(",")[1])
      // if(!isAnImage){
      // return alert('Solo se aceptan imagenes')
      // }
      // setImgSrc(dataBase64);
      // actions.isAppLoading(true);
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
        setTimeout(() => {
          setState(prevState => {
            return { ...prevState, [stageData?.key]: {
              img:image?.base64String
            }}
          })
          nextStage(true)
          setLoading(false)
        }, 500)  
      } catch (error) {
        console.log('getCameraPhoto err => ', error?.message)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if(currentStage >= stageController.length){
      const execPost = async() => {
        setLoading(true) 
        let res = await ApiPostIdentityFiles({state, dataForm})
        setLoading(false) 
        if(!res)return prevStage();
        nextStage()
      }
      execPost()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStage])
 
  if(!loading && finalStage){
      return <IdentityKycSuccess/>
  }
  
  const { stages } = dataForm
  const currentIdentity = dataForm?.config?.currentIdentity

  return( 
    <>
      <Layout 
        style={{background:"white"}} 
        // className='scroll'
      > 
        <Layout className='infoPanel' style={{background:"transparent", left:"auto"}}>
        
          <DynamicLoadComponent
            component="infoPanel"
            title="Completa tu identidad"
            state={state}
            stageData={stageData}
            dataForm={dataForm}
            {...props}
            // stageStatus={stageStatus}
          />
 
          <FilesContainer className={`${osDevice()}`}>
            <Header className="item_">
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
                <h3 className='fuente subtitle'>
                  Sube los archivos de {UI_NAMES?.documents[currentIdentity?.id_type]} 
                  {!isMobile && <span className="fuente2">No. {currentIdentity?.document_info?.id_number}</span>}
                </h3>
            </Header>
            
            <Main className="item_" onDragOver={dragOver}>

              {/* <DocumentViewer
                currentIdentity={currentIdentity}
                state={state}
              /> */}

              {
                !isMobile &&
                  <UploadComponent
                    goFileLoader={goFileLoader}
                    loading={loading}
                  />
              }

              {onDrag && !imgSrc && (
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
            />

            { 
              isMobile &&
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






const DropZoneComponent = ({ dragLeave, goFileLoader }) => {
  return (
    <DropZoneContainer className="dottedBorder">
      <input
        id="TFileUpload" 
        type="file"
        // accept="image/png,image/jpeg"
        onChange={goFileLoader}
        onDragLeave={dragLeave}
        capture="user" 
        accept="image/*"
      />
      <UploadComponent
        unButtom
        title="Suelta aquí el archivo que quieres subir..."
      />
    </DropZoneContainer>
  );
};


const UploadComponent = props => {

  return(
    <UploadContainer className={`${props.unButtom ? 'unButton' : ''}`}>
        <AiOutlineUpload size={45} color="var(--paragraph_color)" />
        <UploadText className="fuente">
            {props.title || "Arrastra el documento que quieres subir"}
        </UploadText>
        {
          !props.unButtom &&
          <>
            <UploadMiddle>
                <UploadTextMiddle className="fuente" background={"#F9F9F9"}>
                  o selecciona un archivo
                </UploadTextMiddle>
                <hr />
            </UploadMiddle>
            
            <CallToAction
              {...props}
            />
          </>
        }
    </UploadContainer>
  )
}



const CallToAction = props => {

  const INPUT_FILE_PROPS = {
    type:"file",
    accept:"image/png,image/jpeg",
    onChange:props?.goFileLoader
  }

  const INPUT_BUTTON_PROPS = {
    type:"button",
    onClick:props?.getCameraPhoto
  }

  const inputProps = CAPACITOR_PLATFORM !== 'web' ? INPUT_BUTTON_PROPS : INPUT_FILE_PROPS

  return(
      <Buttom className={`${props.loading ? 'loader' : ''}`}>
        {
          props.loading ?
          <LoaderContainer>
            <SimpleLoader loader={2} />
          </LoaderContainer>
          :
          <input
            {...inputProps}
          />
        }
        
        <p style={{ color: "white", margin:"0" }} className="fuente">
          Subir documento
        </p>
      </Buttom>
  )
}

const StageListComponent = ({ stages, stageData, state, idType }) => {

  return(
    <StageList className="item_">
      {
        Object.keys(stages).map((stageKey, index) => {

          const isCurrentEl = stageData?.key === stageKey
          const stageState = state[stageKey] ? 'complete' : 'incomplete'
          const isCurrentElColor = (stageData?.key === stageKey || stageState === 'complete')  ? "var(--primary)" : "var(--paragraph_color)"
          const uiName = stageKey === 'selfie' ? `${stages[stageKey]?.uiName} sosteniendo ${UI_NAMES?.documents[idType]}` : stages[stageKey]?.uiName

          return(
            <StageListItemContainer key={index} className={`${isCurrentEl ? 'current' : ''} ${stageState}`}>
              <IconContainer className={`${stageState}`}>
                {/* <span>{getAcronym(stages[stageKey]?.key)}</span> */}
                <IoFileTray
                  size={18} 
                  color={isCurrentElColor}
                />
              </IconContainer>
              
              <P className={`_title ${stageState}`} size={15} >{uiName}</P>

              {state[stageKey] && <P className="number _size">{state[stageKey]?.size} KB</P>}

              <ControlContainer className="item__">
                { isCurrentEl && <CurrentStageIndicator/>}
              </ControlContainer>
            </StageListItemContainer>
          )
        })
      }
    </StageList>
  )
}


const MobileControlContainer = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  align-items: center;
  place-content: center;
`

const CurrentStageIndicator = styled.div`
  width:12px;
  height:12px;
  background:var(--primary);
  border-radius:50%;
`

const IconContainer = styled.div`
  width:45px;
  height:45px;
  grid-row: 1 / 3;
  border-radius:50%;
  background: #f7f7f7;
  border: 2px solid #e9e9e9;

  &.complete{
    background: #0198ff14;
    border: 1px solid var(--primary);
  }

  display: flex;
  place-content: center;
  place-items: center;

  span{

  }

`

const ControlContainer = styled.div`
  grid-row: 1 / 3;
  grid-column: 3 / 4;
`

const StageListItemContainer = styled.div`

  display:grid;
  grid-template-columns: minmax(35px, auto) 1fr minmax(35px, auto);
  grid-template-rows: repeat(2, 1fr);
  column-gap:10px;
  align-items:center;
  padding:0 15px;
  cursor:pointer;
  border-radius: 6px;
  transition:.2s;
  opacity:.2;
  max-width: 300px;
  
  &.current{
    background:#f1f1f1;
    opacity:1;
  }

  &.complete{
    opacity:1;
    p{
      color:var(--primary);
    }
  }

  &.incomplete{
    pointer-events: none;
    &.current{
      pointer-events: all;
    }
  }

  &.current{
    ._title{
      font-weight:bold;
      color:var(--primary);
    }
  }


  ._title{
    font-size:1rem;  
    color:var(--paragraph_color);
    padding-top:15px;

    &.incomplete{
      grid-row: 1 /3;
      padding-top: 0;
    }

  }

  ._size{
    font-size:11px;
    color:gray;
    align-self: flex-start;
    padding-top: 2px;
  }

  ._title,
  ._size{
    padding-left:12px;
  }

  p{
    margin:0;
    display: flex;
    align-items: center;
  }

  .item__{
    ${'' /* border:1px solid green; */}
  }

  @media ${device.mobile}{
    max-width: none;
  }
`


const StageList = styled.div`
  display:grid;
  grid-template-columns:1fr;
  grid-template-rows: repeat(auto-fill, 70px);
  row-gap:8px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background: #475a681f;
  }
`



 

const Main = styled.div`
  background: #F9F9F9;
  border-radius: 5px;
  place-content:center;
  position:relative;

  /* grid-template-rows: 1fr auto; */
  /* row-gap: 20px; */
  /* padding: 70px 40px; */

  @media ${device.mobile}{
    display:none !important;
  }
`



