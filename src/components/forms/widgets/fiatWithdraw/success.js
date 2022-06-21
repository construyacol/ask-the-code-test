import { useState, useEffect } from "react"
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
// import  { SuccessModalCont } from './styles'
// import { Success } from '../../../wallets/deposit/flows'
import styled from 'styled-components'
import { UI_NAMES } from '../../../../const/uiNames'
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
    // AccountMetaData,
    SubTitle,
    Content
} from '../success/styles'
import { useActions } from '../../../../hooks/useActions'
import { ApiPostWithdrawConfirm } from './api'
import useToastMessage from "../../../../hooks/useToastMessage"; 
import { UI_ERRORS } from '../../../../const/uiErrors'



const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

const WithdrawCreatedSuccess = ({ 
    withdrawData = false,
    // closeModal, 
    // actions, 
    // params, 
    // new_ticket 
}) => {

    const actions = useActions()
    const closeModal = () => { actions.renderModal(null) };
    const { withdraw_accounts } = useSelector(({ modelData }) => modelData)
    const withdrawAccount = withdraw_accounts[withdrawData?.withdraw_account_id]
    const accountName = withdrawAccount?.info?.bank_name || UI_NAMES.provider[withdrawAccount.provider_type]
    const [ toastMessage ] = useToastMessage();

    console.log('|||||||||||||||||||||||| withdrawAccount', withdrawAccount)

    const { data, formatCurrency, currencySimbol } = useDetailParseData(withdrawData, 'shortWithdraw')

    const [ amount, setAmount ] = useState([])
    const [ loading, setLoading ] = useState(false)

    const init = async() => {
        setAmount(await formatCurrency(withdrawData?.amount_neto, withdrawData?.currency))
        // setDepProvDetail(await formatDepositAccount(depositAccount))
    }

    const withdrawConfirm = async() => {
        setLoading(true)
        const { error, data } = await ApiPostWithdrawConfirm(withdrawData)
        console.log('|||||||||||  withdrawConfirm ==> ', error, data)
        debugger
        if(error){
            setLoading(false)
            return toastMessage(UI_ERRORS[error?.code] || error?.message, "error");
          }
        setLoading(false)
        // return closeModal()
    }

    useEffect(() => {
        init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return(
        <OtherModalLayout
        id="close-button-with-OtherModalLayout"
        onkeydown={false}
        // on_click={closeModal}
        >  
            <SuccessViewLayout>
                <SuccessViewContent className="withdrawSuccess">

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
                        <Title className="fuente">Retiro creado exitosamente</Title>
                    </Header>

                    <Content>

                        <SubTitle className="fuente">Resumen del retiro</SubTitle>

                        <p className="fuente _fromTo">Desde</p>
                        <ItemAccountContainer className={`_itemAccountContainer`}>
                            <HeaderMainContainer>
                                <IconAccount className="_iconSkeleton">
                                    <IconSwitch
                                        icon={"coinsenda"}
                                        color={"var(--primary)"}
                                        size={35}
                                    />
                                </IconAccount>
                                <LabelContainer className="_header__labelContainer">
                                    <AccountLabel>Coinsenda</AccountLabel>
                                    <CurrencyLabel>Cuenta corporativa</CurrencyLabel>
                                </LabelContainer>
                            </HeaderMainContainer>
                        </ItemAccountContainer>




                        <p className="fuente _fromTo">Hacia</p>
                        <ItemAccountContainer className={`_itemAccountContainer ${!withdrawAccount ? 'skeleton' : ''}`}>
                            <HeaderMainContainer>
                                <IconAccount className="_iconSkeleton">
                                    {
                                        withdrawAccount &&
                                            <IconSwitch
                                                icon={withdrawAccount?.info?.bank_name || withdrawAccount?.provider_type}
                                                size={35}
                                            />
                                    }
                                </IconAccount>
                                <LabelContainer className="_header__labelContainer">
                                    <AccountLabel>{accountName || 'is awesome bank name'}</AccountLabel>
                                    <CurrencyLabel>{(UI_NAMES.account_type[withdrawAccount?.info?.account_type] || withdrawAccount?.info?.id_number) || 'awsom account type'}</CurrencyLabel>
                                </LabelContainer>
                            </HeaderMainContainer>
                            {
                                withdrawAccount?.info?.account_number &&
                                <MobileBalance>
                                    <HR/>
                                    <p className="fuente2">{withdrawAccount?.info?.account_number || 'account number'}</p>
                                    <p className="fuente _balanceTextLab"># de cuenta</p>
                                </MobileBalance>
                            }
                        </ItemAccountContainer>

                        <SubTitle className="fuente">Datos de tu retiro</SubTitle>
                        <ContentDetail className="onBottom">
                            <DetailTemplateComponent
                                items={data}
                                skeletonItems={2}
                            />
                        </ContentDetail>
                        <TotalAmount 
                            color="var(--paragraph_color)" 
                        >
                            <p className="fuente saldo">Cantidad a recibir</p>
                            <p className="fuente2 amount">
                                    $ {amount} <span className="fuente">{currencySimbol?.toUpperCase()}</span>
                            </p>
                        </TotalAmount>

                     
                    </Content>


                    <ButtonContainer>
                        <ControlButton
                            // id={idSubmitButton}
                            loader={loading}
                            inputProps={{"data-close_modal":true}}
                            formValidate
                            label="Finalizar" 
                            handleAction={withdrawConfirm}
                        />
                    </ButtonContainer>


                </SuccessViewContent>
            </SuccessViewLayout>
        </OtherModalLayout>
    )
} 

export default WithdrawCreatedSuccess
 














