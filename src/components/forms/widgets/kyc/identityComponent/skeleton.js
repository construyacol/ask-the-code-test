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
import { InputWrapper } from '../InputComponent'
import { InfoPanelSkeleton } from '../../infoPanel'
import { H2 } from 'components/widgets/typography'


const KycSkeleton = () => (
    <Layout style={{background:"white"}}>
      <Layout className='infoPanel' style={{background:"transparent", left:"auto"}}>
        <InfoPanelSkeleton/>
        <MainKycSkeleton/>
      </Layout>
    </Layout>
)

export default KycSkeleton

export const MainKycSkeleton = () => (
    <MainContainer>
      <TitleContainer className="skeleton">
        <H2 className="titleContainer__h1 fuente align-left" skeleton>This is a awesome title</H2>
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
  <InputWrapper>
    <InputContainer className="skeleton">
      <input defaultValue="This is a awesome input" />
    </InputContainer>
    <LabelText className="skeleton">This is a awesome label</LabelText>
  </InputWrapper>
)