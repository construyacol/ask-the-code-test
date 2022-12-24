import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useActions } from '../../hooks/useActions'
import useViewport from '../../hooks/useWindowSize'
import { useSelector } from "react-redux";
import { formatToCurrency } from "../../utils/convert_currency";
import useCurrencies from '../../hooks/useCurrencies'
import { OnlySkeletonAnimation } from '../widgets/loaders/skeleton'
import loadable from "@loadable/component";
import { Link } from "react-router-dom";
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
    const { params } = props.match 

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
        let currencySymbol = currencies[currentPair?.primary_currency]?.symbol;

        console.log('buyPrice', buyPrice)
        console.log('sellPrice', sellPrice)

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
                    <MovilPriceComponent state={state} actions={actions}/>
            }

            {!isMovilViewport ? (
                <CtaViewPrice className="fuente" onClick={showPrices}>
                  <p>Ver precios</p>
                  <i className="fas fa-tags"></i>
                </CtaViewPrice>
              ) : (
                <>
                  <ControlContainer className="_movilLogoContainer">
                    <Container className={`_controlLogoContainer ${params?.path ? 'availableBackButtom' : ''}`}>
                        <LogoContainer>
                           <Coinsenda size={30} color="white"/>
                        </LogoContainer>
                        <BackButtom>
                            <Link
                            to={`/${params?.primary_path === "referral" ? "wallets" : params?.primary_path}`}
                            className="DCBack"
                            aria-label="back"
                            // style={{ display: view === "detail" ? "" : "none" }}
                            // onClick={back_method}
                            >
                            <i className="fas fa-arrow-left"></i>
                        </Link>
                        </BackButtom>
                    </Container>
                  </ControlContainer>
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

const BackButtom = styled.div`
    display:flex;
    align-items:center;
    a{
        color: white;
        text-decoration: none;
        font-size: 20px;
    }

`

const LogoContainer = styled.div`
    display:flex;
    place-items: center;
`

const Container = styled.div`
    position:absolute;
    height:200%;
    width:35px;
    top:0;
    display:grid;
    grid-template-rows:1fr 1fr;
    transition:.3s;

    &.availableBackButtom{
        top:-100%;
    }
`

const ControlContainer = styled.div`
    position:absolute;
    height: 100%;
    min-width:40px;
    display: flex;
    align-items: center;
    left: 17px;
    overflow:hidden;
`

const MovilPriceComponent = ({ state, actions }) => {

    const [ showBuyPrice ] = useState(false)
    // const toggleShowPrice = () => {
    //     sethowPrice(prevState => !prevState)
    // }

    const showPrices = async () => {
        const module = await import("../widgets/prices");
        if(!module)return;
        const PricesModal = module.default
        actions.renderModal(PricesModal);
        // setTimeout(() => props.closeMenu(), 500) 
      };

    return(
        <PriceContainer className="mobile" onClick={showPrices}>
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