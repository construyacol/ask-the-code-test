
import styled from 'styled-components'
import { device } from 'const/const'
import { useSelector } from "react-redux";
import menuItems from "api/ui/menuItems";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import loadable from "@loadable/component";
import { useActions } from 'hooks/useActions'
import { P } from 'core/components/atoms'



export default function MobileMenuComponent(props) {

    const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));
    const PopNotification = loadable(() => import("../widgets/notifications"));
    const { osDevice, verification_state } = useSelector((state) => state?.ui);
    const params = useParams()
    const actions = useActions()
    const { menuPrincipal } = menuItems

    const selectItem = itemName => {
        actions.CleanNotifications(itemName);
    }

    console.log('menuPrincipal', menuPrincipal)

    return(
        <>      
            {
                !params.path &&
                    <MobileMenu className={`${osDevice}`}>
                        {
                            menuPrincipal.map((item) => {
                                if (item.clave !== "settings" && verification_state !== "accepted") { return null }
                                if (item.clave === "prices") { return null }
                                if (item.clave === "withdraw_accounts") { return null }

                                return (
                                    <MenuItem
                                        key={item.id}
                                        className={`item_${item.clave} ${params?.primary_path === item?.clave ? "_active" : ""}`}
                                        onClick={() => selectItem(item.clave)}
                                    >
                                        <Link to={`/${item.clave}`}>
                                            <div className={`text ${params?.primary_path === item?.clave ? "activate" : ""}`}>
                                                <div className="iconButtCont">
                                                    <IconSwitch
                                                        icon={item?.icon}
                                                        size={25}
                                                        color={`${params?.primary_path === item?.clave ? "var(--primary)" : "gray"}`}
                                                    /> 
                                                    <P className="no-margin">{item.text}</P>
                                                    <PopNotification notifier={item?.clave} />
                                                </div>
                                            </div>
                                        </Link>
                                    </MenuItem>
                                );
                            })
                        }
                    </MobileMenu>
            }
        </>
    )
}



// <ButtonPrincipalMenu
//     className={`${item.device} ${isLaptopViewport ? 'laptopView' : ''}`}
//     activarItem={props.activarItem}
//     path={props?.match?.params?.primary_path}
//     {...item}
//     key={item.id}
// />

const MenuItem = styled.div`
    display:flex;
    place-items: center;
    width: 100%;
    display: flex;
    place-content: center;
    
    &._active{
        border-top: 2px solid var(--primary);
        background: #f9f9fb;
        p{
            display:none;
        }
    }

    .iconButtCont{
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap:4px;
        p{
            font-size: 10px;
        }
    }
    a{
        text-decoration: none;
    }
    
`

const MobileMenu = styled.menu`
    margin: 0;
    height: 50px;
    padding: 0;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    position: sticky;
    display:none;
    place-content: center;
    justify-content: space-around;
    z-index:3;
    top:60px;
    backdrop-filter: blur(5px);
    background: #e7e7e7db;
    
    
    @media ${device.mobile} {
      display: flex;
      &.ioSystem{
         ${'' /* margin-bottom:80px; */}
         ${'' /* bottom:80px  */}
      }
    }

`