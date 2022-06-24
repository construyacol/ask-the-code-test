import styled from 'styled-components'
import loadable from "@loadable/component";
import withCoinsendaServices from "../withCoinsendaServices";
import { getCdnPath } from '../../environment'
import { useSelector } from "react-redux";
import { getAcronym } from '../../utils'
// import ScoresComponent from "../widgets/scores";
import { menuPrincipal } from "../api/ui/api.json";
import { ButtonPrincipalMenu } from "../widgets/buttons/buttons";
import { useActions } from '../../hooks/useActions'
import useViewport from '../../hooks/useWindowSize'
import { doLogout } from "../utils";
import { 
    MenuItemsContainer,
    SideMenuContainer,
    UserInfo,
    LogoCont,
    AcronymCont,
    UserName,
    LaptopSideMenuContainer,
    LaptopLogoContainer,
    // SideMenuWrapper
} from './styles'
import { useState } from 'react';



import { history } from '../../const/const'
import { createSelector } from "reselect";



function SideMenuComponent(props) {

  const actions = useActions()
  const Coinsenda = loadable(() => import("../widgets/icons/logos/coinsenda"));
  const { isLaptopViewport } = useViewport()
  const { current_section:{params:{show_menu_principal}} } = useSelector((state) => state.ui);
  const closeMenu = () => {
    actions.current_section_params({ show_menu_principal: false });
  }

  const logOut = () => {
    actions.confirmationModalToggle();
    actions.confirmationModalPayload({
      title: "Estás a punto de cerrar sesión...",
      description: "¿Estás seguro que deseas salir de Coinsenda?",
      txtPrimary: "Salir de Coinsenda",
      txtSecondary: "Quiero quedarme",
      action: doLogout,
      svg: "logout",
      type: "select_country",
    });
  };

  const activarItem = async (name, link) => {
    actions.section_view_to("initial");
    actions.CleanNotifications(name);
    // window.requestAnimationFrame(() => {
    //   scroller.scrollTo("firstInsideContainer", {
    //     duration: this.props.path === link ? 500 : 0,
    //     smooth: true,
    //     containerId: "containerElement",
    //     offset: -50
    //   });
    // });
  };

 
    return(
        <>
            {
                isLaptopViewport ? 
                <LaptopSideMenuContainer>
                    <LaptopLogoContainer>
                        <Coinsenda size={35} color="white"/>
                    </LaptopLogoContainer>
                    <MenuItemsComponent 
                        closeMenu={closeMenu}
                        actions={actions}
                        logOut={logOut}
                        activarItem={activarItem}
                        {...props} 
                    />
                </LaptopSideMenuContainer>
                :
                <SideMenuContainer className={`${show_menu_principal ? '_show' : '_hide'}`}>
                    <UserInfoComponent 
                        closeMenu={closeMenu}
                        actions={actions}
                        {...props} 
                    />
                    <MenuItemsComponent 
                        closeMenu={closeMenu}
                        actions={actions}
                        logOut={logOut}
                        activarItem={activarItem}
                        {...props} 
                    />
                </SideMenuContainer>
            }
        </>
    )
}

export default withCoinsendaServices(SideMenuComponent)


export const PopUpnotice = styled.div`
    width: 300px;
    height: 100px;
    background: white;
    position: absolute;
    left: 30px;
    bottom: 20px;
    border-radius: 4px;
    padding: 15px 20px;
    border: 1px solid #ededed;
    border-top: 4px solid var(--primary);
    div{
        width: 20px;
        height: 20px;
        background: #000000e3;
        position: absolute;
        top: -27px;
        right: 0;
        border-radius: 3px;
        display: flex;
        justify-items: center;
        color: white;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        cursor: pointer;
        z-index: 3;
    }
    p{
        color:var(--paragraph_color);
        font-size: 15px;
        line-height: 22px;
    }
    @media (max-width: 768px) {
        position: fixed;
        z-index: 3;
    }


`

export const selectAvaliableFiatWallet = createSelector(
    (state) => state.modelData.wallets,
    (wallets) => {
      if(!wallets)return ; 
      const fiatWalletId = Object.keys(wallets)?.find(walletId => {
        return ["fiat"].includes(wallets[walletId]?.currency_type)
      });
      return [ wallets[fiatWalletId] ]
    }
  );


const MenuItemsComponent = props => {

  const { keyActions, osDevice, verification_state } = useSelector((state) => state.ui);
  const logoutButtonText = window.innerWidth > 900 ? `Cerrar sesión ${keyActions ? '[ESC]' : ''}` : "Cerrar sesión";
  const { isMovilViewport, isLaptopViewport } = useViewport()
  const [ showMessage, setShowMessage ] = useState(false)

  const [ fiatWallet ] = useSelector((state) => selectAvaliableFiatWallet(state));

  const _showMessage = () => {
    setShowMessage(true)
  }

  const closeMessage = e => {
    setShowMessage(false)
  }

  const goToFiatWallet = () => {
    if(!fiatWallet)return;
    history.push(`/wallets/withdraw/${fiatWallet?.id}`)
    _showMessage()
  }


    return(
        <>
            {
                showMessage &&
                <PopUpnotice >
                    <div onClick={closeMessage}>X</div>
                    <p className="fuente">Ahora puedes gestionar tus cuentas de retiro en moneda local desde <strong>Billeteras > Mi billetera COP > Retirar</strong> </p>
                </PopUpnotice>
            }
            <MenuItemsContainer>
                <section className="section1">
                    {
                        isMovilViewport ?
                        <MovilMenuComponent 
                            actions={props.actions}
                            closeMenu={props.closeMenu}
                        />
                        :
                        menuPrincipal.map((item) => {
                            if (item.clave !== "security" && verification_state !== "accepted") { return false }
                            return (
                                <ButtonPrincipalMenu 
                                    className={`${item.device} ${isLaptopViewport ? 'laptopView' : ''}`}
                                    activarItem={props.activarItem}
                                    path={props?.match?.params?.primary_path}
                                    handleAction={goToFiatWallet}
                                    {...item}
                                    key={item.id}
                                />
                            );
                        })
                    }
                    <br />
            </section>

            <CloseButtonContainer 
                className={`fuente ${osDevice} ${isLaptopViewport ? 'laptopView' : ''}`}
                onClick={props.logOut}
            >
                <i className="fas fa-power-off"></i>
                <p className="fuente itemText">
                    {logoutButtonText}
                </p>
            </CloseButtonContainer>
            </MenuItemsContainer>
        </>
    )
}

const CloseButtonContainer = styled.div`
    font-size: 16px;
    color: #fb6257;
    display: flex;
    justify-content: center;
    cursor:pointer;

    height: 60px;
    display: flex;
    align-items: center;
    column-gap: 10px;
    transition:.3s;
    margin: 0 20px;

    &:hover{
        background: #0e1114;
    }
    &.laptopView{
        color: #ff3526bd;
        margin: 0 8px;
        border-radius: 4px;
        border:2px solid #ff3526bd;
        height: 50px;
        &:hover{
            color: white;
            background: #ff3526bd;
        }
        .itemText{
            display:none;
        }
    }

    p{
        margin:0;
    }

    &.ioSystem{
        position: absolute;
        bottom: 110px;
        left: 0;
        right: 0;
        margin: auto;
    }

`


const MovilMenuComponent = (props) => {

    const showPrices = async () => {
      const module = await import("../widgets/prices");
      if(!module)return;
      const PricesModal = module.default
      props.actions.renderModal(PricesModal);
      setTimeout(() => props.closeMenu(), 500) 
    };
  
    return (
          <MovilItemMenu className="movilItemMenu" onClick={() => showPrices()}>
                <i className="fas fa-tags"></i>
                <p className="menuMovilItemTexts fuente2 active">
                   Ver precios
                </p>
                <i className="fas fa-arrow-right"></i>
          </MovilItemMenu>
    );
};

const MovilItemMenu = styled.div`
    display:flex;
    height: 45px;
    min-height: 50px;
    width: auto;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 0 20px;
    column-gap: 10px;
    color: white;

`


const UserInfoComponent = props => {

  const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));
  const { verification_state } = useSelector((state) => state.ui);
  const { user  } = useSelector((state) => state.modelData);

    return(
        <UserInfo>
            <LogoCont>
                <img src={`${getCdnPath('assets')}logo.svg`} width={146} height={41} alt="logo" loading="lazy"/>
                <i className="fas fa-arrow-left" onClick={props.closeMenu}></i>
            </LogoCont>
            <AcronymCont>
                <div className={`perfilPic ${verification_state}`}>
                    <div className="fuente">
                    {!user?.name ? (
                        <IconSwitch icon="coinsenda" size={40} color="white" />
                    ) : (
                        <p className="fuente">{getAcronym(user?.name)}</p>
                    )}
                    </div>
                </div>
            </AcronymCont>
            <UserName className={`fuente ${user?.name ? '_capitalize' : ''}`}>
                <strong>
                    {user?.name || user?.email || 'Bienvenido'}
                </strong>
            </UserName>
            {/* <ScoresComponent/> */}
        </UserInfo>
    )
}


