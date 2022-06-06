import styled from 'styled-components'
import { isEmpty } from 'lodash' 
import useViewport from "../../../hooks/useWindowSize";
import loadable from "@loadable/component";
import { device, history } from '../../../const/const'
import useCurrencies from '../../../hooks/useCurrencies'
import {
    // HeaderContainer,
    HeaderMainContainer,
    IconAccount,
    LabelContainer,
    AccountLabel,
    CurrencyLabel,
    // BalanceContainer,
    // HR
} from '../headerAccount/styles'


const IconSwitch = loadable(() => import("../icons/iconSwitch"));

export default function ListViewComponent(props) {
    const {
        items = []
    } = props
    const currencies = useCurrencies()
    const accounts = items
    return(
        <ListViewContainer>
            {
                !isEmpty(accounts) && accounts.map((account, index) => {
                    return(
                        <ItemAccount 
                            currency={currencies[account?.currency?.currency]}
                            account={account} 
                            key={index} 
                        />
                    )
                })
            }
        </ListViewContainer>
    )
}


const ItemAccount = ({ account, currency }) => {
    const { isMovilViewport } = useViewport();
    const toDetail = () => {
        return history.push(`/wallets/activity/${account?.id}/deposits`);
    }
    return(
        <ItemAccountContainer onClick={toDetail}>
            <HeaderMainContainer className="_accountHeaderMainContainer">
                <IconAccount>
                <IconSwitch
                    icon={account?.currency?.currency}
                    size={isMovilViewport ? 20 : 35}
                />
                </IconAccount>
                <LabelContainer className="_header__labelContainer">
                <AccountLabel>{account?.name || 'Mi billetera'}</AccountLabel>
                <CurrencyLabel>{currency?.symbol || '-'}</CurrencyLabel>
                </LabelContainer>
            
            </HeaderMainContainer>
        </ItemAccountContainer>
      )
}



export const ListViewContainer = styled.div`
    display:grid;
    margin-bottom:50px;
    grid-template-columns: 1fr;
    grid-template-rows:repeat(auto-fill, minmax(70px, 100px));
    grid-template-rows:repeat(auto-fill, auto);
    row-gap:17px;
    height:auto;
`

export const ItemAccountContainer = styled.div`
    border-radius: 5px;
    cursor:pointer;
    height:100px;
    display: grid;
    grid-template-columns: auto 1fr;
    background: white;
    border: 1px solid #E9E9E9;
    padding: 0 45px;
    border-left:5px solid #E9E9E9;
    transition:.15s;

    &:hover{
        border-left:5px solid var(--primary);
    }

    @media ${device.mobile} {
        padding: 0 17px;
    }
`
