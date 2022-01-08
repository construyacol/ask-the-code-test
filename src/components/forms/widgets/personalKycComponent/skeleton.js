import Layout from '../layout'
import {
  MainContainer,
  TitleContainer,
  StickyGroup,
  LabelContainer,
  TitleLabelContainer,
  InputContainer,
  LabelText,
} from './styles.js'


const KycSkeleton = () => (
      <Layout background="white">
        <MainContainer>
          <TitleContainer className="skeleton">
            <h1 className="titleContainer__h1">This is a awesome title</h1>
          </TitleContainer>
          <StickyGroup background="white" id="stickyGroup__">
           <LabelSkeleton/>
           <InputSkeleton/>
          </StickyGroup>
        </MainContainer>
      </Layout>
)

export default KycSkeleton

const LabelSkeleton = () => (
    <LabelContainer >
        <TitleLabelContainer className="skeleton">
            This is a awesome title label
        </TitleLabelContainer>
    </LabelContainer>
)

const InputSkeleton = () => (
   <InputContainer className="skeleton">
    <input defaultValue="This is a awesome input" />
    <LabelText className="skeleton">This is a awesome label</LabelText>
   </InputContainer>
)