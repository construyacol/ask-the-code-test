
import styled from 'styled-components'
import { device } from '../../const/const'
import { useSelector } from "react-redux";
import { menuPrincipal } from "../api/ui/api.json";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import loadable from "@loadable/component";
import { useState } from 'react' 

import { history } from '../../const/const'
import { selectAvaliableFiatWallet, PopUpnotice } from './sideMenu'

export default function MobileMenuComponent() {

    const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));
    const PopNotification = loadable(() => import("../widgets/notifications"));
    const { osDevice, verification_state } = useSelector((state) => state?.ui);
    const params = useParams()



    const [ showMessage, setShowMessage ] = useState(false)
    const [ fiatWallet ] = useSelector((state) => selectAvaliableFiatWallet(state));
    const goToFiatWallet = () => {
        if(!fiatWallet)return;
        history.push(`/wallets/withdraw/${fiatWallet?.id}`)
        _showMessage()
    }
    const _showMessage = () => {
        setShowMessage(true)
    }

    const closeMessage = e => {
        setShowMessage(false)
    }

    return(
        <>      {
                    showMessage &&
                        <PopUpnotice >
                            <div onClick={closeMessage}>X</div>
                            <p className="fuente">Ahora puedes gestionar tus cuentas de retiro en moneda local desde <strong>Billeteras > Mi billetera COP > Retirar</strong> </p>
                        </PopUpnotice>
                }

            {
                !params.path &&
                    <MobileMenu className={`${osDevice}`}>
                        {
                            menuPrincipal.map((item) => {
                                    if (item.clave !== "security" && verification_state !== "accepted") { return null }
                                    if (item.clave === "prices") { return null }

                                    const Wrapper = ["withdraw_accounts"].includes(item.clave) ? "div" : Link
                                    const toWithdrawAccounts = ["withdraw_accounts"].includes(item.clave) && goToFiatWallet

                                    return (
                                        <MenuItem
                                            key={item.id}
                                            className={`item_${item.clave} ${params?.primary_path === item?.clave ? "_active" : ""}`}
                                        >
                                        
                                            <Wrapper to={`/${item.clave}`} onClick={toWithdrawAccounts}>
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
                                            </Wrapper>
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
    z-index:2;
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