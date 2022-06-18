import { useEffect } from "react"
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
// import  { SuccessModalCont } from './styles'
// import { Success } from '../../../wallets/deposit/flows'
import styled from 'styled-components'
import { UI_NAMES } from '../../../../const/uiNames'
import loadable from "@loadable/component";
// import { useSelector } from "react-redux";
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
// import { useDetailParseData } from '../../../widgets/modal/render/orderDetail/detailGenerator'
// import DetailGenerator from "../../../widgets/modal/render/orderDetail/detailGenerator";
// import DetailTemplateComponent from '../../../widgets/detailTemplate'
// import { TotalAmount } from '../../../widgets/shared-styles'
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
import { useActions } from '../../../../hooks/useActions'



const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));


const WAccountCreatedSuccess = ({ 
    withdrawAccount = false,
    // closeModal, 
    // actions, 
    params, 
    // depositProvData, 
    new_ticket 
}) => {

    const actions = useActions()

    const closeModal = (e) => {
        actions.renderModal(null);
    };

    // const { data, formatDepositAccount, formatCurrency, currencySimbol } = useDetailParseData(new_ticket, 'shortDeposit')
    // const [ depProvDetail, setDepProvDetail ] = useState([])
    // const depositProvider = useSelector((state) => state?.modelData?.deposit_providers[new_ticket?.deposit_provider_id]);
    // const depositAccount = depositProvider?.depositAccount
    // const finish = async () => {
    //         closeModal()
    //         history.push(`/wallets/activity/${params.account_id}/deposits`);
    //         return setTimeout(() => {
    //              actions.add_new_transaction_animation();
    //         }, 20)
    // }
    // const [ amount, setAmount ] = useState([])

    

    // const init = async() => {
    //     setAmount(await formatCurrency(new_ticket?.amount_neto, new_ticket?.currency))
    //     setDepProvDetail(await formatDepositAccount(depositAccount))
    // }

    // // [`Cantidad ${isPending ? 'por acreditar' : 'acreditada'}:`, `${await formatCurrency(order?.amount, order?.currency)} ${currencySimbol}`],


    useEffect(() => {
        if(withdrawAccount){
            console.log('withdrawAccount', withdrawAccount?.info)
            
            debugger
            // init()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawAccount])



    return(
        <OtherModalLayout
        id="close-button-with-OtherModalLayout"
        onkeydown={false}
        // on_click={closeModal}
        >  
            <SuccessViewLayout>
                <SuccessViewContent className="withdrawAccountSuccess">

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
                        <Title className="fuente">Cuenta de retiro creada exitosamente</Title>
                    </Header>

                    <Content className="withdrawAccountSuccess">
                        <p className="fuente">Tu cuenta se encuentra en proceso de verificación, esto puede tardar hasta <span className="fuente2"><strong>72 horas</strong></span> hábiles.
                        </p>
                    </Content>

                    <Content>
                        <ButtonContainer className="_sticky">
                            <ControlButton
                                // id={idSubmitButton}
                                // loader={loader}
                                formValidate
                                label="Finalizar"
                                // handleAction={finish}
                            />
                        </ButtonContainer>


                        <SubTitle className="fuente">Datos de tu cuenta de retiro</SubTitle>
                        <ItemAccountContainer className={`_itemAccountContainer ${!withdrawAccount ? 'skeleton' : ''}`}>
                            <HeaderMainContainer>
                                <IconAccount className="_iconSkeleton">
                                    {
                                        withdrawAccount &&
                                            <IconSwitch
                                                icon={withdrawAccount?.info?.bank_name}
                                                size={35}
                                            />
                                    }
                                </IconAccount>
                                <LabelContainer className="_header__labelContainer">
                                    <AccountLabel>{withdrawAccount?.info?.bank_name || 'is awesome bank name'}</AccountLabel>
                                    <CurrencyLabel>{UI_NAMES.account_type[withdrawAccount?.info?.account_type] || 'awsom account type'}</CurrencyLabel>
                                </LabelContainer>
                            </HeaderMainContainer>
                            <MobileBalance>
                                <HR/>
                                <p className="fuente2">{withdrawAccount?.info?.account_number || 'account number'}</p>
                                <p className="fuente _balanceTextLab"># de cuenta</p>
                            </MobileBalance>
                        </ItemAccountContainer>

                        <AccountMetaData>
                            <ContentDetail>
                                <MetaDataTitle >
                                    <p className="fuente">
                                        Documento de identidad vinculado
                                    </p>
                                </MetaDataTitle>
                                <IdentityContainer>  
                                    <NameContainer>
                                        <p>{withdrawAccount?.info?.name}</p>
                                        <p>{UI_NAMES?.documents[withdrawAccount?.info?.id_type]}</p>
                                    </NameContainer> 
                                    <IdTypeContainer>
                                        {/* <IconSwitch
                                            icon="colombia"
                                            size={30}
                                        /> */}
                                        <HR/>
                                        <NameContainer>
                                            <p className="fuente2">{withdrawAccount?.info?.id_number}</p>
                                            <p>Número</p>
                                        </NameContainer>
                                    </IdTypeContainer>
                                </IdentityContainer>

                            </ContentDetail>
                        </AccountMetaData>
                    </Content>


                    <ButtonContainer>
                        <ControlButton
                            // id={idSubmitButton}
                            // loader={loader}
                            inputProps={{
                                "data-close_modal":true
                            }}
                            formValidate
                            label="Finalizar" 
                            handleAction={closeModal}
                        />
                    </ButtonContainer>


                </SuccessViewContent>
            </SuccessViewLayout>
        </OtherModalLayout>
    )
} 

export default WAccountCreatedSuccess
 
const IdTypeContainer = styled.div`
    display:grid;
    grid-template-columns:auto auto;
    column-gap:2px;
    ${HR}{
        justify-self: center;
    }

`

const IdentityContainer = styled.div`
    display:grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows:1fr;
    min-height:100px;
`

const MetaDataTitle = styled.div`
    border-bottom: 1px solid #cacaca;
    p{
        color:var(--paragraph_color);
        margin-top: 0;
        font-size: 17px;
    }
`



const NameContainer = styled.div`

    display:grid;
    height: auto;
    align-self: center;
    row-gap: 3px;

    p{
        font-family: "Raleway", sans-serif;
        &.fuente2{
            font-family: "Tomorrow", sans-serif;
        }
        margin: 0;
        font-size: 13px;
        color:var(--placeholder);
    }

    p:first-child{
        color:var(--paragraph_color);
        font-size:18px;
    }

`
















// export const BankDataContainer = ({accountData:{ 
//         title,
//         bankUiName,
//         accountType,
//         accountIdUiName,
//         accountId,
//         bussinesNameUiName,
//         bussinesName,
//         nitUiName,
//         nit,
//         dvUiName,
//         dv
//     }}) => {

    
//     const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));


//     return(
//         <BankData>
//             <TitleContainer >
//                 <p className="fuente">{title}</p>
//                 <div className="__line__"/>
//             </TitleContainer>

//             <CorpAccountContainer className="corpAccountContainer">
//                 <IconContainer className="_corpAccIcon">
//                     <IconSwitch size={45} icon={bankUiName} />
//                 </IconContainer>
//                 <DetailAccountProv>
//                     <h3 className="fuente">{bankUiName}</h3>
//                     <p className="fuente bold"> <strong>{accountType}</strong></p>
//                     <p className="fuente bold"><strong>{accountIdUiName}:</strong> <span className="fuente2">{accountId}</span></p>
//                     <p className="fuente"> <strong> {bussinesNameUiName}: </strong> {bussinesName}</p>
//                     <p className="fuente"><strong> {nitUiName}:</strong> <span className="fuente2">{nit}</span></p>
//                     <p className="fuente"><strong>{dvUiName}:</strong> <span className="fuente2">{dv}</span></p>
//                 </DetailAccountProv>
//             </CorpAccountContainer>

//             <TitleContainer >
//                 <p className="fuente">Datos del depósito</p>
//                 <div className="__line__"/>
//             </TitleContainer>
//         </BankData>
//     )
// }


// export const DetailAccountProv = styled.div`
//     display:grid;
//     grid-template-columns: 1fr;
//     color:white;
//     .bussines_name, .nit{
//         font-size:14px;
//     }
//     h3{
//         text-transform:capitalize;
//         margin: 0 0 10px 0;
//     }
//     p{
//         margin:5px 0;
//     }

// `


// export const BankData = styled.div`
//     width:100%;
//     @media (max-width: 768px) {

//         ${DetailAccountProv}{
//             text-align:left;
//         }

//         ._corpAccIcon{
//             width:70px;
//             height:70px;
//         }

//         .corpAccountContainer{
//             align-items: start;
//         }

//         .bussines_name_span{
//             display:none;
//         }
//     }
// `

// export const TitleContainer = styled.div`
//     display: grid;
//     grid-template-columns: auto 1fr;
//     column-gap: 20px;
//     color:white;
//     width: 100%;

//     p{
//         font-size: 18px;
//         font-weight: bold;
//     }

//     .__line__{
//         border-bottom: 1px solid white;
//         height: 2px;
//         align-self: center;
//     }
// `




// export const CorpAccountContainer = styled.div`
//     display:grid;
//     grid-template-columns:auto 1fr;
//     column-gap:20px;
//     width:auto;
//     align-items:center;
// `
// export const IconContainer = styled.div`
//     width:110px;
//     height:110px;
//     background:#e6e6e6;
//     border-radius:6px;
//     display:grid;
//     align-items: center;
//     justify-items: center;
// `



