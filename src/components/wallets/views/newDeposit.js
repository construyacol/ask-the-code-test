import React, { useEffect, useState } from 'react'
import DepositViewState from '../../hooks/depositStateHandle'
import styled from 'styled-components'
import { OperationForm } from './withdrawCripto'
import QRCode from 'qrcode'
import { SentryCaptureException } from '../../../utils'
import IconSwitch from '../../widgets/icons/iconSwitch'
import CopyContainer from '../../widgets/copy/copyContainer'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'







const DepositView = () => {

  const [ { current_wallet } ] = DepositViewState()

  return(
    <>
      {
        current_wallet.currency_type === 'crypto' ?
        <CriptoSupervisor/>
        :
        <div>Fiat Deposit</div>
      }
    </>
  )

}

export default DepositView


export const CriptoSupervisor = props => {

  const [ { current_wallet, deposit_providers } ] = DepositViewState()
  // const [ { current_wallet, withdrawProviders } ] = WithdrawViewState()

  // console.log('|||||||||||||||||||||| CriptoSupervisor :: ', current_wallet, deposit_providers)

  return(
    <>
        {
          (!deposit_providers || Object.keys(deposit_providers).length === 0) ?
            <div>Loader view</div>
          :
          current_wallet.dep_prov.length < 1 ?
            <div>Agregar dirección</div>
          :
            <CriptoView/>
        }
    </>
  )
}


const CriptoView = () => {

  const [ { current_wallet, deposit_providers }, , dispatch ] = DepositViewState()

  const [ qrState, setQrState ] = useState(true)
  const [ qrError, setQrError ] = useState()
  const [ address, setAddress ] = useState()
  const [ coinsendaServices ] = useCoinsendaServices()


  useEffect(() => {

    if(deposit_providers){
        const validateAddress = async() => {
        const provider = deposit_providers[current_wallet.dep_prov[0]]
        const { account:{ account_id: { account_id } } } = provider

        const validateAddress = await coinsendaServices.validateAddress(account_id)
        if(!validateAddress){
          // sentry call emit error
          const errorMsg = `ADDRESS posiblemente vulnerada, review /wallets/views/deposit | dep_provider: ${provider.id}`
          SentryCaptureException(errorMsg)
          setQrError(true)
          return console.log(errorMsg)
        }

        setQrState(await QRCode.toDataURL(account_id)) //WALLET ADDRESS
        setAddress(account_id)
      }
      validateAddress()
   }

  }, [ deposit_providers ])


  return(
    <DepositForm>
      <section className="contAddress">
        <p id="soloAd2" className="fuente title soloAd2">Importante:</p>
        <p className="fuente soloAd">Envía solo {current_wallet.currency.currency} a esta Billetera. El envío de cualquier otra moneda a esta dirección puede resultar en la pérdida de su depósito. </p>

        <div className="qrContainer">
          <QrProtector visible={qrState} invalid={qrError}/>
          {
            (typeof qrState === 'string') &&
            <img id="qrDesposit" className="itemFuera" src={qrState} alt="" />
          }
        </div>
        <p className="fuente title dirDep">Dirección de deposito:</p>
        <div className="fuente address">
          <CopyContainer
            valueToCopy={qrError ? 'Dirección invalida, contacta con soporte' : qrState === true ? 'XXXXXX- Verificando dirección -XXXXXX' : address}
            color="black"
          />
        </div>
      </section>
    </DepositForm>
  )

}


  const QrProtector = ({ visible, invalid }) => (
    <div className={`qrProtector ${(visible === true) ? 'active' : ''} ${invalid ? 'error' : ''}`}>
      <IconSwitch
        icon="qr"
        size={35}
        color="black"
      />
    </div>
  )




const DepositForm = styled(OperationForm)`
    ${'' /* grid-template-rows: 50% 30% 1fr;
    grid-template-columns: 1fr !important; */}
`
























//
