import styled from 'styled-components'
import loadable from "@loadable/component";
import { device } from '../../const/const'
import withCoinsendaServices from "../withCoinsendaServices";
import { getCdnPath } from '../../environment'
import { useSelector } from "react-redux";
import { getAcronym } from '../../utils'
import ScoresComponent from "../widgets/scores";
import { menuPrincipal } from "../api/ui/api.json";
import { ButtonPrincipalMenu } from "../widgets/buttons/buttons";
import { useActions } from '../../hooks/useActions'
import useViewport from '../../hooks/useWindowSize'
import { doLogout } from "../utils";


function SideMenuComponent(props) {

  const actions = useActions()

  const { show_menu_principal } = useSelector((state) => state.ui.current_section.params);

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

    return(
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
                {...props} 
            />
        </SideMenuContainer>
    )
}

export default withCoinsendaServices(SideMenuComponent)




const MenuItemsComponent = props => {

  const { keyActions, osDevice, verification_state } = useSelector((state) => state.ui);
  const logoutButtonText = window.innerWidth > 900 ? `Cerrar sesión ${keyActions ? '[ESC]' : ''}` : "Cerrar sesión";
  const { isMovilViewport } = useViewport()

  const activarItem = async (name, link) => {
    props.actions.section_view_to("initial");
    props.actions.CleanNotifications(name);
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
                                className={`${item.device}`}
                                activarItem={activarItem}
                                path={props?.match?.params?.primary_path}
                                {...item}
                                key={item.id}
                            />
                        );
                    })
                }
                <br />
          </section>
          <section className={`section2 movil ${osDevice}`}>
            <div
                // id={idForLogoutButton}
                className={`menuMovilItems close`}
                onClick={props.logOut}
            >
                <p className="menuMovilItemTexts close fuente">
                    {logoutButtonText}
                <i className="fas fa-power-off"></i>
                </p>
            </div>
          </section>
        </MenuItemsContainer>
    )
}



const MovilMenuComponent = (props) => {
    const showPrices = async () => {
      const module = await import("../widgets/prices");
      if(!module)return;
      const PricesModal = module.default
      props.actions.renderModal(PricesModal);
      setTimeout(() => props.closeMenu(), 500) 
      // debugger
    };
  
    return (
      <div className="MovilMenuComponent">
          <>
            <div className="menuMovilItems active" onClick={() => showPrices()}>
                <p className="menuMovilItemTexts fuente active">
                  <i className="fas fa-tags"></i> Ver precios
                </p>
                <i className="fas fa-arrow-right"></i>
            </div>
          </>
      </div>
    );
  };



const MenuItemsContainer = styled.div`
    background: linear-gradient(to bottom right,#2b3742,#101418);
    box-shadow: 0 1px 14px -2px rgb(0 0 0 / 75%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 14px;
    ${'' /* font-weight: bold; */}
    padding: 15px 0;

    @media ${device.mobile} {
       a.desktop{
           display:none;
       }
    }

    @media ${device.desktop} {
       a.mobile{
           display:none;
       }
    }

    
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
            <ScoresComponent/>
        </UserInfo>
    )
}

const UserName = styled.p`
    margin:0 0 10px;
    &._capitalize{
        text-transform: capitalize;
    }
`

const AcronymCont = styled.div`
    position:relative;
    padding-top: 15px;
    .perfilPic{
        width: 62px;
        height: 62px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 10px;
        background: #0198ff;
        display: grid;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 14px -2px rgb(0 0 0 / 30%);
    }
`

const LogoCont = styled.div`
    padding-left: 22px;
    display: grid;
    align-items: center;
    justify-self: flex-start;
    i {
      display: none;
    }

    @media ${device.mobile} {
        img{
            display:none;
        }
        i{
            display: initial;
            color: #fff;
            font-size: 20px;
            margin-left: 5px;
        }
    }

`

const UserInfo = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows:60px;
    grid-auto-rows: auto;
    justify-items: center;
    row-gap: 7px;
    background: linear-gradient(to bottom right,#2b3742,#151b20);
    padding-bottom: 15px;
    p{
        color:white;
    }
`

const SideMenuContainer = styled.section`
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 3;
  min-width: 280px;
  background: linear-gradient(to bottom right,#2b3742,#101418);
  display:grid;
  grid-template-rows:auto 1fr;

  @media ${device.mobile} {
    transition:.3s;
    position: absolute;
    height: 100vh;
    width: 100vw;
    top:0;
    z-index: 2;
    &._show{
        left: 0;
    }
    &._hide{
        left: -101vw;
    }
  }
`
