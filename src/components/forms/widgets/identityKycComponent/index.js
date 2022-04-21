
import React, { useState } from 'react'
import styled from 'styled-components'
import { FcOpenedFolder } from 'react-icons/fc'
import { AiOutlineUpload } from "react-icons/ai";
// import { MdOutlineAttachFile } from 'react-icons/md'
import { IoFileTray } from 'react-icons/io5'
// 
import { 
  UploadContainer,
  UploadText,
  UploadMiddle, 
  UploadTextMiddle,
  Buttom,
  DropZoneContainer
} from '../../../widgets/shared-styles'
import useViewport from '../../../../hooks/useWindowSize'
// import { getAcronym } from '../../../../utils'
// import useValidations from '../../hooks/useInputValidations'
import useStage from '../../hooks/useStage'
// import loadable from '@loadable/component'
// import InputComponent from './input'
// import { getBody } from '../../utils'
// import { BackButtom, NextButtom } from './buttons'
// import LabelComponent from './labelComponent'
// import KycSkeleton from './skeleton'
// import isoType from './assets/isoType.png'
// import PersonalKyc from '../personalKycComponent/init'

import {
    Layout
  } from '../sharedStyles'

import { 
  MainContainer,
  Header
} from './styles'


// const DynamicLoadComponent = loadable(() => import('../../dynamicLoadComponent'))
const IdentityKycComponent = ({ handleDataForm, handleState }) => {

  const { isMovilViewport } = useViewport()
  const [ onDrag, setOnDrag ] = useState()
  const [ imgSrc ] = useState()
  
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
      // const data = e.target.files[0];
      // const file = await img_compressor(data, 0.25);
      // const dataBase64 = await readFile(file);
      // const isAnImage = includesAnyImageMime(dataBase64.split(",")[1])
      // if(!isAnImage){
        // return alert('Solo se aceptan imagenes')
      // }
      // setImgSrc(dataBase64);
      // actions.isAppLoading(true);
    }
  };

  const { dataForm } = handleDataForm
  const { 
    state, 
    // setState 
  } = handleState
  // const [ loading ] = useState(false)
//   // const validations = useValidations()

  const stageManager = useStage(
    // create the form stages
    Object.keys(dataForm?.handleError?.errors || dataForm.stages),
    dataForm.stages
  )

  const {
    // nextStage,
    // finalStage,
    stageData,
    // currentStage
  } = stageManager


// //   if(loading){return <KycSkeleton/>}
//   if(!loading && finalStage){
//     // Render success Stage
//       return <PersonalKyc/>
//   }
  // console.log('currentStage', currentStage)
  const { stages } = dataForm

  return( 
    <>
      <Layout className="_identityKycLayout">
        <MainContainer>
          <Header className="item_">
            <h1 className='fuente'>Verificación de identidad</h1>
            <h3 className='fuente subtitle'><FcOpenedFolder size={25} /> {stageData?.settings?.label || 'Sube tus documentos'}</h3>
          </Header>

          <Main className="item_" onDragOver={dragOver}>
            
            {
              !isMovilViewport &&
                <UploadComponent
                  goFileLoader={goFileLoader}
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
          />

          {
            isMovilViewport &&
              <MobileContralContainer>
                <CallToAction
                  handleAction={goFileLoader}
                />
              </MobileContralContainer>
          }
        </MainContainer>
      </Layout>
    </>
  )
}

export default IdentityKycComponent


const MobileContralContainer = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  align-items: center;
  place-content: center;
`

const StageListComponent = ({ stages, stageData, state }) => {

  console.log('StageListComponent', stages, stageData)
  console.log('List', Object.keys(stages))
  
  // AiOutlineFileImage
  return(
    <StageList className="item_">
      {
        Object.keys(stages).map((stageKey, index) => {

          const isCurrentEl = stageData?.key === stageKey
          const isCurrentElColor = stageData?.key === stageKey ? "var(--primary)" : "var(--paragraph_color)"
          const stageState = state[stageKey] ? 'complete' : 'incomplete'

          return(
            <StageListItemContainer key={index} className={`${isCurrentEl ? 'current' : ''} ${stageState}`}>
              <IconContainer >
                {/* <span>{getAcronym(stages[stageKey]?.key)}</span> */}
                <IoFileTray
                  size={18} 
                  color={isCurrentElColor}
                />
              </IconContainer>
              
              <p className={`fuente _title ${stageState}`}>{stages[stageKey]?.uiName}</p>
              {state[stageKey] && <p className="fuente2 _size">Size</p>}

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
    background: #0198ff54;
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
  
  &.current, &.complete:hover{
    background:#f1f1f1;
    opacity:1;
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
    font-size:13px;
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
            {props.title || "Arrastra el comprobante que quieres subir"}
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
              handleAction={props.goFileLoader}
            />
          </>
        }
    </UploadContainer>
  )

}

const CallToAction = props => {
  return(
      <Buttom>
        <input
          // id={idForFileUpload}
          type="file"
          accept="image/png,image/jpeg"
          onChange={props.handleAction}
        />
        <p style={{ color: "white", margin:"0" }} className="fuente">
          Subir comprobante
        </p>
      </Buttom>
  )
}



const Main = styled.div`
  background: #F9F9F9;
  border-radius: 5px;
  place-content:center;
  position:relative;
`



