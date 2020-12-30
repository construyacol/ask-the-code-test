import React from 'react'
import styled from 'styled-components'
import { OnlySkeletonAnimation } from '../widgets/loaders/skeleton'

const WithdrawAccountFlowSkeleton = props => {

  return(
    <Container className="skeleton">
      <SkeletonContainer>
        <TitleContainer>
          <Icon/>
          <TittleText/>
        </TitleContainer>
        <TextContent>
          <span> Al añadir una cuenta bancaria para realizar tus retiros de pesos colombianos (COP) </span>
          <span> por primera vez, tarda en promedio 2 horas habiles a partir de su inscripción, para </span>
          <span> que esta sea aprobada por la entidad bancaria, una vez tu cuenta haya sido</span>
          <span> aprobada, tus retiros serán casi inmediatos</span>
        </TextContent>
        <Button/>
      </SkeletonContainer>
    </Container>
  )

}

export default WithdrawAccountFlowSkeleton

const Button = styled.div`
  width: 190px;
  height: 56px;
  border-radius: 4px;
  background: #bfbfbf;
  justify-self:center;
  align-self: center;
`


const TextContent = styled.p`
  margin: 0;
  justify-self: center;
  align-self: center;
  max-width: 600px;
  text-align: center;
  line-height: 25px;

`

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  justify-items: center;
  &.skeleton{
    ${OnlySkeletonAnimation}
  }
`

const TittleText = styled.p`
  margin: 0;
  justify-self: center;
  align-self: center;
  font-size: 30px;
  &::after{
    content: "Genial userName &"
  }
    background: #bfbfbf;
    color: #bfbfbf;
    border-radius: 3px;
`

const Icon = styled.div`
  height: 70px;
  width: 70px;
  background: #bfbfbf;
  border-radius: 6px;
  justify-self:center;
  align-self: center;
`

const TitleContainer = styled.div`
  display: grid;
`

const SkeletonContainer = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
  grid-template-rows: 25vh 1fr 15vh !important;
  grid-row-gap: 10px;

  span{
    background: #bfbfbf;
    color: #bfbfbf;
    border-radius: 3px;
  }

`
