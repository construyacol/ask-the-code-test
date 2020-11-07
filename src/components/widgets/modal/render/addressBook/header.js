import React from 'react'
import { MdKeyboardArrowLeft } from "react-icons/md"
import styled from 'styled-components'
import backImg from '../../../../../assets/map.png'
import useKeyActionAsClick from '../../../../../hooks/useKeyActionAsClick'
import { IconBackContainer } from '../../../shared-styles' 



const HeaderComponent = ({ provider_type, view, switchView }) => {

  const idForBack = useKeyActionAsClick(true, 'back-step-ca', 8, true, 'onkeyup', true)


  const getTittle = view => {
    switch (view) {
      case 'newAccount':
        return `Creando nueva cuenta`
      default:
        return `Agenda ${provider_type}`
    }
  }

  const goBack = () => {
    return switchView('addressList')
  }

  return(
    <Header>
      <section>
        <WindowControl id={idForBack} state={`${view === 'addressList' ? 'close' : 'open'}`} onClick={goBack}>
          <IconBackContainer>
            <MdKeyboardArrowLeft size={27} color="white"/>
          </IconBackContainer>
        </WindowControl>
        <p className="fuente titleHead">{getTittle(view)}</p>
      </section>
    </Header>
  )
}

export default HeaderComponent




const WindowControl = styled.div`
  overflow: hidden;
  width: 0;
  transition: .2s;
  width: ${props => props.state === 'open' ? '45px' : '0px'};
  opacity: ${props => props.state === 'open' ? '1' : '0'};
  cursor:pointer;

`

const Header = styled.div`

  width: 97%;
  height: 100%;
  justify-self: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  position: relative;
  display: grid;
  align-items: center;

  section{
    display: flex;
    align-items: center;
    margin:0 0 0 15px;
  }

  p{
    font-size: 22px;
    color: white;
    font-weight: bold;
  }

  p.appear{
    opacity: 1;
  }

  p.disappear{
    opacity: 0;
  }

  background-image: url(${backImg});
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-attachment: fixed;
`
