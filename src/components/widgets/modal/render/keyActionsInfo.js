import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { keyAnimation, keyBoardAnimation, getOutAnimation, getOutAnimationKeyboard } from '../../animations'
// import IconSwitch from '../../icons/iconSwitch'
import { useActions } from '../../../../hooks/useActions'

import {
  BsArrowDown,
  BsArrowLeft,
  BsArrowRight,
  BsArrowUp
} from "react-icons/bs";


const KeyActionsInfo = ({ callback, isWithdraw2fa, cancelAction }) => {

  const [ state, setState ] = useState('')
  const actions = useActions()

  useEffect(()=>{
    setTimeout(()=>{
      setState('getOut')
    }, 4000)
    setTimeout(()=>{
      actions.renderModal(null)
    }, 6000)
  }, [])

  return (
      <Layout className={state}>
        <KeyBoardContainer state={state}/>
      </Layout>
  )
}

const KeyBoardContainer = ({ state }) => {
  return(
      <KeyBoard className={state}>
        <Key position="down"><BsArrowDown size={35}/></Key>
        <Key position="left" className="animated"> <BsArrowLeft size={35}/></Key>
        <Key position="right" className="animated"> <BsArrowRight size={35}/></Key>
        <Key position="up"><BsArrowUp size={35}/></Key>
      </KeyBoard>
  )
}

export default KeyActionsInfo

const KeyBoard = styled.div`
  margin: 40px;
  display: grid;
  align-self: end;
  grid-template-areas:
   "up up up"
   "left down right";
   width: 200px;
  justify-items: center;
  row-gap: 10px;
  column-gap: 10px;
  position: relative;
	-webkit-animation: ${keyBoardAnimation} 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: ${keyBoardAnimation} 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  &.getOut{
     -webkit-animation: ${getOutAnimationKeyboard} 0.7s ease-in both;
      animation: ${getOutAnimationKeyboard} 0.7s ease-in both;
  }
`

const Key = styled.div`
  grid-area: ${props => props.position || "down"};
  width: 65px;
  height: 65px;
  ${'' /* border: 2px solid #adadad; */}
  border-radius: 6px;
  background: white;
  border-top: 1px solid #cccccc;
  box-shadow: 0px 3px 0px 2px #cccccc;
  display: grid;
  justify-items:center;
  align-items: center;

  &.animated{
    -webkit-animation: ${keyAnimation} 1s infinite;
    animation: ${keyAnimation} 1s infinite;
  }

  svg{
    opacity: .6;
  }
`


const Layout = styled.div`

    &.getOut{
      animation: ${getOutAnimation} .5s forwards;
      animation-delay: 1s;
    }

    background: radial-gradient(at 0% bottom, black, transparent);
    margin: 0 auto;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    opacity: 1;
    z-index: 3;
    pointer-events: none;
    display: grid;

  `









//
