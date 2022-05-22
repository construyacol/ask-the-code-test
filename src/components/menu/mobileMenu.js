import styled from 'styled-components'
import { device } from '../../const/const'
import { useSelector } from "react-redux";
import { menuPrincipal } from "../api/ui/api.json";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import loadable from "@loadable/component";


export default function MobileMenuComponent() {

    const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));
    const PopNotification = loadable(() => import("../widgets/notifications"));
    const { osDevice, verification_state } = useSelector((state) => state?.ui);
    const params = useParams()

    return(
        <MobileMenu className={`${osDevice}`}>
            {
                menuPrincipal.map((item) => {
                        if (item.clave !== "security" && verification_state !== "accepted") { return null }
                        if (item.clave === "prices") { return null }
                        return (
                            <MenuItem
                                key={item.id}
                                className={`item_${item.clave} ${params?.primary_path === item?.clave ? "_active" : ""}`}
                            >
                                <Link to={`/${item.clave}`}>
                                    <div className={`text ${params?.primary_path === item?.clave ? "activate" : ""}`}>
                                        <div className="iconButtCont">
                                            <IconSwitch
                                                icon={item?.icon}
                                                size={25}
                                                color={`${params?.primary_path === item?.clave ? "var(--primary)" : "gray"}`}
                                            />
                                            <PopNotification notifier={item?.clave} />
                                        </div>
                                    </div>
                                </Link>
                            </MenuItem>
                        );
                    })
            }
        </MobileMenu>
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
    padding: 0 25px;
    
    &._active{
        border-top: 2px solid var(--primary);
        background: #f9f9fb;
    }
`

const MobileMenu = styled.menu`
    margin: 0;
    height: 50px;
    background: #e7e7e7;
    padding: 0;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    bottom: 0;
    position: sticky;
    display:none;
    place-content: center;
    justify-content: space-around;
    z-index:2;
    
    @media ${device.mobile} {
      display: flex;
      &.ioSystem{
         margin-bottom:80px;
         bottom:80px 
      }
      margin-bottom:40px;
    }

`