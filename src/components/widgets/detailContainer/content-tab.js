import React, { useRef, useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import IconSwitch from '../icons/iconSwitch'
import { navigation_components } from '../../api/ui/api.json'

import './detailContainer.css'

// TODO: refactor this component
function ContentTab(props) {
    const { title, current_section, current_wallet, pathname, primary_path, wallets, history } = props
    const tabRef = useRef()
    const forceStatePathnameIndex = useRef({ currentIndex: 0 })
    const forceCurrentWallet = useRef(current_wallet)
    const [haveMenu, setHaveMenu] = useState(false)

    const { items_menu } = navigation_components[primary_path] ? navigation_components[primary_path] : navigation_components.wallets
    const { params } = current_section
    const movil_viewport = window.innerWidth < 768

    // useEffect(() => {
    //     window.requestAnimationFrame(() => {
    //         tabRef.current.scrollIntoView({ block: "start", behavior: "smooth" })
    //     })
    // }, [title, path])

    useEffect(() => {
        document.onkeyup = (event) => {
            const condition =
                forceCurrentWallet.current &&
                !document.onkeydown &&
                window.location.href.includes(forceStatePathnameIndex.current.pathname) &&
                !window.location.href.includes('?')

            const haveBalances = wallets[forceCurrentWallet.current] && (wallets[forceCurrentWallet.current].count > 0 ||
                wallets[forceCurrentWallet.current].available > 0)

            if (event.keyCode === 37) {
                if (condition && haveBalances) goPrev()
            }
            if (event.keyCode === 39) {
                if (condition && haveBalances) goNext()
            }
            if (event.keyCode === 8) {
                if (event.srcElement.tagName.includes('INPUT')) return event.srcElement.blur()
                if (condition) exit()
            }
        }
    }, [document.onkeydown, primary_path, current_wallet])

    useEffect(() => {
        if (forceStatePathnameIndex.current.pathname !== pathname) {
            const currentIndex = items_menu.findIndex(item => item.link === pathname)
            forceStatePathnameIndex.current = { pathname, currentIndex }
        }

        if (forceCurrentWallet.current !== current_wallet) {
            forceCurrentWallet.current = current_wallet
        }

        const haveBalances = wallets[current_wallet] && (wallets[current_wallet].count > 0 ||
            wallets[current_wallet].available > 0)

        const condition = primary_path === 'wallets' ? haveBalances && items_menu : items_menu

        setHaveMenu(condition ? items_menu.length > 0 : false)

    }, [current_wallet, items_menu, pathname, primary_path])

    const getLink = (link) => {
        return `/${primary_path}/${link}/${forceCurrentWallet.current}${link === 'activity' ? `/${params.currentFilter}` : ''}`
    }

    const goPrev = () => {
        if (forceStatePathnameIndex.current.currentIndex === 0) return
        if (!items_menu[forceStatePathnameIndex.current.currentIndex - 1]) return
        const link = getLink(items_menu[forceStatePathnameIndex.current.currentIndex - 1].link)
        history.push(link)
    }

    const goNext = () => {
        if (forceStatePathnameIndex.current.currentIndex === (items_menu.length - 1)) return
        if (!items_menu[forceStatePathnameIndex.current.currentIndex + 1]) return
        const link = getLink(items_menu[forceStatePathnameIndex.current.currentIndex + 1].link)
        history.push(link)
    }

    const exit = () => {
        history.push(`/${primary_path}`)
    }

    return (
        <div className="subMenu" ref={tabRef}>
            <div className="menuContainer">
                <div className="itemsMenu fuente" style={{ display: !pathname ? 'none' : 'grid' }}>
                    {
                        haveMenu ?
                            items_menu.map(item => {
                                // console.log('||||||||||||||||| |||||||||||||||| ||||||||||||||| |||||||||||||| |||||||||||||     ContentTab', item)
                                if ((item.link === 'activity' || item.link === 'withdraw' || item.link === 'swap') && primary_path === 'wallets' && wallets[current_wallet] && wallets[current_wallet].count === 0) {
                                    return null
                                }
                                return (
                                    <NavLink to={getLink(item.link)}
                                        // onClick={this.to_sub_section}
                                        id={item.link}
                                        key={item.id}
                                        className={`menuItem ${pathname === item.link ? 'active' : ''}`}
                                    >
                                        <div className={`menuMovilIcon ${pathname === item.link ? 'active' : ''}`} >
                                            <IconSwitch size={20} icon={item.link} color="#14b3f0" />
                                        </div>
                                        <p>{item.title}</p>
                                    </NavLink>
                                )
                            }) : (

                                <NavLink to={getLink('deposit')} className="menuItem active">
                                    <div className={`menuMovilIcon active`} >
                                        <IconSwitch size={20} icon={'deposit'} color="#14b3f0" />
                                    </div>
                                    <p>Depositar</p>
                                </NavLink>
                            )
                    }
                </div>

                {
                    (!movil_viewport) &&
                    <Link to={primary_path === 'wallets' ? "/wallets" : "/withdraw_accounts"} className="DCBack" style={{ display: (pathname) ? '' : 'none' }} >
                        <i className="fas fa-arrow-left"></i>
                        <p>Volver</p>
                    </Link>
                }


                <div className={`DCTitle ${primary_path} ${movil_viewport ? 'movil' : ''}`} style={{ display: pathname ? 'none' : '' }} >
                    {
                        (movil_viewport) ?
                            <MovilMenu
                                primary_path={primary_path}
                            />
                            :
                            <p className="fuente">{title}</p>
                    }
                </div>
            </div>
        </div>

    )
}


const MovilMenu = ({ primary_path }) => {

    const dataMenu = [
        {
            key: 'wallets',
            ui_text: 'Billeteras',
        },
        {
            key: 'withdraw_accounts',
            ui_text: 'Ctas retiros',
        },
        {
            key: 'referral',
            ui_text: 'Referidos',
        },
        {
            key: 'security',
            ui_text: 'Seguridad',
        }
    ];

    return (
        <>
            {
                dataMenu.map((itemMenu, indx) => {
                    const isActive = primary_path === itemMenu.key
                    return <Link to={`/${itemMenu.key}`} className={`menuItem movil ${isActive ? 'active' : ''}`} key={indx}>
                        <IconSwitch size={20} icon={itemMenu.key} color={`${isActive ? '#14b3f0' : 'gray'}`} />
                        <div className={`menuMovilIcon ${isActive ? 'active' : ''}`} >
                            <p className="fuente" >{itemMenu.ui_text}</p>
                        </div>
                    </Link>
                })
            }
        </>
    )

}


function mapStateToProps(state, props) {
    let account_opts = {}
    if (props.match) {
        const { path, primary_path, account_id } = props.match.params
        account_opts = {
            current_wallet: account_id,
            pathname: path,
            primary_path
        }
    }

    return {
        current_section: state.ui.current_section,
        path: props.match.params.path || null,
        wallets: state.modelData.wallets,
        ...account_opts
    }
}

export default connect(mapStateToProps)(ContentTab)
