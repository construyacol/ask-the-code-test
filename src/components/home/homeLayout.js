import React from 'react'
import './home.css'
import { useSelector } from 'react-redux'

const HomeLayout = (props) => {
  const { form, ui } = useSelector(state => state)
  const isSomeModalRendered = form.isModalVisible || ui.modal_confirmation.visible || ui.otherModal || ui.modal.render

  return (
    <div className={`HomeLayout ${isSomeModalRendered ? 'conFirmationM' : ''}`}>
      {props.children}
    </div>
  )
}

export default HomeLayout
