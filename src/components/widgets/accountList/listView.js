import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { isEmpty } from 'lodash' 
import useViewport from "../../../hooks/useWindowSize";
import loadable from "@loadable/component";
import { device, history } from '../../../const/const'
import useCurrencies from '../../../hooks/useCurrencies'
import BalanceComponent from "../balance/balance";
import { useCoinsendaServices } from "../../../services/useCoinsendaServices";
import { useSelector } from "react-redux";
import {
    // HeaderContainer,
    HeaderMainContainer,
    IconAccount,
    LabelContainer,
    AccountLabel,
    CurrencyLabel,
    BalanceContainer,
    HR
} from '../headerAccount/styles'
import { useActions } from '../../../hooks/useActions'
import { formatToCurrency } from "../../../utils/convert_currency";


const IconSwitch = loadable(() => import("../icons/iconSwitch"));

export default function ListViewComponent(props) {
    const {
        items = []
    } = props
    const currencies = useCurrencies()
    const [ loading, setLoading ] = useState(false)
    const accounts = items
    
    return(
        <ListViewContainer className={`listViewContainer ${loading ? 'loading' : ''}`}>
            {
                !isEmpty(accounts) && accounts.map((account, index) => {
                    return(
                        <ItemAccount 
                            currency={currencies[account?.currency?.currency]}
                            account={account} 
                            key={index} 
                            index={index}
                            setLoading={setLoading}
                            loading={loading}
                        />
                    )
                })
            }
        </ListViewContainer>
    )
}


const ItemAccount = ({ account, currency, index, loading, setLoading }) => {

    const { isMovilViewport } = useViewport();
    const actions = useActions()
    const [ coinsendaServices ] = useCoinsendaServices();
    const { currentFilter } = useSelector((state) => state.ui.current_section.params);
    const [ currentAccount, setCurrentAccount ] = useState()

    const getAccountTransactions = async () => {
        setLoading(true)
        setCurrentAccount(true)
        const countAccount = await coinsendaServices.countOfAccountTransactions(account.id);
        const { count } = countAccount;
        

        await actions.update_item_state(
          { [account.id]: { ...account, count } },
          "wallets"
        );
        if (count < 1) {
          let areThereDeposits = await coinsendaServices.getDepositByAccountId(account.id);
        //   setLoading(false)
          if (areThereDeposits && areThereDeposits.length) {
            actions.update_item_state(
              { [ account.id ]: { ...account, count: 1 } },
              "wallets"
            ); //actualiza el movimiento operacional de la wallet
            return history.push(`/wallets/activity/${account.id}/deposits`);
          }
          return history.push(`/wallets/deposit/${account.id}`);
        }
        return history.push(`/wallets/activity/${account.id}/${currentFilter ? currentFilter : "deposits"}`);
    };

    const toDetail = () => {
        if (account.count === undefined) {
            return getAccountTransactions();
        }
        if (account.count < 1) {
            return history.push(`/wallets/deposit/${account.id}`);
        }
        return history.push(`/wallets/activity/${account.id}/${currentFilter ? currentFilter : "deposits"}`);
    }

    console.log('ITEM key', index)
    const accountName = isMovilViewport ? `Billetera ${currency?.symbol || "-"}` : account?.name

    return(
        <ItemAccountContainer onClick={loading ? null : toDetail} className={`${(loading && currentAccount) ? 'loading' : ''}`}>
            <IndicatorHover>
                <div className="indicator" >
                    <div className="indicatorSon" ></div>
                </div>
            </IndicatorHover>
            <HeaderMainContainer className="_accountHeaderMainContainer">
                <IconAccount>
                <IconSwitch
                    icon={account?.currency?.currency}
                    size={isMovilViewport ? 25 : 35}
                />
                </IconAccount>
                <LabelContainer className="_header__labelContainer">
                <AccountLabel>{accountName || 'Mi billetera'}</AccountLabel>
                <CurrencyLabel>{currency?.symbol || '-'}</CurrencyLabel>
                </LabelContainer>
            </HeaderMainContainer>
            <Balance
                isMovilViewport={isMovilViewport}
                account={account}
                // account_id={id} 
                // available={available}
            />
        </ItemAccountContainer>
      )
}


export const Balance = ({ isMovilViewport, account:{ available, id, currency, currency_type } }) => {


    const [ currentAmount, setCurrentAmount ] = useState(available)

    useEffect(() => {
        if(isMovilViewport){
            let current_amount = formatToCurrency(available, currency);
            setCurrentAmount(current_amount.toFormat());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <>
            {
                isMovilViewport ?
                    <MobileBalance>
                        <HR/>
                        <p className="fuente2">{currency_type === 'fiat' ? '$ ' : ''}{currentAmount}</p>
                        <p className="fuente _balanceTextLab">Balance</p>
                    </MobileBalance>
                :
                <BalanceContainer  
                    className="_accountBalanceContainer"
                    // width={`${available?.length > 1 ? available?.length * 16 : '60' }px`}
                    width={`133px`}
                >
                    <HR/>
                    <BalanceComponent 
                        account_id={id} 
                    />
                </BalanceContainer>
            }
        </>
        
    )
}

export const MobileBalance = styled.div`
    display:grid;
    align-items: center;
    column-gap: 12px;

    grid-template-columns: 0 auto;
    grid-template-rows: auto auto;
    max-height: 60px;
    align-self: center;
    row-gap: 2px;


    p{
        margin:0;
        color:var(--paragraph_color);
    }
    ${HR}{
        align-self: center;
        grid-row-start: 1;
        grid-row-end: 3;
    }
    ._balanceTextLab{
        grid-column-start: 2;
        grid-column-end: 3;
        font-size: 14px;
        color: gray;
    }
    

` 




export const ListViewContainer = styled.div`
    display:grid;
    margin-bottom:50px;
    grid-template-columns: 1fr;
    grid-template-rows:repeat(auto-fill, minmax(70px, 100px));
    grid-template-rows:repeat(auto-fill, auto);
    row-gap:17px;
    height:auto;
    transition:.7s;

      &.loading{
        &::after{
            content: "";
            width: 100%;
            height: 100%;
            background: #f9f9fbb3;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            backdrop-filter: blur(5px);
        }
      } 

`


export const IndicatorHover = styled.div`
  border-radius: 50%;
  height: 20px;
  width: 20px;
  align-self: center;

    .indicator {
        background: #B3E1FF;
        transform: scale(0);
        transition: 0.3s;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .indicatorSon {
        transition: 0.5s;
        height: 10px;
        width: 10px;
        background: var(--primary);
        border-radius: 50%;
        transform: scale(0);
    }
`

export const ItemAccountContainer = styled.div`
    border-radius: 5px;
    cursor:pointer;
    height:100px;
    display: grid;
    grid-template-columns: auto auto 1fr;
    column-gap: 10px;
    background: white;
    border: 1px solid #E9E9E9;
    padding: 0 35px 0 20px;
    border-left:5px solid #E9E9E9;
    transition:.15s;

    &::after{
        content: "";
        width: 0%;
        height: 100%;
        position: absolute;
        background: #9999991a;
        transition:.5s;
    }

    &.loading{
        &::after{
            width: 95%;
        }
        position: relative;
        z-index: 2; 
        border-left:5px solid var(--primary);
        opacity: 1;
        .indicatorSon {
            transform: scale(0.85);
        }
        .indicator {
            transform: scale(0.85);
        }

    }

    ._accountBalanceContainer{
        max-height: 50px;
        height:auto;
        align-self: center;
        justify-self: end;
        column-gap:20px;
    }

    .textin{
        font-size:21px !important;
    }

    .BalanceComponent.wallet{
        row-gap: 3px;
        grid-template-areas:
        "displayCont displayCont"
        "balanceTitle balanceTitle";
    }

    ${HR}{
        height:35px;
    }

    &:hover{
        border-left:5px solid var(--primary);
        opacity: 1;
        .indicatorSon {
            transform: scale(0.85);
        }
        .indicator {
            transform: scale(0.85);
        }
    }


    @media ${device.mobile} {
        padding: 0 17px;
        grid-template-columns: auto 1fr;

        ${IndicatorHover}{
            display:none;
        }

        ._accountHeaderMainContainer{
            grid-template-columns: auto auto;
            min-width: auto;
        }
    }
`



