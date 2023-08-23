import { useEffect, useState } from 'react';
import { SubMenu } from './styles'
// import { styled } from 'styled-components'
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import loadable from "@loadable/component";
import { isSafari } from '../../utils'
import menuItems from "api/ui/menuItems";



const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));

export default function SubMenuComponent({ targetList, accountSwapAvailable }) {

    const { navigation_components } = menuItems
    const { currentFilter } = useSelector((state) => state?.ui?.current_section?.params);
    const { wallets } = useSelector((state) => state?.modelData);
    const { activity_for_account } = useSelector((state) => state?.storage);
    const { account_id, primary_path, path } = useParams()
    const itemsMenu = navigation_components[targetList]?.items_menu
    const [ accountHasTx, setAccountHasTx ] = useState(false)
    
    useEffect(() => {
        if(wallets[account_id]?.count > 0 || activity_for_account[account_id]){
            setAccountHasTx(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallets[account_id], activity_for_account]) 

    const getLink = (link) => `/${primary_path}/${link}/${account_id}${link === "activity" ? `/${currentFilter}` : ""}`;

    return(
        <SubMenu className="subMenu">
            {
                itemsMenu?.length &&
                    itemsMenu.map((item, index) => {
                        
                        if ((item.link === "activity") &&  primary_path === "wallets" && (!accountHasTx))return null;
                        if ((item.link === "swap") &&  primary_path === "wallets" && (!accountSwapAvailable))return null;
                        
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
