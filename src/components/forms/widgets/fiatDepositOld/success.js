import { useState, useEffect } from "react"
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
// import  { SuccessModalCont } from './styles'
// import { Success } from '../../../wallets/deposit/flows'
import styled from 'styled-components'
import { history } from '../../../../const/const'
import loadable from "@loadable/component";
import { useSelector } from "react-redux";
import { 
    ItemAccountContainer,
    MobileBalance
} from '../../../widgets/accountList/listView'
import {
    // HeaderContainer,
    HeaderMainContainer,
    IconAccount,
    LabelContainer,
    AccountLabel,
    CurrencyLabel,
    // BalanceContainer,
    HR
} from '../../../widgets/headerAccount/styles'
import { useDetailParseData } from '../../../widgets/modal/render/orderDetail/detailGenerator'
// import DetailGenerator from "../../../widgets/modal/render/orderDetail/detailGenerator";
import DetailTemplateComponent from '../../../widgets/detailTemplate'
import { TotalAmount } from '../../../widgets/shared-styles'
import {
    ButtonContainer
  } from '../newWallet/styles'
import ControlButton from "../../../widgets/buttons/controlButton";
import {
    SuccessViewContent,
    SuccessViewLayout,
    Title,
    Header,
    ContentDetail,
    AccountMetaData,
    SubTitle,
    Content
} from '../success/styles'



const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));


const FiatDepositSuccess = ({ 
    closeModal, 
    actions, 
    params, 
    // depositProvData, 
    new_ticket 
}) => {

    // const [ final, setFinal ] = useState(false)
    // const [ finalButton, setFinalButton ] = useState(false)
    // const { osDevice } = useSelector((state) => state?.ui);
    const { data, formatDepositAccount, formatCurrency, currencySimbol } = useDetailParseData(new_ticket, 'shortDeposit')
    // const [ depositDetail, setDepositDetail ] = useState(false)
    const [ depProvDetail, setDepProvDetail ] = useState([])
    const depositProvider = useSelector((state) => state?.modelData?.deposit_providers[new_ticket?.deposit_provider_id]);
    const depositAccount = depositProvider?.depositAccount
    const finish = async () => {
            closeModal()
            history.push(`/wallets/activity/${params.account_id}/deposits`);
            return setTimeout(() => {
                 actions.add_new_transaction_animation();
            }, 20)
    }
    const [ amount, setAmount ] = useState([])

    const init = async() => {
        setAmount(await formatCurrency(new_ticket?.amount_neto, new_ticket?.currency))
        setDepProvDetail(await formatDepositAccount(depositAccount))
    }

    // [`Cantidad ${isPending ? 'por acreditar' : 'acreditada'}:`, `${await formatCurrency(order?.amount, order?.currency)} ${currencySimbol}`],


    useEffect(() => {
        if(depositAccount){
            init()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositAccount])

    return(
        <OtherModalLayout
        id="close-button-with-OtherModalLayout"
        onkeydown={false}
        on_click={closeModal}
        >  
            <SuccessViewLayout>
                <SuccessViewContent>

                    <Header>
                        <div className="icon icon--order-success svg iconSuccess">
                            <svg 
                                width="72px"
                                height="72px"
                                alt=""
                            >
                            <g fill="none" stroke="white" strokeWidth="3">
                                <circle cx="36" cy="36" r="35"></circle>
                                <path
                                    className="check"
                                    d="M17.417,37.778l9.93,9.909l25.444-25.393"
                                ></path>
                            </g>
                            </svg>
                        </div>
                        <Title className="fuente">Depósito creado exitosamente</Title>
                    </Header>

                    <Content>

                        <SubTitle className="fuente">Deposita a la siguiente cuenta</SubTitle>
                        <ItemAccountContainer className={`_itemAccountContainer ${!depositAccount ? 'skeleton' : ''}`}>
                            <HeaderMainContainer>
                                <IconAccount className="_iconSkeleton">
                                    {
                                        depositAccount &&
                                            <IconSwitch
                                                icon={depositAccount?.name}
                                                size={35}
                                            />
                                    }
                                </IconAccount>
                                <LabelContainer className="_header__labelContainer">
                                    <AccountLabel>{depositAccount?.ui_name}</AccountLabel>
                                    <CurrencyLabel>{depositAccount?.account?.type?.type}</CurrencyLabel>
                                </LabelContainer>
                            </HeaderMainContainer>
                            <MobileBalance>
                                <HR/>
                                <p className="fuente2">{depositAccount?.account?.account_id?.account_id}</p>
                                <p className="fuente _balanceTextLab">{depositAccount?.account?.account_id?.ui_name}</p>
                            </MobileBalance>
                        </ItemAccountContainer>

                        <AccountMetaData>
                            <ContentDetail>
                                <DetailTemplateComponent
                                    skeletonItems={3}
                                    items={depProvDetail}
                                />
                            </ContentDetail>
                        </AccountMetaData>

                        <SubTitle className="fuente">Datos del depósito</SubTitle>
                        <ContentDetail className="onBottom">
                            <DetailTemplateComponent
                                items={data}
                            />
                        </ContentDetail>
                        <TotalAmount 
                            color="var(--paragraph_color)" 
                        >
                            <p className="fuente saldo">Total a depositar</p>
                            <p className="fuente2 amount">
                                    $ {amount} 
                                    <span className="fuente">{currencySimbol?.toUpperCase()}</span>
                            </p>
                        </TotalAmount>
                    </Content>


                    <ButtonContainer>
                        <ControlButton
                            // id={idSubmitButton}
                            // loader={loader}
                            formValidate
                            label="Finalizar"
                            handleAction={finish}
                        />
                    </ButtonContainer>


                </SuccessViewContent>
            </SuccessViewLayout>
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
        nit,
        dvUiName,
        dv
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
                    <p className="fuente bold"> <strong>{accountType}</strong></p>
                    <p className="fuente bold"><strong>{accountIdUiName}:</strong> <span className="fuente2">{accountId}</span></p>
                    <p className="fuente"> <strong> {bussinesNameUiName}: </strong> {bussinesName}</p>
                    <p className="fuente"><strong> {nitUiName}:</strong> <span className="fuente2">{nit}</span></p>
                    <p className="fuente"><strong>{dvUiName}:</strong> <span className="fuente2">{dv}</span></p>
                </DetailAccountProv>
            </CorpAccountContainer>

            <TitleContainer >
                <p className="fuente">Datos del depósito</p>
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

    p{
        font-size: 18px;
        font-weight: bold;
    }

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



