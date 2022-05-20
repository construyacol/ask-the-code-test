import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useActions } from '../../hooks/useActions'
import useViewport from '../../hooks/useWindowSize'
import { useSelector } from "react-redux";
import { formatToCurrency } from "../../utils/convert_currency";
import useCurrencies from '../../hooks/useCurrencies'
import { OnlySkeletonAnimation } from '../widgets/loaders/skeleton'
import loadable from "@loadable/component";
import {
    MainMenuContainer
} from './styles'


export default function MainMenuComponent(props) {

    const Coinsenda = loadable(() => import("../widgets/icons/logos/coinsenda"));
    const { currentPair } = useSelector((state) => state.modelData.pairs);
    const [ state, setState ] = useState({ buy_price:null, sell_price:null, currencyLabel:"---" })
    const actions = useActions()
    const { isMovilViewport } = useViewport()
    const currencies = useCurrencies()

    const toggleMenu = () => {
        actions.current_section_params({ show_menu_principal: true });
    };

    const showPrices = async () => {
        const module = await import("../widgets/prices");
        if(!module)return;
        const PricesModal = module.default
        actions.renderModal(PricesModal);
    };


    const formatCurrency = async () => {
        let buyPrice = await formatToCurrency( currentPair.buy_price, currentPair.secondary_currency);
        let sellPrice = await formatToCurrency( currentPair.sell_price, currentPair.secondary_currency);
        let currencySymbol = currencies[currentPair?.primary_currency?.currency]?.symbol;
        setState(prevState => { 
            return {
                ...prevState,
                buy_price:buyPrice.toFormat(),
                sell_price:sellPrice.toFormat(),
                currencyLabel:currencySymbol
            }   
        })
      };

    useEffect(() => {
        if(currentPair){
            formatCurrency();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPair])
  

    return(
        <MainMenuContainer className="MenuSuperiorLayout">
            {
                !isMovilViewport ? 
                    <DesktopPriceComponent state={state}/>
                :
                    <MovilPriceComponent state={state}/>
            }

            {!isMovilViewport ? (
                <CtaViewPrice className="fuente" onClick={showPrices}>
                  <p>Ver precios</p>
                  <i className="fas fa-tags"></i>
                </CtaViewPrice>
              ) : (
                <>
                  <MovilLogoContainer>
                    <Coinsenda size={30} color="white"/>
                  </MovilLogoContainer>
                  <BurguerMenu
                    className="itemSup burgerMen"
                    onClick={toggleMenu}
                  >
                    <i className="fas fa-bars"></i>
                  </BurguerMenu>
                </>
              )}

        </MainMenuContainer>
    )
}

const MovilLogoContainer = styled.div`
    position:absolute;
    height: 100%;
    display: flex;
    align-items: center;
    left: 17px;
`

const MovilPriceComponent = ({ state }) => {

    const [ showBuyPrice, sethowPrice ] = useState(true)
    const toggleShowPrice = () => {
        sethowPrice(prevState => !prevState)
    }

    return(
        <PriceContainer className="mobile" onClick={toggleShowPrice}>
            {
                showBuyPrice ? 
                <LabelPrice className={`${!state.buy_price ? 'skeleton' : ''}`}>
                    <p className="fuente">TE COMPRAMOS <strong>{state?.currencyLabel}</strong> A</p>
                    <LabelPriceView 
                        price={state?.sell_price} 
                    />
                </LabelPrice>
                :
                <LabelPrice className={`${!state.buy_price ? 'skeleton' : ''}`}>
                    <p className="fuente">TE VENDEMOS <strong>{state?.currencyLabel}</strong> A</p>
                    <LabelPriceView 
                        price={state?.buy_price} 
                    />
                </LabelPrice>
            }
        </PriceContainer>
    )
}

const DesktopPriceComponent = ({ state }) => {
    return(
        <PriceContainer>
            <LabelPrice className={`${!state.buy_price ? 'skeleton' : ''}`}>
                <p className="fuente">TE COMPRAMOS <strong>{state?.currencyLabel}</strong> A</p>
                <LabelPriceView 
                    price={state?.sell_price} 
                />
            </LabelPrice>
            <Hr/>
            <LabelPrice className={`${!state.buy_price ? 'skeleton' : ''}`}>
                <p className="fuente">TE VENDEMOS <strong>{state?.currencyLabel}</strong> A</p>
                <LabelPriceView 
                    price={state?.buy_price} 
                />
            </LabelPrice>
        </PriceContainer>
    )
} 

const LabelPriceView = ({ price }) => {
    return(
        <h3>${price || '---,---,---'}</h3>
    )
}



const Hr = styled.div`
    height: 30px;
    width: 2px;
    margin: 0px 4em;
    background-color: rgb(255, 255, 255);
    border-radius: 4px;
    transform: rotate(10deg);
    margin: 0 10px;
`

const LabelPrice = styled.div`
    display:grid;
    grid-template-rows:auto 1fr;
    place-items:center;
    row-gap:5px;

    p{
        text-align: center;
        color:white;
        font-size:10px;
        width: max-content;
    }

    h3{
        text-align:center;
        font-weight: bold;
        font-size: 21px;
        font-family: Tomorrow;
        color: rgb(31, 228, 123);
    }

    p, h3{
        margin:0;
        letter-spacing: 4px;
    }

    &.skeleton{
        p{
            font-size:12px;
        }
        h3{
            width:100%;

        }
        p, h3{
            ${OnlySkeletonAnimation};
        }
    }
`

const BurguerMenu = styled.div`
    width: auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: .3s;
    cursor: pointer;
    color: #fff;
    font-size: 20px;
    position: absolute;
    right: 25px;
`

const CtaViewPrice = styled.div`
    width: auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: .3s;
    cursor: pointer;
    color: #fff;
    font-size: 16px;
    column-gap:10px;
    right: 25px;
    position: absolute;
`

const PriceContainer = styled.div`
    width:auto;
    max-width:400px;
    height:100%;
    display:grid;
    grid-template-rows:1fr;
    grid-template-columns:1fr auto 1fr;
    place-items: center;
    column-gap: 10px;
    &.mobile{
       grid-template-columns:1fr;
    }
`