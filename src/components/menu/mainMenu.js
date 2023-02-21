import { useEffect, useState } from 'react'
import { useActions } from '../../hooks/useActions'
import useViewport from '../../hooks/useWindowSize'
import { useSelector } from "react-redux";
import { formatToCurrency } from "../../utils/convert_currency";
import useCurrencies from '../../hooks/useCurrencies'
import loadable from "@loadable/component";
import { Link } from "react-router-dom";
import { MainMenuContainer } from './styles'
import styled from 'styled-components'
import { DesktopPriceComponent, MovilPriceComponent } from 'components/widgets/priceDisplayMenu'
import UserOptionsMenu from 'components/widgets/userOptionsMenu'
 

export default function MainMenuComponent(props) {

    const Coinsenda = loadable(() => import("../widgets/icons/logos/coinsenda"));
    const { currentPair, local_collections } = useSelector((state) => state.modelData.pairs);
    const [ state, setState ] = useState({ buy_price:null, sell_price:null, currencyLabel:"---" })
    const actions = useActions()
    const { isMovilViewport } = useViewport()
    const currencies = useCurrencies()
    const { params } = props.match 

    const toggleMenu = () => {
        actions.current_section_params({ show_menu_principal: true });
    };

    const formatCurrency = async () => {
        let buyPrice = await formatToCurrency( currentPair.buy_price, currentPair.secondary_currency);
        let sellPrice = await formatToCurrency( currentPair.sell_price, currentPair.secondary_currency);
        let currencySymbol = currencies[currentPair?.primary_currency]?.symbol;
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
        if (currentPair) {
            formatCurrency();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPair])

    return(
        <MainMenuContainer className="MenuSuperiorLayout">
            {
                !isMovilViewport ? 
                    <DesktopPriceComponent state={state} actions={actions} local_collections={local_collections}/>
                :
                    <MovilPriceComponent state={state} actions={actions}/>
            }
            {!isMovilViewport ? (
                <UserOptionsMenu actions={actions}/>
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