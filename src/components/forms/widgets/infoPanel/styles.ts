import styled from 'styled-components'
import { IconContainer } from 'styles/global'
import { device } from 'const/const'

export const InfoWrapper = styled.div`
  height: 50px;
  padding-bottom:35px;
  display:none;
  @media ${device.mobile} {
    display:grid;
  }

`

export const IconCont = styled(IconContainer)`
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 50%;
  position: relative;
  display: flex;
  place-items: center;
  place-content: center;
  box-shadow: 3px 3px 7px -3px rgb(0 0 0 / 5%);
  border: 1px solid ${props => (props.color && props.theme.palette[props.color]) ? props.theme.palette[props.color] : props.color ? props.color : "#ededf3"};;
`

export const ItemRequirement = styled.div`

    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;
    column-gap: 10px;
    cursor: pointer;
    position: relative;
    padding-right: 15px;

    &::after{
      content:"";
      width: 100%;
      height:100%;
      position: absolute;
      z-index: 1;
    }

    &.isSuccessfull{

      ::before{
        content: "Completado";
        width: fit-content;
        height: fit-content;
        position: absolute;
        left: 55px;
        top: -2px;
        font-family: "Raleway",sans-serif !important;
        background: #2bc48a1f;
        color: #219D6E;
        font-size: 11px;
        padding: 2px 7px;
        border-radius: 3px;
      }

      .titleSection{
        margin-bottom: 0;
      }

    }

    &.isActive{
      ::after{
          content:"";
          width: 3px;
          height: 100%;
          background: ${props => props.theme.palette.primary};
          position: absolute;
          right: -3px;
      }
    }
`


export const ItemRequirementContainer = styled.div`
  display: grid;
  row-gap: 10px;
  &.pending{
    opacity:0.4;
  }
`

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  border-right: 3px solid #e9e9eb;
  position: relative;
  left: 2px;
  height: fit-content;
`

export const ErrorMessage = styled.p`
font-size: 14px;
color: gray;
max-width: 250px;
`

export const InfoPanelContainer = styled.section`

  width: auto;
  min-width: 300px;
  padding: 0;
  margin: 0 0 50px;
  height: auto;
  border-right: 1px solid ${props => props.theme.palette.secondary_background};
  grid-template-rows: 1fr auto;
  display:grid;
  
  .title{
    margin:0 0 1em;
    font-size:1.35rem;
    font-weight:bold;
  }

  .ulItem{
    margin:10px 0;
    font-size:15px;
  }


  @media ${device.mobile} {
    display:none;
  }

`


export const Ul = styled.ul`
    padding-left: 20px;
    margin: 1rem 0;
    overflow: hidden;
    transition: .3s;
    margin:0;
    
    li{
      padding: 0;
      color: #50667a;
      list-style-type: "";
      list-style-position: inside;
      border-left: 2px solid #e9e9eb;
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      column-gap: 7px;
      padding-left: 15px;

      &.checked,
      &.rejected{
        position:relative;
        ::after{
          content: "";
          width: 2px;
          height: 100%;
          background: ${props => props.theme.palette.primary};
          top: 0;
          left: -2px;
          position: absolute;
        }
      }

      &.rejected{
        ::after{
          background: red;
        }
      }

      &.inProgress{
        ::before{
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-left: 5px solid red;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
        }
      }
    }
`