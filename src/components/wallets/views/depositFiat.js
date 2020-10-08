import React, { useEffect } from 'react'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'
import styled from 'styled-components'
import { OperationForm } from './withdrawCripto'
import IconSwitch from '../../widgets/icons/iconSwitch'
import ControlButton from '../../widgets/buttons/controlButton'
import useKeyActionAsClick from '../../../hooks/useKeyActionAsClick'

const DepositFiat = (props) => {

  const movil_viewport = window.innerWidth < 768
  const idForMainButton = useKeyActionAsClick(true, 'main-button-deposit', 13, true)
  const [,
    {
      current_wallet,
      ui: { current_section: { params } },
      modelData: { deposit_providers }
    },
    {
      toggleModal,
      FiatDeposit
    },
    dispatch
  ] = useCoinsendaServices()

  const atributos = {
    icon: 'deposit',
    size: movil_viewport ? 80 : 100,
    color: '#989898'
  }

  useEffect(() => {
    dispatch(FiatDeposit(current_wallet.currency.currency || 'usd'))
  }, [])

  const fiat_deposit = async (e) => {
    e.preventDefault()
    await dispatch(FiatDeposit(current_wallet.currency.currency || 'usd'))
    dispatch(toggleModal())
  }

  return (
    <DepositForm className="DepositView itemWalletView" onSubmit={fiat_deposit}>

      <div className="contIcontSwitch">
        <IconSwitch {...atributos} />
      </div>

      <div className="contIcontSwitchCont">
        {
          params.active_trade_operation ?
            <p className="fuente active_trade_operation">Operación de intercambio en proceso, una vez finalice podrás hacer depositos.</p>
            :
            <p className="fuente">La mejor manera de iniciar operaciones en coinsenda es realizando un deposito.</p>
        }
      </div>

      <ControlButton
        id={idForMainButton}
        loader={!deposit_providers}
        formValidate
        label="Realizar un deposito"
      />
    </DepositForm>
  )

}



const DepositForm = styled(OperationForm)`
  @media (max-width: 768px){
      height: calc(100% - 40px) !important;
      max-height: none !important;
    }
`

export default DepositFiat
