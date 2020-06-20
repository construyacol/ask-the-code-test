import React, { Fragment } from 'react'
import styled from 'styled-components'
import './loader.css'

export const SimpleLoader = (props) => {
  const { label, color, grid, loader, justify } = props
  return(
    <Fragment>
      {
        !loader ?
        <div className={`SimpleLoader ${grid === 'Msuperior' ? 'Msuperior' : 'grillaComun'}`}>
          <div className="lds-ellipsis">
            <div className={`${color === 'white' ? 'blanquito' : color === 'green' ? 'verdecito' : 'azulito' }`}></div>
            <div className={`${color === 'white' ? 'blanquito' : color === 'green' ? 'verdecito' : 'azulito' }`}></div>
            <div className={`${color === 'white' ? 'blanquito' : color === 'green' ? 'verdecito' : 'azulito' }`}></div>
            <div className={`${color === 'white' ? 'blanquito' : color === 'green' ? 'verdecito' : 'azulito' }`}></div>
          </div>
          {
            label &&
            <p className={`fuente simpleType ${color === 'white' ? 'blanquitoText' : 'azulitoText'}`} >{label}</p>
          }
        </div>
        :
        loader === 2 &&
          <RollerLoader
            justify={justify}
            color={color}
            className="lds-roller"
            >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </RollerLoader>
      }
    </Fragment>
  )
}

export default SimpleLoader

const RollerLoader = styled.div`
  display: inline-block;
  position: absolute;
  width: 64px;
  height: 64px;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  justify-self: ${props => props.justify || 'end'};
  align-self: center;

  &.lds-roller div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 32px 32px;
  }
  &.lds-roller div:after {
    content: " ";
    display: block;
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.color || '#ff8660'} ;
    margin: -3px 0 0 -3px;
  }
  &.lds-roller div:nth-child(1) {
    animation-delay: -0.036s;
  }
  &.lds-roller div:nth-child(1):after {
    top: 50px;
    left: 50px;
  }
  &.lds-roller div:nth-child(2) {
    animation-delay: -0.072s;
  }
  &.lds-roller div:nth-child(2):after {
    top: 54px;
    left: 45px;
  }
  &.lds-roller div:nth-child(3) {
    animation-delay: -0.108s;
  }
  &.lds-roller div:nth-child(3):after {
    top: 57px;
    left: 39px;
  }
  &.lds-roller div:nth-child(4) {
    animation-delay: -0.144s;
  }
  &.lds-roller div:nth-child(4):after {
    top: 58px;
    left: 32px;
  }
  &.lds-roller div:nth-child(5) {
    animation-delay: -0.18s;
  }
  &.lds-roller div:nth-child(5):after {
    top: 57px;
    left: 25px;
  }
  &.lds-roller div:nth-child(6) {
    animation-delay: -0.216s;
  }
  &.lds-roller div:nth-child(6):after {
    top: 54px;
    left: 19px;
  }
  &.lds-roller div:nth-child(7) {
    animation-delay: -0.252s;
  }
  &.lds-roller div:nth-child(7):after {
    top: 50px;
    left: 14px;
  }
  &.lds-roller div:nth-child(8) {
    animation-delay: -0.288s;
  }
  &.lds-roller div:nth-child(8):after {
    top: 45px;
    left: 10px;
  }
  @keyframes lds-roller {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

`

export const LoaderContainer = styled.div`
  position: absolute;
  justify-self: center;
  /* background: red; */
  width: 100%;
  height: 100%;
  display: grid;
  max-width: 300px;
  z-index: 3;

  .lds-roller{
    justify-self: center !important;
    z-index: 1;
  }

  .lds-roller div:after {
    background: #014c7d;
}
`
