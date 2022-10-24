import styled from 'styled-components'
import { getCdnPath } from 'environment'

type props = {
    [key:string]:any
}
// iconPath={`${getCdnPath('assets')}prices-modal/ic_cop.svg`}
const DocumentViewer = (props:props) => {

    console.log('DocumentViewer', props)

    return(
        <DocumentViewerContainer>
            <img src={`${getCdnPath('assets')}kyc_identity/front.png`} alt="" />
        </DocumentViewerContainer>
    )
}

export default DocumentViewer

const DocumentViewerContainer = styled.div`
    width: auto; 
    height: auto;
    border: 1px solid red;
`
