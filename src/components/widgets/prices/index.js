import React from 'react'
import OtherModalLayout from '../modal/otherModalLayout'
import styled from 'styled-components'
import { useActions } from '../../../hooks/useActions'
import PricesModalContent from '../../PricesModalContent/prices-modal-content'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'
import { device } from '../../../const/const'


const PricesModal = () => {
  const actions = useActions()
  const [, state] = useCoinsendaServices();
  const currentPair = state.modelData.pairs.currentPair
  const pairs = state.modelData.pairs.all_collections

  const closeModal = () => {
    actions.renderModal(null)
  }

  return(
    <OtherModalLayout>
      <MainContainer onClick={closeModal}>
        <PricesModalContent currentPair={currentPair} pairs={pairs} />
      </MainContainer>
    </OtherModalLayout>
  )
}

const MainContainer = styled.div`
  width: 90%;
  height: 90%;
  background: white;
  @media ${device.tabletL} {
    width: 100%;
    height: 100%;
    position: absolute;
  }
`

export default PricesModal
