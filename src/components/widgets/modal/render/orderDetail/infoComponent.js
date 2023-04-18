import { useEffect } from "react";
import { PaymentProof } from "./paymentProof";
import loadable from "@loadable/component";
import { Icon, IconContainer, Data } from '../../../../referrals/shareStyles'
import { MAIN_COLOR } from '../../../../../const/const'
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { get } from 'lodash'
import styled from 'styled-components'
import { checkIfFiat } from 'core/config/currencies';
import { SPAN, P } from 'core/components/atoms'


const InfoCard = ({ icon, className, children }) => {
    const IconSwitch = loadable(() => import("../../../icons/iconSwitch"));
    return(
      <IconContainer className={className}>
        <Icon>
          <IconSwitch color={MAIN_COLOR}  size={40} icon={icon}/>
        </Icon>
        {children}
      </IconContainer>
    )
}
  
  const WithdrawFiatInfo = () => {

    const IconSwitch = loadable(() => import("../../../icons/iconSwitch"));
    const { tx_path, order_id } = useParams();
    const modelData = useSelector(({ modelData }) => modelData);
    const { withdrawProviders } = modelData
    const { withdraw_account_id } = modelData[tx_path][order_id]
    const withdrawAccount = modelData?.withdraw_accounts && modelData?.withdraw_accounts[withdraw_account_id]
    const withdrawProvider = withdrawProviders[withdrawAccount?.withdraw_provider]
    console.log('withdrawAccount', withdrawProvider)

    return(
      <>
        {
          withdrawProvider?.currency_type === 'crypto' ?
            <PaymentProof/>
          :
            <WithdrawAccountCont className={`${!withdrawAccount ? 'unAvalaible' : ''}`}>
              <IconCont>
                {
                    withdrawAccount && <IconSwitch size={45} icon={withdrawAccount?.bank_name?.value} />
                }
              </IconCont>
              <DataContainer>
                <p className="fuente">{!withdrawAccount ? 'Cuenta no disponible' : withdrawAccount?.bank_name?.ui_name?.toLowerCase()}</p>
                <p className="fuente accountType">{!withdrawAccount ? '' : withdrawAccount?.account_type?.ui_name}</p>
                <p className="fuente2">{!withdrawAccount ? '' : `No. ${withdrawAccount?.account_number?.value}`}</p>
              </DataContainer>
            </WithdrawAccountCont>
        }
      </>
    )
  }

  export const IconCont = styled.div`
    height:80px;
    width:80px;
    border-radius:6px;
    position: relative;
    display: grid;
    background:#d8d8d8;
    border-radius:6px;

    .iconSty{
        position: absolute;
        justify-self: center;
        align-self: center; 
    }
  `

  export const WithdrawAccountCont = styled.div`
    width:auto;
    height:80px;
    display:grid;
    grid-template-columns:auto 1fr;
    column-gap: 12px;

    &.unAvalaible{
       ${IconCont}{
            background:#c4c4c4;
        }
       .fuente{
        font-size:14px;
       }
    }
  ` 
 
  export const DataContainer = styled.div`
    height:100%;
    width:auto;
    display: grid;
    grid-template-rows: 20px 18px auto;
    row-gap: 5px;
    .accountType{
        font-size:12px;
    }
    .fuente2{
      font-size:12px;
    }
    p{
      text-transform: capitalize;
      margin:0;
      color:var(--paragraph_color);
    }
  `


  const InternalWithdrawInfoComponent = ({ order }) => {
    const withdraw_accounts = useSelector(({ modelData:{ withdraw_accounts } }) => withdraw_accounts);
    const { identifier, label } = withdraw_accounts[order?.withdraw_account_id]?.info
    const isASaveAccount = label !== identifier
    const IconSwitch = loadable(() => import("../../../icons/iconSwitch"));
    
    return(
      <div className="internal">
            <P className="bold ellipsis">Destino</P>
          <Data>
            <IconSwitch color={MAIN_COLOR}  size={30} icon="person"/>
            <div>
              <SPAN className="no-margin ellipsis" size={12}>{isASaveAccount ? identifier : 'Destino'}</SPAN>
              <P className="no-margin ellipsis">{label}</P>
            </div>
          </Data>
      </div>
    )
  }


  export const toRender = {
    "deposits":{
      "is_referral":{
          "title":"Depósito por referido",
        "component":() => <InfoCard icon="referral" />
      },
      "is_internal":{
        "title":"Transferencia interna",
        "component":() => <InfoCard icon="coinsenda" />
     },
      "crypto":{
        "title":"TX ID Información"
      },
      "fiat":{
        "type":{
          "following_code":{
            "title":"Código de pago PSE"
          }
        }
      }        
    },
    "withdraws":{
      "is_internal":{
        "title":"Transferencia interna",
        "component":InternalWithdrawInfoComponent
      },
      "fiat":{
        "title":"Información cuenta de retiro",
        "component":WithdrawFiatInfo
        // "component":PaymentProof
      },
      "crypto":{
        "title":"TX ID Información"
        // "component":PaymentProof
      }
    },
    "swaps":{
      "title":"",
      "component":() => (<div></div>)
    }
  }

   
  
  const GetInfoComponentToRender = (order) => {
    const { tx_path, info, metadata } = order
    // console.log('order', order)
    // debugger 
    const currencyType = checkIfFiat(order?.currency) ? 'fiat' : 'crypto'
    const targetKey = info?.is_referral ? 'is_referral' : 
    (info?.is_internal || metadata?.is_internal) ? 'is_internal' : 
    (checkIfFiat(order?.currency) && tx_path === 'deposits') ? `fiat.type.${order?.paymentProof?.proof_of_payment?.type}` : 
    currencyType
    console.log('targetKey', order)
    
    useEffect(()=> {
       const title = tx_path === 'swaps' ? '' : get(toRender, `${tx_path}.${targetKey}`)?.title || 'Comprobante de pago'
       const targetElement = document.querySelector('#titleInfoComponent')
       if(targetElement) targetElement.innerHTML = title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order])

    if(tx_path === 'swaps'){
      return toRender[tx_path]?.component
    } 
   
    return toRender[tx_path][targetKey]?.component ||  PaymentProof
  }


  export default GetInfoComponentToRender