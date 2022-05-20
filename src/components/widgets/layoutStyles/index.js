import styled from "styled-components";
import { device } from '../../../const/const'


export const BaseLayout = styled.div`
    row-gap:20px;
    @media ${device.desktop} {
        padding:0 30px;
        width: calc(100% - 60px);
    }
    @media ${device.mobile} {
        padding:0 15px;
        width: calc(100% - 30px);
    }
`

export const AppContainerLayout = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  overflow-y: scroll;
  position:relative;
`

export const MainContent = styled.div`
    height: auto;
    position:relative;
    max-width: 1440px; 
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
        width: calc(100% - 30px);
        padding-bottom:50px;
    }
`

export const AccountDetailLayout = styled(BaseLayout)`
    display: grid;
    grid-template-rows: auto 1fr;
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
    

`

