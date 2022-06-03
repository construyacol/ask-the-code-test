import styled from "styled-components";
import { device } from '../../../const/const'


export const BaseLayout = styled.div`
    row-gap:20px;
    @media ${device.desktop} {
        padding:0 30px;
        width: calc(100% - 60px);
    }
    @media ${device.mobile} {
        padding:0 20px;
        width: calc(100% - 40px);
    }
`

export const AppContainerLayout = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  overflow-y: scroll;
  position:relative;

    @media ${device.mobile} {
        grid-template-rows: auto auto 1fr;
        &.secondLayer{
            grid-template-rows: auto 1fr;
        }
    }
`

export const MainContent = styled.div`
    height: auto;
    position:relative;
    max-width: 1280px; 
    justify-self: center;
    width: calc(100% - 40px);
    display:flex;

    &.security{
        flex-direction: column;
    }

    @media ${device.desktop} {
        width: calc(100% - 60px);
    }

    @media ${device.mobile} {
        width: 100%;
        padding-bottom:50px;
    }
`

export const AccountDetailLayout = styled(BaseLayout)`
    display: grid;
    ${'' /* grid-template-rows: auto auto auto 1fr; */}
    grid-template-rows: minmax(80px, 80px) auto auto 1fr;
      row-gap: 15px;
    @media ${device.mobile} {
      row-gap: 15px;
    }
`

export const AccountDetailContainer = styled.div`
    display: grid;
    ${'' /* grid-template-rows: auto minmax(450px, 1fr); */}
    grid-template-rows: 1fr;
    align-items: center;
    row-gap: 30px;
    width: 100%;
    justify-self: center;
    max-width: 1000px;
    justify-items: center;
    padding-bottom:50px;

    @media ${device.mobile} {
        padding-bottom:0;
        row-gap: 10px;
    }
`

export const SecurityCenterLayout = styled(BaseLayout)`
    display: grid;
    grid-template-rows: auto 1fr;
`

export const ReferralLayout = styled(BaseLayout)`
    display: grid;
    grid-template-rows: auto 1fr;
`


export const AccountListWrapper = styled(BaseLayout)`
    height:auto;
    display: grid;
    grid-template-rows: auto 1fr;
    @media ${device.mobile} {
        grid-template-rows: auto auto 1fr;
        &.isEmpty{
          grid-template-rows: auto 1fr auto;
        }
    }
    

`

