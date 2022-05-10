import styled, { keyframes } from 'styled-components'
import { PRIMARY_COLOR } from '../../const'


const IconButtonContainer = styled.div`
  display:grid;
  align-items:center;
  height:100%;
  cursor:pointer;
  width: ${props => props.disabled ? '0px' : (props.width || 'auto')};
  margin-right:${props => props.disabled ? '0' : '7px'};
  overflow: hidden;

  &::after{
    content:'';
    position:absolute;
    width:100%;
    height:100%;
  }
`


export const IconBackContainer = styled(IconButtonContainer)`
  position:relative;
`

export const IconNextContainer = styled(IconButtonContainer)`
  position:absolute;
  right:0;
  align-self:center;
  justify-items:center;
  z-index:1;
  svg{
    stroke-width: 3;
  }
`

export const ButtonModule = styled.div `
  width:auto;
  transition:.3s;
`

export const Button = styled.button`
  cursor:pointer;
`

export const LabelContainer = styled.div`
  font-size: 20px;
  margin-bottom: 0px;
  position:relative;
  display:flex;
  color: var(--paragraph_color);
`

export const StickyGroup = styled.div`
  display: grid;
  padding: 0 10px;
  top: 0px;
  background:${props => props.background ? props.background : 'transparent'};
  height: fit-content;
  align-self: center;

  h1{
    position: absolute;
    top: 0;
  }

`

export const TitleContainer = styled.div`
  width: 100%;
  max-height: 150px;
  display: grid;
  grid-template-columns:1fr;
  grid-template-rows: 1fr;
  .titleContainer__h1{
    margin: 50px 0 80px;
    text-align: center;
    font-size: 35px;
    color: var(--title1);
    font-weight: 400;
  }

  &.skeleton h1{
    background:#d1d4d7;
    width: fit-content;
    height: fit-content;
    color: transparent;
    border-radius: 4px;
    justify-self: center;
  }
`
export const skeletonAnimation = keyframes`
  0% {
    opacity: 1;
  }

  50%{
    opacity: .5;
  }

  100% {
    opacity: 1;
  }
`;


export const MainContainer = styled.div`
  display: grid;
  max-width: 650px;
  width: 100%;
  justify-self:center;
  align-self: center;
  grid-template-rows: auto 1fr auto;
  height: 100%;

  .skeleton{
    animation: ${skeletonAnimation} .7s linear infinite;
  }

`

export const Header = styled.div`
  grid-column: 1/3;
  row-gap:35px;
  h1, h3{
    text-align:left;
  }
  .subtitle{
    margin-top:0;
    font-size: 1.1rem;
  }
  h1{
    color:var(--title1);
    margin-top:0;
  }
  h3{
    color:var(--paragraph_color);
    display:flex;
    align-items:center;
    column-gap:10px;
  }
`


export const FilesContainer = styled.div`
    display:grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: minmax(400px, 1fr) minmax(250px, 400px);
    padding: 2.5rem 1.5rem;
    max-width: 1480px;
    justify-self: center;
    width: calc(100vw - 3rem);
    row-gap:10px;
    column-gap:25px;
    height: calc(100vh - 5rem);

    .item_{
        display:grid;
    }

    @media screen and (max-width: 768px){
        grid-template-columns: 1fr;
        grid-template-rows: auto auto 1fr;
        padding: 2.5rem 1rem 1rem;
        height: calc(100vh - 3.5rem);
        width: calc(100vw - 2rem);

        ${Header}{
            grid-column:auto;
            h1{
                font-size:26px;
            }
        }
    }   

`


export const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;
`

export const Layout = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  width: 500px;
  height: 200px;
  margin: auto;
  margin-top: 50px;
  display: grid;
  grid-template-columns: auto 1fr;
`

export const LabelText = styled.p`
  position: absolute;
  bottom: -30px;
  margin: 0;
  font-size: 14px;
  color: var(--paragraph_color);

  &.skeleton{
    background:#d1d4d7;
    width: fit-content;
    height: fit-content;
    color: transparent;
    border-radius: 4px;
  }

  @media (max-width: 400px) {
    &.label___message{
      bottom: -45px !important;
      display:grid;
      Padding-right: 30px;
    }
  }
`

export const PrefixContainer = styled.div`
  height: 100%;
  width: auto;
`

export const InputContainer = styled.form`
  margin:15px 0 60px;
  width: 100%;
  height: 63px;
  border: 1px solid ${props => props.inputStatus === 'success' ? PRIMARY_COLOR : 'rgba(80,102,122,.38)'};
  border-radius: 6px;
  display: grid;
  position: relative;
  background: white;
  padding: 1px;
  transition:.01s;

  &._progress_bar{
    grid-template-rows:1fr auto;
  }

  input{
    border-color: transparent;
    outline: none;
    padding: 0 10px;
    font-size: 19px;
    width:calc(97% - 20px);
    &.success{
      color: #005000;
    }
  }

  input[name="birthday"].date_success{
    padding: 0 25px 0 10px;
    width: calc(97% - 35px);
    transition: .15s;
  }


  &.skeleton {
    align-items: center;
    input{
      background:#d1d4d7;
      width: fit-content;
      height: 17px;
      color: transparent;
      border-radius: 4px;
      justify-align:center;
      margin-left:20px;
    }
  }
  
`




export const Titles = styled.div`
  width:90%;
  height:${props => props.height ? `${props.height*100}%` : '100%'};
  display:grid;
  grid-template-rows:repeat(auto-fill, 1fr);
  position:relative;
  transition:.3s;
  top:${props => props.position ? `-${props.position*100}%` : '0%'};


  p{
    margin:0;
    display:flex;
    align-items:center;
    width: max-content;
  }

`

export const TitleLabelContainer = styled.div`
  width:100%;
  height:35px;
  display:flex;
  overflow:hidden;
  position:relative;

  &::after{
    content:'';
    pointer-events: none;
    height:10px;
    width:100%;
    position:absolute;
    z-index:2;
    background: rgb(255,255,255);
    background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
  }

  &::before{
    content:'';
    pointer-events: none;
    background:red;
    height:10px;
    width:100%;
    position:absolute;
    bottom:0;
    z-index:2;
    background: rgb(255,255,255);
    background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
  }


  &.skeleton{
    background:#d1d4d7;
    width: fit-content;
    height: 27px;
    color: transparent;
    border-radius: 4px;
    &::before, &::after{
      content:none;
    }
  }
`