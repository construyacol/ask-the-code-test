import { useState, useEffect } from "react"
import OtherModalLayout from "../../../widgets/modal/otherModalLayout";
// import  { SuccessModalCont } from './styles'
// import { Success } from '../../../wallets/deposit/flows'
import { UI_NAMES } from '../../../../const/uiNames'
import loadable from "@loadable/component";
import { useSelector } from "react-redux";
import { 
    ItemAccountContainer,
    MobileBalance
} from '../../../widgets/accountList/listView'
import { capitalizeWord } from '../../../../utils'

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
import ControlButton, { SecondaryButton } from "../../../widgets/buttons/controlButton";
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
import { UI_ERRORS } from '../../../../const/uiErrors'
import useToastMessage from "../../../../hooks/useToastMessage"; 



const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));

const WithdrawCreatedSuccess = ({ 
    withdrawData = false,
    callback = () => {},
    // closeModal, 
    // actions, 
    // params, 
    // new_ticket 
}) => {

    const actions = useActions()
    const { withdraw_accounts } = useSelector(({ modelData }) => modelData)
    const withdrawAccount = withdraw_accounts[withdrawData?.withdraw_account_id]
    const accountName = withdrawAccount?.bank_name?.ui_name || withdrawAccount?.info?.label || UI_NAMES.provider[withdrawAccount.provider_type]
    const [ toastMessage ] = useToastMessage();

    const { data, formatCurrency, currencySimbol } = useDetailParseData(withdrawData, 'shortWithdraw')

    const [ amount, setAmount ] = useState([])
    const [ loading, setLoading ] = useState(false)

    const init = async() => {
        setAmount(await formatCurrency(withdrawData?.amount_neto, withdrawData?.currency))
        // setDepProvDetail(await formatDepositAccount(depositAccount))
    }

    const withdrawConfirm = async() => {
        setLoading(true)
        const { error } = await ApiPostWithdrawConfirm(withdrawData)
        if(error){
            toastMessage(UI_ERRORS[error?.code] || error?.message, "error");
            return setLoading(false)
        }
        setLoading(false)
        callback && callback()
        return actions.renderModal(null)
    }

    useEffect(() => {
        init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log('withdrawAccount', withdrawAccount)

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
                        <Title className="fuente">Estás a un paso de enviar tu dinero</Title>
                    </Header>

                    <Content>

                        <SubTitle style={{marginBottom:"0"}} className="fuente ">Resumen del envío</SubTitle>

                        <li className="fuente _fromTo">Desde</li>
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




                        <li className="fuente _fromTo">Hacia</li>
                        <ItemAccountContainer className={`_itemAccountContainer ${!withdrawAccount ? 'skeleton' : ''}`}>
                            <HeaderMainContainer>
                                <IconAccount className="_iconSkeleton">
                                    {
                                        withdrawAccount &&
                                            <IconSwitch
                                                icon={withdrawAccount?.info?.bank_name || withdrawAccount?.provider_type}
                                                size={35}
                                                color={"var(--primary)"}
                                            />
                                    }
                                </IconAccount>
                                <LabelContainer className="_header__labelContainer">
                                    <AccountLabel>{capitalizeWord(accountName) || 'is awesome bank name'}</AccountLabel>
                                    <CurrencyLabel>{(UI_NAMES.account_type[withdrawAccount?.info?.account_type] || withdrawAccount?.info?.id_number || withdrawAccount?.info?.identifier) || 'awsom account type'}</CurrencyLabel>
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

                        <SubTitle className="fuente">Datos del envío</SubTitle>
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
                        <SecondaryButton
                            label="Cancelar"
                            handleAction={() => actions.renderModal(null)}                 
                        />
                        <ControlButton
                            // id={idSubmitButton}
                            loader={loading}
                            inputProps={{"data-close_modal":true}}
                            formValidate
                            label="Confirmar envío" 
                            handleAction={withdrawConfirm}
                        />
                    </ButtonContainer>


                </SuccessViewContent>
            </SuccessViewLayout>
        </OtherModalLayout>
    )
} 

export default WithdrawCreatedSuccess
 














