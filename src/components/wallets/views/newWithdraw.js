import React, { useEffect } from 'react'
import WithdrawViewState from '../../hooks/withdrawStateHandle'
import { CriptoSupervisor } from './withdrawCripto'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'



import ControlButton from '../../widgets/buttons/controlButton'
import IconSwitch from '../../widgets/icons/iconSwitch'


const WithdrawView = () => {

  const [ { withdraws, current_wallet } ] = WithdrawViewState()
  const [ coinsendaServices ] = useCoinsendaServices()
  // console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| withdraws ===>', withdraws)

  useEffect(()=>{
    if(!withdraws){
      coinsendaServices.getWithdraws(current_wallet.id)
    }
  }, [])

  return(
    <>
    {
      current_wallet.currency_type === 'crypto' ?
      <CriptoSupervisor/>
      :
      <FiatView/>
    }
    </>
  )

}



const FiatView = props => {

  const [
    { active_trade_operation, current_wallet, loader, withdraw_accounts },
    { current_section_params, ToggleModal },
    dispatch
  ] = WithdrawViewState()

  // console.log('withdraw_accounts', withdraw_accounts)

  let movil_viewport = window.innerWidth < 768
  const atributos = {
    icon: 'withdraw2',
    size: movil_viewport ? 80 : 100,
    color: '#989898'
  }


  const handleSubmit = (e) => {
      dispatch(current_section_params({ currentFilter: 'withdraws' }))
      dispatch(ToggleModal())
  }

  return(
    <section className={`DepositView itemWalletView ${movil_viewport ? 'movil' : ''}`}>

      <div className="contIcontSwitch">
        <IconSwitch {...atributos} />
      </div>

      <div className="contIcontSwitchCont">
        {
          active_trade_operation ?
            <p className="fuente active_trade_operation">Operación de intercambio en proceso, una vez finalice podrás hacer retiros.</p>
            :
            <p className="fuente">Gestiona y realiza retiros en tu moneda local ({current_wallet.currency.currency}), desde coinsenda a tu cuenta bancaria.</p>
        }
      </div>


      <ControlButton
        loader={loader || Object.keys(withdraw_accounts).length === 0}
        formValidate={!active_trade_operation}
        label="Realizar un retiro"
        handleAction={handleSubmit}
      />

    </section>
  )

}


export default WithdrawView
