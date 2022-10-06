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
import { OnlySkeletonAnimation } from '../loaders/skeleton'
import TitleSection from '../titleSectionComponent'
import { AccountListWrapper } from '../layoutStyles'
import { BiRightArrowAlt } from 'react-icons/bi';

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



export const AccountListViewSkeleton = ({ skeletonAmount = 3 }) => {

    const itemList = new Array(skeletonAmount).fill({}) 

    return(
        <AccountListWrapper>
            <TitleSection skeleton />
            <ListViewContainer>
                {
                    itemList.map((item, index) => {
                        return(
                            <ItemAccountContainer key={index} className="skeleton">
                                <HeaderMainContainer>
                                        <IconAccount className="_iconSkeleton"></IconAccount>
                                        <LabelContainer className="_header__labelContainer">
                                        <AccountLabel>Skeleton wallet</AccountLabel>
                                        <CurrencyLabel>------</CurrencyLabel>
                                    </LabelContainer>
                                </HeaderMainContainer>
                                <MobileBalance className="skeletonBalanceCont">
                                    <HR/>
                                    <p className="fuente2 _balanceValue">000000</p>
                                    <p className="fuente _balanceTextLab">Balance</p>
                                </MobileBalance>
                            </ItemAccountContainer>
                        )
                    })
                }
            </ListViewContainer>
        </AccountListWrapper>
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
        await actions.update_item_state({ [account.id]: { ...account, count } }, "wallets");
        if(count < 1){
          let areThereDeposits = await coinsendaServices.getDepositByAccountId(account.id);
          if (areThereDeposits && areThereDeposits.length){
            actions.update_item_state({ [ account.id ]:{ ...account, count: 1 } }, "wallets"); //actualiza el movimiento operacional de la wallet
            return history.push(`/wallets/activity/${account.id}/deposits`);
          }
          return history.push(`/wallets/deposit/${account.id}`);
        }
        return history.push(`/wallets/activity/${account.id}/${currentFilter ? currentFilter : "deposits"}`);
    };

    const toDetail = () => {
        if (account.count === undefined) return getAccountTransactions();
        if (account.count < 1) return history.push(`/wallets/deposit/${account.id}`);
        return history.push(`/wallets/activity/${account.id}/${currentFilter ? currentFilter : "deposits"}`);
    }

    // const accountName = isMovilViewport ? `Billetera ${currency?.symbol || "-"}` : account?.name
    const accountName = account?.name

    return(
        <ItemAccountContainer onClick={loading ? null : toDetail} className={`${(loading && currentAccount) ? 'loading' : ''}`}>
            <IndicatorHover>
                <div className="indicator" >
                    <div className="indicatorSon" ></div>
                </div>
            </IndicatorHover>
            <HeaderMainContainer className="_accountHeaderMainContainer">
                <IconAccount className="onAccountList">
                    <IconSwitch
                        icon={account?.currency?.currency}
                        size={isMovilViewport ? 30 : 35}
                    />
                </IconAccount>
                <LabelContainer className="_header__labelContainer">
                    <AccountLabel>{accountName || 'Mi billetera'}</AccountLabel>
                    {
                        isMovilViewport ?
                            <MobileBalanceComponent
                                account={account}
                            />
                        :
                        <CurrencyLabel>{currency?.symbol || '-'}</CurrencyLabel>
                    }
                </LabelContainer> 
            </HeaderMainContainer>
            <RightSection
                isMovilViewport={isMovilViewport}
                account={account}
            />
        </ItemAccountContainer>
    )
}


const MobileBalanceComponent = ({ account }) => {

    const { balances } = useSelector((state) => state.modelData);
    const currentBalance = balances[account?.id]?.available
    const [ currentAmount, setCurrentAmount ] = useState(currentBalance);

    useEffect(() => {
        console.log('||||||||  currentBalance  ===> ', currentBalance)
        let current_amount = formatToCurrency(currentBalance, account?.currency);
        setCurrentAmount(current_amount.toFormat());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <MobileBalanceContainer className="fuente2">
            {`${["fiat"].includes(account?.currency_type) ? '$ ' : ''} ${currentAmount}`}
        </MobileBalanceContainer>
    )
}

const MobileBalanceContainer = styled.p`
    margin:0;
    color:#afafaf;
    display:none;
    @media ${device.mobile} {
       display:initial;
    }
`

// BiRightArrowAlt

export const RightSection = ({ isMovilViewport, account:{ id } }) => {

    // <MobileBalance>
    //     <HR/>
    //     <p className="fuente2">{currency_type === 'fiat' ? '$ ' : ''}{currentAmount}</p>
    //     <p className="fuente _balanceTextLab">Balance</p>
    // </MobileBalance>

    return(
        <>
            {
                isMovilViewport ?
                    <BiRightArrowAlt className="_enterToWalletIcon" size={34} />
                :
                    <BalanceContainer  
                        className="_accountBalanceContainer"
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
    max-width: var(--maxwsections);
    justify-self: center;
    width: 100%;

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

    &.isActive{
        .indicator,
        .indicatorSon {
            transform: scale(.8);
        }
    }

    @media ${device.mobile} {
        display:none;
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

    ._enterToWalletIcon{
        fill: var(--paragraph_color);
        align-self: center;
        justify-self: end;
        opacity: 1;
    }

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


    &.skeleton{
        grid-template-columns: auto 1fr;

        ._header__labelContainer,
        .skeletonBalanceCont{
            row-gap:5px;
        }

        &:hover{
            border-left:5px solid #E9E9E9;
        }

        ._iconSkeleton,
        p{
            ${OnlySkeletonAnimation}
        }

        ._iconSkeleton{
            background:var(--skeleton_color);
            border:none;
        }

        p{
            background:var(--skeleton_color);
            color:var(--skeleton_color);
            width:fit-content;
            border-radius:4px;
            font-size:17px;
        }

        ${CurrencyLabel},
        ._balanceTextLab{
            font-size:12px;
        }

        ${MobileBalance}{
            justify-self: end;
        }

        ${AccountLabel},
        ._balanceValue{
            font-size:17px;
        }

    }


    @media ${device.mobile} {
        padding: 0 17px; 
        grid-template-columns: auto 1fr;
        ._accountHeaderMainContainer{
            grid-template-columns: auto auto;
            min-width: auto;
        }
    }
`



