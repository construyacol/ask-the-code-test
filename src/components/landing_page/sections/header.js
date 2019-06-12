import React from 'react'
import MenuSuperiorContainer from '../../menuSuperior/menuSuperiorContainer'
import WordlView from './worldRotation'
import '../css/header.css'

const HeaderLanding = props => {

  return(
    <section className="HeaderLanding">

      <WordlView></WordlView>

      <div id="Headers">
        <span className="first"></span>
        <span className="second"></span>
        <span className="third"></span>
        <span className="four"></span>
        <span className="five"></span>
      </div>
      <MenuSuperiorContainer transparent={true} logo={true}></MenuSuperiorContainer>
      {props.children}
    </section>
  )

}

export default HeaderLanding
