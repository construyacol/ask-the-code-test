import { SubMenu } from './styles'
// import { styled } from 'styled-components'
import { navigation_components } from "../api/ui/api.json"; 
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import loadable from "@loadable/component";
import { isSafari } from '../../utils'


export default function SubMenuComponent({ targetList }) {

    const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));
    const { currentFilter } = useSelector((state) => state?.ui?.current_section?.params);
    const { wallets } = useSelector((state) => state?.modelData);
    const { account_id, primary_path, path } = useParams()
    const itemsMenu = navigation_components[targetList]?.items_menu
    // console.log('SubMenuComponent', itemsMenu)
    // console.log('wallets', wallets)
    // console.log('account_id', account_id)


    const getLink = (link) => `/${primary_path}/${link}/${account_id}${link === "activity" ? `/${currentFilter}` : ""}`;

    
    return(
        <SubMenu className="subMenu">
            {
                itemsMenu?.length &&
                    itemsMenu.map((item, index) => {
                        if (
                            (item.link === "activity" || item.link === "withdraw" || item.link === "swap") && 
                            primary_path === "wallets" && 
                            (!wallets[account_id]?.count || wallets[account_id]?.count < 1))return null;
                        return(
                            <NavLink
                                key={index}
                                id={`${item.link}-menu-button`}
                                to={getLink(item.link)}
                                className={`menuItem ${isSafari()} ${path === item.link ? "active" : ""}`}
                                >
                                    <div className={`menuMovilIcon ${isSafari()} ${path === item.link ? "active" : ""}`}>
                                        <IconSwitch size={20} icon={item.link} color={`${(isSafari() && path === item.link) ? 'var(--primary)' : isSafari() ? 'gray' : 'var(--primary)'}`} />
                                    </div>
                                    <p className="fuente">{item.title}</p>
                            </NavLink>
                        )
                        
                    })
            }
        </SubMenu>
    )

}
