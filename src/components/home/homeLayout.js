import React from 'react'
import './home.css'

const HomeLayout = (props) => {

  const { modal } = props
  // console.log('delete_wallet_confirmationdelete_wallet_confirmation---delete_wallet_confirmation', props.modalConfir)


  return(
    <section className={`HomeLayout ${modal ? 'conFirmationM' : ''}`}>
        {props.children}
    </section>
  )
}

export default HomeLayout
