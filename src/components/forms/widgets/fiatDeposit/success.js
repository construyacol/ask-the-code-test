import { useState, useEffect } from "react"
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
import  { SuccessModalCont } from './styles'
import { Success } from '../../../wallets/deposit/flows'
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


const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));


const FiatDepositSuccess = ({ closeModal, actions, params, depositProvData, new_ticket }) => {

    // const [ final, setFinal ] = useState(false)
    // const [ finalButton, setFinalButton ] = useState(false)
    // const { osDevice } = useSelector((state) => state?.ui);
    const { data } = useDetailParseData(new_ticket, 'deposits')
    // const [ depositDetail, setDepositDetail ] = useState(false)

    const depositProvider = useSelector((state) => state?.modelData?.deposit_providers[new_ticket?.deposit_provider_id]);
    
    // const finalizar = async () => {
    //         closeModal()
    //         history.push(`/wallets/activity/${params.account_id}/deposits`);
    //         return actions.add_new_transaction_animation();
    // }

    useEffect(() => {
        console.log('depositProvData', depositProvData)
        console.log('depositProvider', depositProvider)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositProvider])

    // depositProvider?.depositAccount

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

                        <ItemAccountContainer className={`_itemAccountContainer ${!depositProvider ? 'skeleton' : ''}`}>
                            <HeaderMainContainer>
                                <IconAccount className="_iconSkeleton">
                                    {
                                        depositProvider &&
                                            <IconSwitch
                                                icon="coinsenda"
                                                size={35}
                                            />
                                    }
                                </IconAccount>
                                <LabelContainer className="_header__labelContainer">
                                    <AccountLabel>Skeleton wallet</AccountLabel>
                                    <CurrencyLabel>------</CurrencyLabel>
                                </LabelContainer>
                            </HeaderMainContainer>
                            <MobileBalance>
                                <HR/>
                                <p className="fuente2">SDD54554S</p>
                                <p className="fuente _balanceTextLab">Número de cuenta</p>
                            </MobileBalance>
                        </ItemAccountContainer>

                        <AccountMetaData>
                                {/* <DetailGenerator order={new_ticket} theme="darkTheme" /> */}
                        </AccountMetaData>
                        <SubTitle className="fuente">Datos del depósito</SubTitle>
                        <ContentDetail>
                            <DetailTemplateComponent
                                items={data}
                            />
                        </ContentDetail>
                        <Footer></Footer> 
                    </Content>
                </SuccessViewContent>
            </SuccessViewLayout>
        </OtherModalLayout>
    )
} 

export default FiatDepositSuccess
 

const ContentDetail = styled.div`
    display:flex;
    flex-direction: column;
    row-gap: 7px;
    border-bottom: 1px solid #E9E9E9;
    padding-bottom: 40px;
`


const AccountMetaData = styled.div`
    height:110px;
    width:100%;
    background:#F9F9F9;
    border-radius: 5px;
`


const SubTitle = styled.h3`
    color:var(--paragraph_color);
`

const Element = styled.div`
    height:50px;
    border:1px solid green;
`

const Title = styled.h2`
    text-align: center;
    color: white;
    letter-spacing: 1px;
    font-size: 22px;
`

const Footer = styled.div`
    height:60px;

`

const Content = styled.div`
    background: white;
    border-radius: 6px;
    border:1px solid #E7E7E7;
    padding: 15px 45px;
    display:flex;
    flex-direction: column;
    row-gap: 15px;
    
    ._itemAccountContainer{
        grid-template-columns: auto 1fr;
    }

    ${ItemAccountContainer}{
        border-left:5px solid var(--primary);
    }

    ${MobileBalance}{
        justify-self: end;
        column-gap: 22px;
    }

    ${IconAccount}{
        height:50px;
        width:50px;
    }

`

const Header = styled.div`
    height: 130px;
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    ${Title}{
        margin:0;
    }
`

const SuccessViewContent = styled.div`
    height:auto;
    width:100%;
    display:grid;
    max-width: 850px;
    z-index: 2;
    position: relative;
    grid-template-rows: auto 1fr;
    row-gap: 20px;
    padding: 20px 0 40px;

    .iconSuccess{
        display: grid;
        justify-items: center;
        transform: scale(0.75);
    }

`

const SuccessViewLayout = styled.div`
    width:100vw;
    height:100vh;
    background:#F9F9FB;
    position:absolute;
    top:0;
    left:0;
    display: grid;
    justify-items: center;
    overflow-y:scroll;

    &::after{
        content: "";
        width: 100vw;
        height: 25vh;
        background: linear-gradient(to bottom right,#129a8e,#57cd85);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 0;
    }
`
















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