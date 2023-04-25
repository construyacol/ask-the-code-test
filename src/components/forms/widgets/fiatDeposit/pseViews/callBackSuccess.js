import OtherModalLayout from "components/widgets/modal/otherModalLayout";
import { history } from 'const/const'
import loadable from "@loadable/component";
import { useSelector } from "react-redux";
import { 
    ItemAccountContainer,
} from 'components/widgets/accountList/listView'
import {
    HeaderMainContainer,
    IconAccount,
    LabelContainer,
    AccountLabel,
} from 'components/widgets/headerAccount/styles'
import DetailTemplateComponent from 'components/widgets/detailTemplate'
import { TotalAmount } from 'components/widgets/shared-styles'
import { ButtonContainer } from '../../newWallet/styles'
import ControlButton from "components/widgets/buttons/controlButton";
import {
    SuccessViewContent,
    SuccessViewLayout,
    Title,
    Header,
    ContentDetail,
    SubTitle, 
    Content
} from '../../success/styles'
import { useActions } from 'hooks/useActions'
import { replaceToCurrency } from "core/config/currencies"


const IconSwitch = loadable(() => import("components/widgets/icons/iconSwitch"));
const FiatDepositSuccess = ({ pse_success }) => { 
    const actions = useActions()
    const { osDevice } = useSelector((state) => state?.ui);
    const { account_id, amount, cost, currency, totalAmount } = pse_success
    const closeModal = () => actions.renderModal(null)
    const finish = async () => {
        closeModal()
        history.push(`/wallets/activity/${account_id}/deposits`);
    }
    return(
        <OtherModalLayout
        id="close-button-with-OtherModalLayout"
        onkeydown={false}
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
                        <Title className="fuente">{`!Listo!, el pago ha sido realizado exitosamente`}</Title>
                    </Header>

                    <Content>
                        <PseSuccessDetail/>
                        <SubTitle className="fuente">Datos del pago</SubTitle>
                        <ContentDetail className="onBottom">
                            <DetailTemplateComponent
                                items={[
                                    [`Cantidad acreditada:`, `$ ${amount} ${replaceToCurrency({currency})}`],
                                    ["Costo:",  `$ ${cost} ${replaceToCurrency({currency})}`],
                                ]}  
                            />
                        </ContentDetail>
                        <TotalAmount 
                            color="var(--paragraph_color)" 
                        >
                            <p className="fuente saldo">Total pagado</p>
                            <p className="fuente2 amount">
                                    $ {totalAmount} 
                                    <span className="fuente"> {replaceToCurrency({currency})}</span>
                            </p>
                        </TotalAmount>
                    </Content>

                    <ButtonContainer className={`${osDevice} buttonContainer`}>
                        <ControlButton
                            formValidate
                            label={'Finalizar'}
                            handleAction={finish}
                        />
                    </ButtonContainer>
 

                </SuccessViewContent>
            </SuccessViewLayout>
        </OtherModalLayout>
    )
} 

export default FiatDepositSuccess


const PseSuccessDetail = ({ children }) => {
    return(
        <>
            <SubTitle className="fuente">Pago realizado a través de PSE</SubTitle>
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


