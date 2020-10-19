import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import styled from 'styled-components'
// import { InputButton } from './buttons'
import SimpleLoader from '../loaders'
import { LoaderContainer } from '../loaders'

export const KeyActionComponent = ({ action, isFiat, currentWallet }) => {
  const isModalVisible = useSelector(state => state.form.isModalVisible)
  const route = useHistory()

  useEffect(() => {
    if (!window.onkeydown) {
      window.onkeydown = (event) => {
        if(!route.location.pathname.includes(currentWallet.id)) return
        if (!isModalVisible && event.keyCode === 13 && !event.srcElement.tagName.includes('INPUT')) {
          if(!isFiat) return
          if (['activity', 'swap'].some(item => window.location.href.includes(item))) return
          action(event)
        }
      }
    }
  }, [window.onkeydown, isModalVisible, route, currentWallet])

  return (<div style={{ width: 0, height: 0, opacity: 0 }} />)
}

const ControlButton = ({ loader, formValidate, label, handleAction, id }) => {
  return (
    <ControlsContainer id="controlsContainer" className={`${loader ? 'loader' : ''}`}>
      {
        loader &&
        <LoaderContainer>
          <SimpleLoader loader={2} />
        </LoaderContainer>
      }
      <InputButton
        label={label}
        type="primary"
        id={id}
        active={formValidate}
        handleAction={(e) => {
          e.currentTarget.blur()
          handleAction && handleAction()
        }}
      />
    </ControlsContainer>
  )
}


export const InputButton = (props) => {
  // Este es el cta por default
  //clase large => "width:200px !important"

  return (
    <InputButtonCont>
      {
        props.active ?
          <input id={props.id} className={`botonForm ${props.type} fuente `} type="submit" value={props.label} onClick={props.handleAction} />
          :
          // <div className="botonForm desactivado fuente" style={{width:props.ancho}}  >
          <DisabledButton>
            {props.label}
          </DisabledButton>
      }
    </InputButtonCont>
  )
}





const InputButtonCont = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  .botonForm{
    width: 100% !important;
  }
`

const BotonForm = styled.div`
  max-width: 300px;
  width: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  border-style: none !important;
  font-size: 17px !important;
  padding: 18px 0px;
  -webkit-transition: .2s;
  transition: .2s;
`

const DisabledButton = styled(BotonForm)`
  background: #8080807d;
  color: white;
  opacity: 0.4;
`

const ControlsContainer = styled.div`
    display: grid;
    justify-items: center;
    width: 100%;
    height: 56px;
    position: relative;
    max-width: 300px;
    justify-self: center;
    align-self: center;

  &.loader::after{
  	content: '';
  	background: rgb(255, 255, 255, .8);
  	width: 100%;
  	height: 100%;
  	position: absolute;
  }
`




export default ControlButton
