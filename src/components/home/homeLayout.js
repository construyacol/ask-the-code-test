import React from 'react'
import './home.css'

const HomeLayout = (props) => {

  const { modal } = props

  return (
    <section className={`HomeLayout ${modal ? 'conFirmationM' : ''}`}>
      {props.children}
    </section>
  )
}

export default HomeLayout
