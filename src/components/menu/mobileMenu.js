
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
import useToastMessage from "../../hooks/useToastMessage";
import { useCoinsendaServices } from "../../services/useCoinsendaServices";
import { useActions } from "../../hooks/useActions";

export default function MobileMenuComponent(props) {

    const IconSwitch = loadable(() => import("../widgets/icons/iconSwitch"));
    const PopNotification = loadable(() => import("../widgets/notifications"));
    const { osDevice, verification_state } = useSelector((state) => state?.ui);
    const params = useParams()


    const actions = useActions();
    const [ showMessage, setShowMessage ] = useState(false)
    const [ fiatWallet ] = useSelector((state) => selectAvaliableFiatWallet(state));
    const [ coinsendaServices ] = useCoinsendaServices();
    const [toastMessage] = useToastMessage();


    const goToFiatWallet = async() => {
        if(!fiatWallet)return;
        let count = fiatWallet?.count
        if(!fiatWallet?.count){
          const countAccount = await coinsendaServices.countOfAccountTransactions(fiatWallet.id);
          await actions.update_item_state({ [fiatWallet.id]: { ...fiatWallet, count } }, "wallets");
    
          count = countAccount?.count;
          if(count < 1){
            let areThereDeposits = await coinsendaServices.getDepositByAccountId(fiatWallet.id);
            if (areThereDeposits?.length){
                await actions.update_item_state({ [fiatWallet.id]: { ...fiatWallet, count:1 } }, "wallets");
                count++
            }
          }
        }
        
        history.push(`/wallets/${count>0 ? 'withdraw' : 'deposit' }/${fiatWallet?.id}`)
        if(count > 0){
            _showMessage()
        }else{
            toastMessage("Primero crea un depósito")
        }
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