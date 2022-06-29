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



const IconSwitch = loadable(() => import("../../../widgets/icons/iconSwitch"));


const FiatDepositSuccess = ({ 
    actions, 
    depositOrder 
}) => {
    
    const { data, formatDepositAccount, formatCurrency, currencySimbol } = useDetailParseData(depositOrder, 'shortDeposit')
    const [ depProvDetail, setDepProvDetail ] = useState([])
    const depositProvider = useSelector((state) => state?.modelData?.deposit_providers[depositOrder?.deposit_provider_id]);
    const [ amount, setAmount ] = useState([])

    // const depositAccount = depositProvider?.depositAccount

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
        if(depositProvider){
            init(depositProvider?.provider)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositProvider])

    const provider = depositProvider?.provider

    return(
        <OtherModalLayout
        id="close-button-with-OtherModalLayout"
        onkeydown={false}
        // on_click={closeModal}
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
                                <p className="fuente _balanceTextLab">{provider?.account?.account_id?.ui_name}</p>
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
 


