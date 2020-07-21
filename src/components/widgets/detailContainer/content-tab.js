import React, { useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import IconSwitch from '../icons/iconSwitch'
import { navigation_components } from '../../api/ui/api.json'

import './detailContainer.css'

// TODO: refactor this component
function ContentTab(props) {
    const tabRef = useRef()
    const { title, current_section, current_wallet, pathname, primary_path, wallets } = props

    const { items_menu } = navigation_components[primary_path] ? navigation_components[primary_path] : navigation_components.wallets
    const { params } = current_section
    const movil_viewport = window.innerWidth < 768

    // useEffect(() => {
    //     window.requestAnimationFrame(() => {
    //         tabRef.current.scrollIntoView({ block: "start", behavior: "smooth" })
    //     })
    // }, [title, path])

    return (
        <div className="subMenu" ref={tabRef}>
            <div className="menuContainer">
                <div className="itemsMenu fuente" style={{ display: !pathname ? 'none' : 'grid' }}>
                    {
                        (current_wallet && items_menu ? items_menu.length > 0 : false) &&
                        items_menu.map(item => {
                            // console.log('||||||||||||||||| |||||||||||||||| ||||||||||||||| |||||||||||||| |||||||||||||     ContentTab', item)
                            if ((item.link === 'activity' || item.link === 'withdraw' || item.link === 'swap') && primary_path === 'wallets' && !wallets[current_wallet].count) {
                                return null
                            }
                            return (
                                <NavLink to={`/${primary_path}/${item.link}/${current_wallet}${item.link === 'activity' ? `/${params.currentFilter}` : ''}`}
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
                        })
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
      key:'wallets',
      ui_text:'Billeteras',
    },
    {
      key:'withdraw_accounts',
      ui_text:'Ctas retiros',
    },
    {
      key:'referral',
      ui_text:'Referidos',
    },
    {
      key:'security',
      ui_text:'Seguridad',
    }
  ]


  return(
    <>
      {
        dataMenu.map((itemMenu, indx) => {
          const isActive =  primary_path === itemMenu.key
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
        ...account_opts
    }
}

export default connect(mapStateToProps)(ContentTab)
