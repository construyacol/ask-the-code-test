import React, { useEffect } from 'react'
import OtherModalLayout from '../modal/otherModalLayout'
import styled from 'styled-components'
import { useActions } from '../../../hooks/useActions'
import PricesModalContent from '../../PricesModalContent/prices-modal-content'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'
import { device } from '../../../const/const'
import useKeyActionAsClick from '../../../hooks/useKeyActionAsClick'


const PricesModal = () => {
  const actions = useActions()
  const [, state] = useCoinsendaServices();
  const currentPair = state.modelData.pairs.currentPair
  const pairs = state.modelData.pairs.local_collections

  const closeModal = (e) => {
    if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
      actions.renderModal(null)
    }
  }

  const idCloseModalButton = useKeyActionAsClick(true, 'close-prices-modal-button', 27, false, 'onkeyup', true)

  return(
    <OtherModalLayout on_click={closeModal}>
      <MainContainer>
        <CloseButton id={idCloseModalButton} onClick={() => closeModal()}><i className="far fa-times-circle"></i></CloseButton>
        <PricesModalContent changePair={actions.searchCurrentPairAction} currentPair={currentPair} pairs={pairs} />
      </MainContainer>
    </OtherModalLayout>
  )
}

const CloseButton = styled.div`
  cursor: pointer;
  border-radius: 50%;
  position: absolute;
  right: 1em;
  top: 1em;
  font-size: 2em;
  transition: all 500ms ease;
  color: #4a4a4a;
`

const MainContainer = styled.div`
  width: 90%;
  height: 90%;
  background: white;
  position: relative;
  border-radius: 6px;
  @media ${device.tabletL} {
    width: 100%;
    height: 100%;
    position: absolute;
  }
`

export default PricesModal
