import React from 'react'
import styled from 'styled-components'
import { OnlySkeletonAnimation } from '../../../widgets/loaders/skeleton'

const DWFiatFlowSkeleton = props => {

  return(
    <SkeletonContainer className="skeleton">
      <ViewAmountContainer>
        <TitleContainer>
          <p>__I want operate__</p>
          <p>_ Amount of _:</p>
        </TitleContainer>
        <AmountContainer>
          <Icon/>
          <Amount><p>Type the amount to operation</p></Amount>
          <Panel>
            <Minimum/>
            <LocalCurrency/>
          </Panel>
        </AmountContainer>
      </ViewAmountContainer>
    </SkeletonContainer>
  )

}

export default DWFiatFlowSkeleton

const LocalCurrency = styled.p`
  text-align: center;
  margin: 0;
  font-size: 20px;
  color: #50667a;
  font-weight: 400;
  height: 20px;
  justify-self:center;
  &::after{
    content: "Local currency"
  }
`

const Minimum = styled.p`
  transition: 0.3s;
  text-align: right !important;
  font-size: 16px;
  align-self: flex-start;
  cursor: pointer;
  margin: 0;
  justify-self:end;
  &::after{
    content: "Minimun amount"
  }
`

const Panel = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 15px;
  height: 100%;
  width: 100%;
`

const Amount = styled.div`
  height: 100px;
  justify-self:center;
  width: 100vw;
  max-width: 600px;
  display: grid;
  align-items: center;
  text-align: center;
  border-bottom: 1px solid #bfbfbf;
  p{
    justify-self:center;
  }

`

const Icon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 6px;
  background: #bfbfbf;;
`

const Containers = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
`

const AmountContainer = styled(Containers)`
  grid-template-rows: 30% 1fr 1fr !important;
  min-height: 300px;
  height: 100%;
  width: 100%;
`

const TitleContainer = styled(Containers)`
  grid-template-rows: repeat(2, 1fr);
`



const ViewAmountContainer = styled.div`
  display: grid;
  height: 100%;
  justify-items: center;
  align-items: center;
  grid-template-rows: 15vh 1fr 15vh !important;
  grid-row-gap: 10px;

  p{
    background: #bfbfbf;
    color: #bfbfbf;
    width: fit-content;
    border-radius: 3px;
  }
`

const SkeletonContainer = styled.section`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  justify-items: center;
  &.skeleton{
    ${OnlySkeletonAnimation}
  }
`
