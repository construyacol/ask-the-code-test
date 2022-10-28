import { getCdnPath } from 'environment'
import { DOCUMENT_IMAGE_CDN_PATH } from 'const/kycDocumentsReference'
import Button from 'components/widgets/buttons/button'
import { 
    DocumentViewerContainer,
    DoubleSidedElement,
    FrontElement,
    BackElement,
    DocumentManagerContainer,
    CtaCont
} from './styles'
import { P } from 'components/widgets/typography'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


type props = {
  [key:string]:any
}

const DocumentViewer = (props:props) => {
    return(
        <DocumentViewerContainer>
            <ViewerComponent {...props}/>
        </DocumentViewerContainer>
    )
}

export default DocumentViewer

const ViewerComponent = ({ stageManager, currentIdentity }:props) => {

    const { stageData } = stageManager
    const idType = currentIdentity?.id_type || 'cedula_ciudadania'

    return(
        <DoubleSidedElement className={`${idType} ${stageData?.key}`}>
            <FrontElement>
                    <img src={`${getCdnPath('assets')}${DOCUMENT_IMAGE_CDN_PATH[idType]?.id_front}`} alt="id_front"/>
                    <img src={`${getCdnPath('assets')}${DOCUMENT_IMAGE_CDN_PATH[idType]?.selfie}`} alt="selfie"/>
            </FrontElement>
            <BackElement>
                <img src={`${getCdnPath('assets')}${DOCUMENT_IMAGE_CDN_PATH[idType]?.id_back}`} alt="id_back"/>
            </BackElement>
        </DoubleSidedElement>
    )
}

export const DocumentManager = ({ stageData, state, setState, handleStage }:props) => {

    const deleteDocumentState = () => {
        setState((prevState:object) => {
            const newState = {...prevState, [stageData?.key]:null}
            const targetStage = Object.keys(newState).find(element => !newState[element])
            handleStage(targetStage)
            return newState
        })
    }

    return(
        <DocumentManagerContainer>
            <Zoom>
                <img src={state[stageData?.key]?.img} width="100%" alt="" />
                {/* <img src={state[stageData?.key]?.img} alt="ss" /> */}
            </Zoom>
            <CtaCont className="kycDeleteButton">
                <Button
                    variant='contained'
                    color='red'
                    onClick={deleteDocumentState}
                >
                    <P>Eliminar documento</P>
                </Button>
            </CtaCont>
        </DocumentManagerContainer>
    )   

}

