import { useState } from "react"
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
import  { SuccessModalCont } from './styles'
import { Success } from '../../../wallets/deposit/flows'
import styled from 'styled-components'
import { history } from '../../../../const/const'
import loadable from "@loadable/component";



const FiatDepositSuccess = ({ closeModal, actions, params, depositProvData, new_ticket }) => {

    const [ final, setFinal ] = useState(false)
    const [ finalButton, setFinalButton ] = useState(false)
    // const depositProvider = useSelector((state) => state?.modelData?.wallets[params?.account_id]);
    
    const finalizar = async () => {
        if (final) {
            closeModal()
            history.push(`/wallets/activity/${params.account_id}/deposits`);
            return actions.add_new_transaction_animation();
        }else{
          setFinal(true)
          setFinalButton(true)
          setTimeout(() => {
            setFinalButton(false)
          }, 5000)
        }
    }

    console.log('depositProvData', depositProvData)


    return(
        <OtherModalLayout
      id="close-button-with-OtherModalLayout"
      onkeydown={false}
      on_click={closeModal}
    >
      <SuccessModalCont>
        <Container>        
            <Success
            deposit_way="cash"
            final={final}
            finalizar={finalizar}
            finalButton={finalButton}
            depositProvData={depositProvData}
            new_ticket={new_ticket}
            />
        </Container>
      </SuccessModalCont>
    </OtherModalLayout>
    )
}

export default FiatDepositSuccess


export const BankDataContainer = ({accountData:{ 
        title,
        bankUiName,
        accountType,
        accountIdUiName,
        accountId,
        bussinesNameUiName,
        bussinesName,
        nitUiName,
        nit 
    }}) => {

    
    const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

    return(
        <BankData>
            <TitleContainer >
                <p className="fuente">{title}</p>
                <div className="__line__"/>
            </TitleContainer>

            <CorpAccountContainer className="corpAccountContainer">
                <IconContainer className="_corpAccIcon">
                    <IconSwitch size={45} icon={bankUiName} />
                </IconContainer>
                <DetailAccountProv>
                    <h3 className="fuente">{bankUiName}</h3>
                    <p className="fuente">{accountType}</p>
                    <p className="fuente">{accountIdUiName}: <span className="fuente2">{accountId}</span></p>
                    <p className="fuente bussines_name"><span className="bussines_name_span">{bussinesNameUiName}:</span>{bussinesName}</p>
                    <p className="fuente nit">{nitUiName}: <span className="fuente2">{nit}</span></p>
                </DetailAccountProv>
            </CorpAccountContainer>

            <TitleContainer >
                <p className="fuente">Datos de la orden</p>
                <div className="__line__"/>
            </TitleContainer>
        </BankData>
    )
}


export const DetailAccountProv = styled.div`
    display:grid;
    grid-template-columns: 1fr;
    color:white;
    .bussines_name, .nit{
        font-size:14px;
    }
    h3{
        text-transform:capitalize;
        margin: 0 0 10px 0;
    }
    p{
        margin:5px 0;
    }

`


export const BankData = styled.div`
    width:100%;
    @media (max-width: 768px) {

        ${DetailAccountProv}{
            text-align:left;
        }

        ._corpAccIcon{
            width:70px;
            height:70px;
        }

        .corpAccountContainer{
            align-items: start;
        }

        .bussines_name_span{
            display:none;
        }
    }
`

export const TitleContainer = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    color:white;
    width: 100%;
    .__line__{
        border-bottom: 1px solid white;
        height: 2px;
        align-self: center;
    }
`




export const CorpAccountContainer = styled.div`
    display:grid;
    grid-template-columns:auto 1fr;
    column-gap:20px;
    width:auto;
    align-items:center;
`
export const IconContainer = styled.div`
    width:110px;
    height:110px;
    background:#e6e6e6;
    border-radius:6px;
    display:grid;
    align-items: center;
    justify-items: center;
`




const Container = styled.div`
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    align-items: center;
    justify-items: center;
    position:relative;

    .nWCabeza{
        border-bottom:0px;
    }

    #DLstep2{
        display: grid;
        justify-items: center;
        align-items: center;
        grid-template-rows: 200px 1fr 100px;
        width: 100%;
        max-height: calc(100vh - 80px);
        height: calc(100vh - 80px);
        max-width: 650px;
        border: 1px solid transparent;
    }
`