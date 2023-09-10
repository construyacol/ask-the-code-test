import { useState } from 'react'
import styled from 'styled-components'
import loadable from "@loadable/component";
import withCoinsendaServices from "../withCoinsendaServices";
import { getCdnPath } from '../../environment'
import { useSelector } from "react-redux";
import { getAcronym } from '../../utils'
import { ButtonPrincipalMenu } from "../widgets/buttons/buttons";
import { useActions } from '../../hooks/useActions'
import useViewport from '../../hooks/useWindowSize'
import { doLogout } from "utils/handleSession";
import { 
    MenuItemsContainer,
    SideMenuContainer,
    ControlExpand,
    UserInfo,
    LogoCont,
    AcronymCont,
    UserName,
    LaptopLogoContainer,
    UserNameContainer
    // LaptopSideMenuContainer,
    // SideMenuWrapper
} from './styles'
import menuItems from "api/ui/menuItems";
import { AVAILABLE_USER_EMAILS } from 'const/bitrefill'

import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";


function SideMobileMenu({ actions, logOut, user }) {

    const { current_section:{ params:{ show_menu_principal } } } = useSelector((state) => state.ui);
    const closeMenu = () => { actions.current_section_params({ show_menu_principal: false })}
    const { osDevice } = useSelector((state) => state.ui);


    return(
        <SideMenuContainer className={`${show_menu_principal ? '_show' : '_hide'}`}>
            <UserInfoComponent 
                closeMenu={closeMenu}
                actions={actions}
                user={user}
            />
            <MenuItemsContainer>
                <MovilMenuComponent 
                    actions={actions}
                    closeMenu={closeMenu}
                />
            </MenuItemsContainer>
            <CloseButtonContainer 
                className={`fuente ${osDevice}`}
                onClick={logOut}
            >
                <i className="fas fa-power-off"></i>
                <p className="fuente itemText">
                    Salir de Coinsenda
                </p>
            </CloseButtonContainer>
        </SideMenuContainer>
    )
}



function SideMenuComponent(props) {

  const actions = useActions()
  const [ isExpanded, setIsExpanded ] = useState(true)
  const Coinsenda = loadable(() => import("../widgets/icons/logos/coinsenda"));
  const { isLaptopViewport, isMovilViewport } = useViewport()
  const { user  } = useSelector((state) => state.modelData);


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
  };

  const SideIcon = isExpanded ? IoIosArrowBack : IoIosArrowForward 
  

    return(
        <>
            {
                isMovilViewport ?
                <SideMobileMenu user={user} logOut={logOut} actions={actions}/>
                :
                <SideMenuContainer className={`${(isLaptopViewport || !isExpanded) ? 'laptopView'  : 'largeLayout'}`}>
                    {
                        !isLaptopViewport &&
                        <ControlExpand onClick={() => setIsExpanded(e => !e)}>
                            <SideIcon
                                size={15}
                            />
                        </ControlExpand>
                    }
                    {
                        (isLaptopViewport || !isExpanded) ?
                        <LaptopLogoContainer>
                            <Coinsenda size={35} color="white"/>
                        </LaptopLogoContainer>
                        :
                        <img src={`${getCdnPath('assets')}logo.svg`} height={35} alt="logo" loading="lazy"/>
                    }
                    <MenuItemsComponent 
                        actions={actions}
                        logOut={logOut}
                        activarItem={activarItem}
                        isExpanded={isExpanded}
                        user={user}
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


const MenuItemsComponent = props => {

  const { isLaptopViewport } = useViewport()
  const { menuPrincipal } = menuItems 
  const { verification_state } = useSelector((state) => state.ui);
  const { user } = props

    return( 
        <>  
            <MenuItemsContainer className={`${(!props.isExpanded || isLaptopViewport) ? '' : 'largeLayout'} ${verification_state !== "accepted" ? 'inverified' : ''}`}>
                    {
                        menuPrincipal.map((item) => { 
                             if (item.clave !== "settings" && verification_state !== "accepted") { return false }
                             if (item.clave === "store" && !AVAILABLE_USER_EMAILS.includes(user?.email)) { return null }
                             if (item.clave === "withdraw_accounts") { return null }
                            return (
                                <ButtonPrincipalMenu 
                                    className={`${item.device} ${item.clave} ${(isLaptopViewport || !props.isExpanded) ? 'laptopView' : ''}`}
                                    activarItem={props.activarItem}
                                    path={props?.match?.params?.primary_path}
                                    // handleAction={goToFiatWallet}
                                    {...item}
                                    key={item.id}
                                />
                            );
                        })
                    }
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

const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));

const UserInfoComponent = props => {

    const { verification_state } = useSelector((state) => state.ui);
    const { user } = props

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
                        <p className="fuente acronym__p">{getAcronym(user?.name)}</p>
                    )}
                    </div>
                </div>

                <UserNameContainer>
                    <UserName className={`fuente ${user?.name ? '_capitalize' : ''}`}>
                        <strong>
                            {user?.name || 'Bienvenido'}
                        </strong>
                    </UserName>
                    <p className="user_name__p">{user?.email}</p>
                </UserNameContainer>
                
            </AcronymCont>

            

            {/* <ScoresComponent/> */}

        </UserInfo>
    )
}


 