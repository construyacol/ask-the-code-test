import React from 'react'
import OtherModalLayout from '../modal/otherModalLayout'
import styled from 'styled-components'
import { useActions } from '../../../hooks/useActions'
import PricesModalContent from '../../PricesModalContent/prices-modal-content'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'


const PricesModal = () => {
  const actions = useActions()
  const [, state] = useCoinsendaServices();
  const currentPair = state.modelData.pairs.currentPair
  const pairs = state.modelData.pairs.all_collections

  const closeModal = () => {
    //actions.renderModal(null)
  }

  return(
    <OtherModalLayout>
      <div style={{width:"90%", height:"90%", background:"white"}} onClick={closeModal}>
        <PricesModalContent currentPair={currentPair} pairs={pairs} />
      </div>
    </OtherModalLayout>
  )
}

export default PricesModal
