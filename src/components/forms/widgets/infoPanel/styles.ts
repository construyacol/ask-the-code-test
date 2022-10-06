import styled from 'styled-components'


export const IconCont = styled.div`

  width: 2.7rem;
  height: 2.7rem;
  border-radius: 50%;
  position: relative;
  display: flex;
  place-items: center;
  place-content: center;
  box-shadow: 3px 3px 7px -3px rgb(0 0 0 / 5%);
  border: 1px solid ${props => (props.color && props.theme.palette[props.color]) ? props.theme.palette[props.color] : props.color ? props.color : "#ededf3"};;
  svg{
    fill:${props => (props.color && props.theme.palette[props.color]) ? props.theme.palette[props.color] : props.color ? props.color : props.theme.palette.text_color};
  }

`

export const ItemRequirement = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;
    column-gap: 10px;
    cursor: pointer;

    &.isActive{
      position: relative;
      padding-right: 15px;
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
`

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  border-right: 3px solid #e9e9eb;
  position: relative;
  left: 2px;
`

export const ErrorMessage = styled.p`
font-size: 14px;
color: gray;
max-width: 250px;
`

export const InfoPanelContainer = styled.section`

  width: auto;
  min-width: 300px;
  padding: 0 0 0 50px;
  margin: 50px 0;
  height: auto;
  border-right: 1px solid ${props => props.theme.palette.secondary_background};
  
  .title{
    margin:"0 0 3em";
    font-size:"1.35rem";
    font-weight: "bold";
  }

  ul{
    padding-left: 20px;
    margin: 1rem 0;
    overflow: hidden;
    
    &.isSuccessfull{
      transition: .3s;
      height: 0;
      margin: 0;
    }

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

      &.checked{
        /* list-style-type: "✓"; */
        color: ${props => props.theme.palette.primary};
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
    
    }
  }

@media (max-width: 768px) {
 display:none;
}
`
