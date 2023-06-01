import { useState, useEffect } from "react"
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
import { history } from '../../../../const/const'
import loadable from "@loadable/component";
import { useSelector } from "react-redux";
import { 
    ItemAccountContainer,
    MobileBalance
} from '../../../widgets/accountList/listView'
import {
    HeaderMainContainer,
    IconAccount,
    LabelContainer,
    AccountLabel,
    CurrencyLabel,
    HR
} from '../../../widgets/headerAccount/styles'
import { useDetailParseData } from '../../../widgets/modal/render/orderDetail/detailGenerator'
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
import RenderSwitchComponent from 'components/renderSwitchComponent'
import Button from 'components/widgets/buttons/button'
import { P } from "core/components/atoms";
import styled from "styled-components";


const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

const FiatDepositSuccess = ({ 
    actions, 
    orderData,
    depositAccount
}) => { 
    
    const deposits = useSelector((state) => state?.modelData?.deposits);
    const depositOrder = deposits?.[orderData?.id] || orderData 
    const { data, formatDepositAccount, formatCurrency, currencySimbol } = useDetailParseData(depositOrder, 'shortDeposit') 
    const [ depProvDetail, setDepProvDetail ] = useState([])
    const [ amount, setAmount ] = useState([])
    const closeModal = () => actions.renderModal(null)
    const finish = async () => {
        closeModal()
        history.push(`/wallets/activity/${depositOrder.account_id}/deposits`);
        return setTimeout(() => actions.add_new_transaction_animation(), 20)
    }
    const init = async(depositAccount) => {
        setAmount(await formatCurrency(depositOrder?.amount_neto, depositOrder?.currency))
        setDepProvDetail(await formatDepositAccount(depositAccount))
    }

    useEffect(() => {
        if(depositAccount) init(depositAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositAccount])


    const provider = depositAccount

    const STAGE_COMPONENTS = {
        bank:BankSuccessDetail,
        pse:PseSuccessDetail
    }

    return(
        <OtherModalLayout
        id="close-button-with-OtherModalLayout"
        onkeydown={false}
        // on_click={closeModal}
        >  
            <SuccessViewLayout>
                <SuccessViewContent className="fiatDepositSuccess">

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
                        <Title className="fuente">{`${depositAccount?.provider_type === 'pse' ? "Transfiere a tráves de PSE para completar tu depósito" : "Depósito creado exitosamente" }`}</Title>
                    </Header>

                    <Content>

                    <RenderSwitchComponent
                        STAGE_COMPONENTS={STAGE_COMPONENTS}
                        component={depositAccount?.provider_type}
                        depProvDetail={depProvDetail}
                        provider={provider}
                    /> 

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
 
                    <RenderSwitchComponent
                        STAGE_COMPONENTS={{
                            bank:BankCTA,
                            pse:PseCTA
                        }} 
                        component={depositAccount?.provider_type}
                        depositAccount={depositAccount}
                        finish={finish}
                        depositOrder={depositOrder}
                    />


                </SuccessViewContent>
            </SuccessViewLayout>
        </OtherModalLayout>
    )
} 

export default FiatDepositSuccess



const BankCTA = ({
    finish
}) => {
    const { osDevice } = useSelector((state) => state?.ui);
    return(
        <ButtonContainer className={`${osDevice} buttonContainer`}>
            <ControlButton
                formValidate
                label={'Finalizar'}
                handleAction={finish}
            />
        </ButtonContainer>
    )
}


// function minutesDifference(date) {
//     var now = new Date();
//     var diff = now - date;
//     return parseInt(diff / 1000 / 60);
// }

// const PSE_DEFAULT_AVAILABLE_PAY_TIME = 15

export const PseCTA = ({
    depositAccount,
    finish,
    depositOrder,
    children
}) => {

    const { osDevice } = useSelector((state) => state?.ui);
    const [ isAvailableToPay, setIsAvailableToPay ] = useState(false)
    // const [ leftMinutes, setLeftMinutes ] = useState(0)


    useEffect(() => {
        (() => {
            const isCtaClicked = localStorage.getItem(`pse_${depositOrder?.id}`)
            isCtaClicked ? setIsAvailableToPay(false) : setIsAvailableToPay(true)
        })()
        // (() => {
        //     let registerDate = localStorage.getItem(`pse_${depositOrder?.id}`)
        //     setIsAvailableToPay(true);
        //     if(!registerDate)return;
        //     let minutesElapsed = minutesDifference(new Date(JSON.parse(registerDate)))
        //     let _leftTime = PSE_DEFAULT_AVAILABLE_PAY_TIME - minutesElapsed
        //     console.log('minutesElapsed', minutesElapsed)
        //     if(minutesElapsed < PSE_DEFAULT_AVAILABLE_PAY_TIME && minutesElapsed >= 0){
        //         setLeftMinutes(_leftTime)
        //         setIsAvailableToPay(false);
        //     };
        // })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <PseContainer className={`${children ? 'withFlexDisplay' : ''} ${!isAvailableToPay ? 'inProcess' : ''}`}>
            {children}
            {
                isAvailableToPay ?
                <>
                    <ButtonContainer className={`${osDevice} buttonContainer pseButton`}>
                        <Button
                            className={`${finish ? '' : 'displayNone'}`}
                            onClick={finish}
                        >
                            Salir
                        </Button> 
                        <ControlButton
                            formValidate
                            loader={depositOrder?.metadata?.bank_url ? false : true}
                            label={`${depositAccount?.provider_type === 'pse' ? 'Ir a PSE' : 'Finalizar'}`}
                            handleAction={() => {
                                // localStorage.setItem(`pse_${depositOrder?.id}`, JSON.stringify(new Date()));
                                localStorage.setItem(`pse_${depositOrder?.id}`, true);
                                setIsAvailableToPay(false);
                                // setLeftMinutes(PSE_DEFAULT_AVAILABLE_PAY_TIME)
                                window.location.href = depositOrder?.metadata?.bank_url;
                                // window.open(depositOrder?.metadata?.bank_url, '_blank');
                                finish && finish()
                            }}
                        />
                    </ButtonContainer>
                </>
                :
                <P size={14}>  
                    Ya se ha iniciado un proceso de pago para esta orden, en un momento te nofiticaremos sobre su estado
                    {/* Se ha iniciado el proceso de pago, si no puedes concluirlo el botón se habilitará nuevamente en {leftMinutes} minutos */}
                </P>
            }

        </PseContainer>
    )
}

const PseContainer = styled.div`
    &.withFlexDisplay{
        display: flex;
    }
    align-items: center;
    width: 100%;
    justify-content: space-between;
    column-gap: 50px;
    .paymentProofCont{
        width: 200px;
    }
    p{
       text-align: center;
    }
    &.inProcess{
        flex-direction: column;
    }
`


const PseSuccessDetail = ({ children }) => {

    return(
        <>
            <SubTitle className="fuente">Tienes 20 minutos para completar el proceso</SubTitle>
            <ItemAccountContainer className={`_itemAccountContainer `}>
                <HeaderMainContainer>
                    <IconAccount className="_iconSkeleton">
                        <IconSwitch
                            icon={"pse"}
                            size={40}
                        />
                    </IconAccount>
                    <LabelContainer className="_header__labelContainer">
                        <AccountLabel>PSE</AccountLabel>
                    </LabelContainer>
                </HeaderMainContainer>
            </ItemAccountContainer>

            {children}
        </>
    )
}



const BankSuccessDetail = ({
    provider,
    depProvDetail
}) => {


    return(
        <>
            <SubTitle className="fuente">Deposita a la siguiente cuenta</SubTitle>
            <ItemAccountContainer className={`_itemAccountContainer ${!provider ? 'skeleton' : ''}`}>
                <HeaderMainContainer>
                    <IconAccount className="_iconSkeleton">
                        {
                            provider &&
                                <IconSwitch
                                    icon={provider?.name}
                                    size={35}
                                />
                        }
                    </IconAccount>
                    <LabelContainer className="_header__labelContainer">
                        <AccountLabel>{provider?.ui_name}</AccountLabel>
                        <CurrencyLabel>{provider?.account?.type?.type}</CurrencyLabel>
                    </LabelContainer>
                </HeaderMainContainer>
                <MobileBalance>
                    <HR/>
                    <p className="fuente2">{provider?.account?.account_id?.account_id}</p>
                    <p className="fuente _balanceTextLab"># de cuenta</p>
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
        </>
    )
}