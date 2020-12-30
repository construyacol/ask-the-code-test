import React from 'react'
import styled from 'styled-components'
import InputForm from "../../widgets/inputs/inputForm";
import { OnlySkeletonAnimation } from '../../widgets/loaders/skeleton'



const NewWalletSkeleton = () => {
  return(
      <Container>
        <H1 className="skeleton">Nueva Billetera</H1>
        <FormContainer>
          <InputForm skeleton />
          <InputForm skeleton />
          <OptionsContainer className="skeleton">
            <Option/>
            <Option/>
          </OptionsContainer>
        </FormContainer>
      </Container>
  )
}

export default NewWalletSkeleton


const Option = styled.div`
  height: 142px;
  width: 172px;
  border: 1px solid #bfbfbf;
  position: relative;
  border-radius: 6px;
  display: grid;

  &::after{
    position: absolute;
    content: "";
    width: 50px;
    height: 45px;
    background: #bfbfbf;
    align-self: center;
    justify-self: center;
    border-radius: 5px;
    margin-bottom: 40px;
  }

  &::before{
    position: absolute;
    content: "";
    width: 100px;
    height: 15px;
    background: #bfbfbf;
    border-radius: 3px;
    justify-self: center;
    align-self:flex-end;
    margin-bottom: 15px;
  }
`

const OptionsContainer = styled.div`
  display: grid;
  height: auto;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2 1fr);
  padding: 15px;
  grid-gap: 20px;
  justify-items: center;
  &.skeleton{
    ${OnlySkeletonAnimation}
  }
`


const FormContainer = styled.div`
  height: auto;
  width: 450px;
  align-self: baseline;
  display: grid;
  grid-template-rows: 15vh 1fr 15vh;
  grid-row-gap: 10px;
`

const H1 = styled.h1`
  background: #bfbfbf;
  color: #bfbfbf;
  border-radius: 4px;
  &.skeleton{
    ${OnlySkeletonAnimation}
  }
`

const Container = styled.section`
  width: 100%;
  height: calc(100vh - 80px);
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
  display: grid;
  grid-template-rows: auto 1fr;
`
