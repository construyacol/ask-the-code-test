import { Wrapper as Layout } from '../../layout/styles'
import {
  MainContainer,
  TitleContainer,
  StickyGroup,
  LabelContainer,
  TitleLabelContainer,
  InputContainer,
  LabelText
} from '../styles'
import { InfoPanelContainer } from '../../infoPanel/styles'


const KycSkeleton = () => (
      <Layout className='infoPanel' style={{background:"white"}}>
        <InfoPanelContainer>
          
        </InfoPanelContainer>
        <MainKycSkeleton/>
      </Layout>
)

export default KycSkeleton

export const MainKycSkeleton = () => (
    <MainContainer>
      <TitleContainer className="skeleton">
        <h1 className="titleContainer__h1">This is a awesome title</h1>
      </TitleContainer>
      <StickyGroup background="white" id="stickyGroup__">
        <LabelSkeleton/>
        <InputSkeleton/>
      </StickyGroup>
    </MainContainer>
)

const LabelSkeleton = () => (
    <LabelContainer >
        <TitleLabelContainer className="skeleton">
            This is a awesome title label
        </TitleLabelContainer>
    </LabelContainer>
)

export const InputSkeleton = () => (
   <InputContainer className="skeleton">
    <input defaultValue="This is a awesome input" />
    <LabelText className="skeleton">This is a awesome label</LabelText>
   </InputContainer>
)