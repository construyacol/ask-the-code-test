import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { OperationForm } from './withdrawCripto'
import QRCode from 'qrcode'
import { SentryCaptureException } from '../../../utils'
import IconSwitch from '../../widgets/icons/iconSwitch'
import CopyContainer from '../../widgets/copy/copyContainer'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'
import ControlButton from '../../widgets/buttons/controlButton'
import { skeleton } from '../../widgets/loaders/skeleton'




const CriptoSupervisor = props => {

  const [ , { current_wallet, modelData: { deposit_providers } } ] = useCoinsendaServices()

  return(
    <>
        {
          (!deposit_providers || Object.keys(deposit_providers).length === 0) ?
            <LoaderView/>
          :
          current_wallet.dep_prov.length < 1 ?
            <AddDepositProviderCripto/>
          :
            <CriptoView/>
        }
    </>
  )
}

const LoaderView = () => {

  return(
    <DepositForm className="skeleton">
      <section className="contAddress">
        <p id="soloAd2" className="fuente title soloAd2"></p>
        <p className="fuente soloAd"></p>
        <div className="qrContainer">
          {/* <QrProtector visible/> */}
        </div>
        <p className="fuente title dirDep"></p>
        <p className="verifyAddress"></p>
      </section>
    </DepositForm>
  )

}


const AddDepositProviderCripto = () => {

    const [
      coinsendaServices,
      {
        current_wallet,
        isLoading:{ loader }
      },
      {
        isAppLoading,
        create_deposit_provider,
        get_deposit_providers,
        update_item_state,
        current_section_params
      },
      dispatch
     ] = useCoinsendaServices()


  const movil_viewport = window.innerWidth < 768


  const atributos = {
    icon: 'deposit_crypto',
    size: movil_viewport ? 80 : 100,
    color:'#989898'
  }

  const createDepositProvider = async(e) => {
    e.preventDefault()
    dispatch(isAppLoading(true))
    const dep_prov = await coinsendaServices.createAndInsertDepositProvider(current_wallet)
    dispatch(isAppLoading(false))
  }

  return(
    <DepositForm className="DepositView" onSubmit={createDepositProvider}>
      <div className="contIcontSwitch">
        <IconSwitch {...atributos}/>
      </div>

        <p className="fuente">Esta Billetera aún no tiene dirección de deposito, creala ahora e inicia operaciones con esta cuenta.</p>

      <div className="contButtons deposit">
          <ControlButton
            loader={loader}
            formValidate
            label="Crear dirección de deposito"
          />
      </div>
    </DepositForm>
  )

}




const CriptoView = () => {


  const [ , { current_wallet, modelData: { deposit_providers } }, ,dispatch  ] = useCoinsendaServices()


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

.qrContainer{
  transform: scale(.9);
}

    @media (max-width: 768px){
        width: 100%;
        height: calc(100% - 40px);

        .qrContainer{
          transform: scale(.8);
        }
      }



    &.skeleton .soloAd2,
    &.skeleton .soloAd,
    &.skeleton .dirDep,
    &.skeleton .verifyAddress
    {
      background: #bfbfbf;
      width: 100%;
      border-radius: 3px;
      height: 15px;
      align-self: center;
      left: 15px;
    }

    &.skeleton .soloAd2{
      max-width: 150px;
      justify-self:flex-start;
    }

    &.skeleton .soloAd {
      max-width: 400px;
      justify-self:flex-start;
    }

    &.skeleton .dirDep {
      max-width: 250px;
    }

    &.skeleton .verifyAddress {
      max-width: 350px;
    }

    &.skeleton .qrContainer {
      background: #bfbfbf;
      border-radius: 6px;
    }

    &.skeleton{
      animation-name: ${skeleton};
      animation-duration: 1s;
      animation-iteration-count: infinite;
      opacity: .5;
    }


`



export default CriptoSupervisor