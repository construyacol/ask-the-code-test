import { useRef, useState, useCallback } from 'react'
import styled from 'styled-components'
import { 
    UserOptionPic,
    WrapperAsolute,
    WrapperContainer,
    TriggerButton,
    PopUpLayout
} from './styles'
import { getAcronym } from 'utils'
import 'reactjs-popup/dist/index.css';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md"
import { P } from 'components/widgets/typography'
import loadable from "@loadable/component";
import { useSelector } from "react-redux";
import { IoMailOutline } from "react-icons/io5";
import { copy } from 'utils'
import { MdOutlineContentCopy } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineArrowRight } from "react-icons/ai";
import { history } from 'const/const'
import { doLogout } from "utils/handleSession";


const IconSwitch = loadable(() => import("components/widgets/icons/iconSwitch"));

const UserOptionsMenu = (props) => {
    const ref = useRef();
    const [ open, setOpen ] = useState(false)
    const { user  } = useSelector((state) => state.modelData);

    const toggleTooltip = useCallback(() => {
        ref?.current?.toggle()
        setOpen(o => !o)
    }, [])

    const closePopUp = useCallback(() => {
        ref?.current?.close()
        setOpen(false)
    }, [])

    
    let IconArrow = open ? MdKeyboardArrowUp : MdKeyboardArrowDown

    return(
        <WrapperAsolute onClick={toggleTooltip}>
            <WrapperContainer className={`menu_option--trigger-action ${open ? 'isActive' : ''}`} >
                <WrapperContainer className={`menu_option--element`}>
                    {user?.name && <P size={15} color={"white"}>{user?.name}</P>}
                    <UserOptionPic>
                        {
                            user?.name ? 
                                <P size={13} color={"white"} className="bold">{getAcronym(user?.name)}</P>
                            :
                                <IconSwitch icon="coinsenda" size={25} color="white" />
                        }
                    </UserOptionPic>
                    <IconArrow size="20px" color="white" />
                </WrapperContainer>
                <PopUpLayout
                    trigger={<TriggerButton/>}
                    ref={ref}
                    position="bottom right"
                    nested
                    repositionOnResize
                    closeOnDocumentClick={true}
                >
                    <UserMenuPopUp onClose={closePopUp} user={user} {...props}/>
                </PopUpLayout>
            </WrapperContainer>

        </WrapperAsolute>
    )
}

export default UserOptionsMenu


const Line = styled.div`
    height: 1px;
    width: calc(100% - 20px);
    border-top: 1px solid white;
    opacity: .1;
    margin: 0 10px;
`

const UserMenuPopUp = ({ user, actions, onClose }) => {

    const copyEmail = (e) => {
        copy(e)
        onClose()
    }

    const goToSettings = () => {
        onClose()
        history.push('/settings/')
    }

    const logOut = () => {
        onClose()
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
        <PopUpUserMenu> 
            <ItemUserPopUp className='item_popup--copy' onClick={copyEmail} data-copy={user?.email}>
                <IoMailOutline color="white" size={16} />
                <P>{user?.email}</P>
                <MdOutlineContentCopy/>
            </ItemUserPopUp>
            <Line/>
            <ItemUserPopUp className='actionable' onClick={goToSettings}>
                <IoSettingsOutline color="white" size={16} />
                <P>Ajustes</P>
                <AiOutlineArrowRight/>
            </ItemUserPopUp>
            <Line/>
            <ItemUserPopUp className='unique actionable logout' onClick={logOut}>
                <P>Salir de Coinsenda</P>
            </ItemUserPopUp>
        </PopUpUserMenu>
    )
}

const ItemUserPopUp = styled.div`
    display:grid;
    grid-template-columns: auto 1fr auto;
    column-gap: 10px;
    cursor: pointer;
    position: relative;
    padding: 15px;

    &.actionable:hover{
        background: #22272b;
        border-radius: 4px;
    }

    &.unique{
        grid-template-columns: 1fr;
    }

    &.logout p{
        text-align: center;
        color: #ff6d6d;
    }
    
    &::after{
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
    }

    &.item_popup--copy:hover {
        p, svg {
            color: rgb(31,228,123);
        }
    }

    p{
        margin:0;
        color:white;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
`

const PopUpUserMenu = styled.section`
    height: auto;
    padding: 10px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
`