import React from 'react'
import OtherModalLayout from '../modal/otherModalLayout'
import styled from 'styled-components'
import { useActions } from '../../../hooks/useActions'


const PricesModal = () => {

  const actions = useActions()

  const closeModal = () => {
    actions.renderModal(null)
  }

  return(
    <OtherModalLayout>
      <div style={{width:"90%", height:"90%", background:"white"}} onClick={closeModal}>

      </div>
    </OtherModalLayout>
  )
}

export default PricesModal
