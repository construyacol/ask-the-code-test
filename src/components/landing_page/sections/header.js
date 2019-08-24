import React from 'react'
import WordlView from './worldRotation'

import '../css/header.css'

const HeaderLanding = props => {

  return(
    <section className="HeaderLanding" >
      {
        window.innerWidth>768 &&
        <WordlView/>
      }

      <div id="Headers">
        <span className="header_first"></span>
        <span className="header_second"></span>
        <span className="header_third"></span>
        <span className="header_four"></span>
        <span className="header_five"></span>
      </div>
      {props.children}

    </section>
  )

}

export default HeaderLanding
