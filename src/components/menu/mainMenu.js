import styled from 'styled-components'
import {
    MainMenuContainer
} from './styles'
import { useActions } from '../../hooks/useActions'
import useViewport from '../../hooks/useWindowSize'


export default function MainMenuComponent(props) {

    const actions = useActions()
    const { isMovilViewport } = useViewport()

    const toggleMenu = () => {
        actions.current_section_params({ show_menu_principal: true });
    };

    const showPrices = async () => {
        const module = await import("../widgets/prices");
        if(!module)return;
        const PricesModal = module.default
        actions.renderModal(PricesModal);
    };

    return(
        <MainMenuContainer>

            <PriceContainer>

            </PriceContainer>

            {!isMovilViewport ? (
                <CtaViewPrice className="fuente" onClick={showPrices}>
                  <p>Ver precios</p>
                  <i className="fas fa-tags"></i>
                </CtaViewPrice>
              ) : (
                <>
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
    width:100%;
    max-width:400px;
    height:100%;
    background:yellow;
    display:none;
`