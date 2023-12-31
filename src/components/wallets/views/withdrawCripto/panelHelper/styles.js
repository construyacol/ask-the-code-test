import styled, { keyframes } from 'styled-components'
import { device } from 'const/const'


export const TotalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: var(--paragraph_color);
    padding-top: 20px;
    row-gap:7px;
  h1, p{
    margin:0;
  }
  h1{
    span{
      font-size: 20px;
    }
    font-size:30px;
    font-weight: 500;
  }
`

export const Button = styled.button`
  display: none;
  border-style: none;
  background: none;

  @media ${device.mobile}{
    top: 20px;
    left: 20px;
    align-items: center;
    display: flex;
    column-gap: 5px;
    font-size: 15px;
    color: var(--paragraph_color);
  }
`

export const DetailContainer = styled.div`
    display: grid;
    row-gap: 10px;
`

export const Pcontainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const GasLayout = styled.div`
    padding: 0;
    position: relative;
    height: auto;
    display: grid;
    p{
        margin:0;
    }

    &.open{
      row-gap:10px;
      .rangeCont{
        height: 50px;
      }
    }
`

export const PriorityItems = styled.div`
display: grid;
grid-template-columns: repeat(3, 1fr);
justify-items: center;
column-gap: 15px;
`

export const PriorityContainer = styled.div`
  display:grid;
  grid-template-rows: 80px auto;
  row-gap:20px;

p.description{
  font-size: 13px;
  padding: 7px;
  color: var(--paragraph_color);
}

.bold{
  font-weight: bold;
}

p{
  margin:0;
  color:var(--paragraph_color);
}
`

const largePriority = {
  high:"100%",
  medium:"60%",
  low:"25%",
}

export const SpeedBar = styled.div`
  background: var(--secondary_deg);
  position: relative;
  padding-left: 4px;
  overflow: hidden;
  border-radius: 4px;

  &::after,
  &::before{
    content: "";
    position:absolute;
    top: 0;
    left:0;
    height: 100%;
  }

  &::before{
    border-left: 3px solid ${props => props.color};
  }

  &::after{
    transition: 0.3s;
    opacity: .07;
    background: ${props => props.color};
    width: ${props => props.priority ? largePriority[props.priority] : '0%'};
  }
`

export const PriorityItem = styled.div`
  transition:.3s;
  border: 1px solid #d5d5d5;
  max-width: 125px;
  border-radius: 4px;
  display:grid;
  grid-template-rows:1fr auto auto;
  row-gap:5px;
  place-items: center;
  padding: 10px 0;
  /* height: calc(95% - 15px); */
  border: 1px solid transparent;
  transform:scale(.9);
  width: 100%;
  cursor:pointer;

  .speedBar{ opacity: 0 }
  
  &:hover{
    border: 1px solid ${props => props.color ? props.color : ''};
  }

  &.isActive{
    background: #ffffffd6;
    transform:scale(1);
    border: 1px solid ${props => props.color ? props.color : ''};
    transform: translateY(-1px);
    .speedBar{
      opacity: 1;
      &::after{
        background: ${props => props.color};
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
      }
    }
  }
  
  &>div{
    height: 45px;
    width: 45px;
    border-radius: 4px;
  }

  p{
    margin:0;
    font-size: 14px;
  }

  &.low .speedBar::after{
    width: 20%;
  }
  &.medium .speedBar::after{
    width: 50%;
  }
  &.high .speedBar::after{
    width: 100%;
  }

  .speedBar{
    height: 5px;
    width: 80%;
    background:#d1d1d1;
    position: relative;
    &::after{
      content:"";
      position: absolute;
      height: 100%;
      width: 20%;
    }
  }

`


export const ModalSpeedContainer = styled.div`
position: absolute;
top: 0;
width: 100%;
height: 100%;
left: 0;
z-index: 5;
/* backdrop-filter: blur(1px); */
`

export const approve = keyframes`
0% {
  opacity: 0;
  transform: translateY(0vh);
}
100%{
  opacity: 1;
  transform: translateY(-10vh);
}
`;


export const ModalSpeedPriority = styled.div`
width: 100%;
max-width: 450px;
height: auto;
background:white;
position:absolute;
bottom:0px;
left: 0;
right: 0;
margin: auto;
display:grid;
padding:20px;
border-radius: 6px;
backdrop-filter: blur(10px);
background: #ffffff61;


-webkit-box-shadow: 10px 10px 23px -21px rgba(0,0,0,0.25);
-moz-box-shadow: 10px 10px 23px -21px rgba(0,0,0,0.25);
box-shadow: 10px 10px 23px -21px rgba(0,0,0,0.25);
`


