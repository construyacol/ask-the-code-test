// import { useEffect } from "react"
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
    withdrawAccountData = false,
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

    const { withdraw_accounts } = useSelector(({ modelData }) => modelData)
    const withdrawAccount = withdraw_accounts[withdrawAccountData?.id]
    const accountName = withdrawAccount?.bank_name?.ui_name || UI_NAMES.provider[withdrawAccount?.provider_type]


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

                        <SubTitle className="fuente">Datos de tu cuenta de retiro</SubTitle>
                        <ItemAccountContainer className={`_itemAccountContainer ${!withdrawAccount ? 'skeleton' : ''}`}>
                            <HeaderMainContainer>
                                <IconAccount className="_iconSkeleton">
                                    {
                                        withdrawAccount &&
                                            <IconSwitch
                                                icon={withdrawAccount?.bank_name?.value  || withdrawAccount?.provider_type}
                                                size={35}
                                            />
                                    }
                                </IconAccount>
                                <LabelContainer className="_header__labelContainer">
                                    <AccountLabel>{capitalizeWord(accountName) || 'is awesome bank name'}</AccountLabel>
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













