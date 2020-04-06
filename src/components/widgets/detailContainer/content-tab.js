import React, { Fragment, Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import IconSwitch from '../icons/iconSwitch'
import { navigation_components } from '../../api/ui/api.json'

import './detailContainer.css'

// TODO: refactor this component
class ContentTab extends Component {
    render() {
        const { title, current_section, current_wallet, pathname, primary_path } = this.props
        const { items_menu } = navigation_components.wallet
        const { params } = current_section
        const movil_viewport = window.innerWidth < 768

        return (
            
            <div className="subMenu">
                <div className="menuContainer">
                    <div className="itemsMenu fuente" style={{ display: !pathname ? 'none' : 'grid' }}>
                        {
                            (current_wallet && items_menu ? items_menu.length > 0 : false) &&
                            items_menu.map(item => {
                                return (
                                    <NavLink to={`/wallets/${item.link}/${current_wallet}${item.link === 'activity' ? `/${params.currentFilter}` : ''}`}
                                        // onClick={this.to_sub_section}
                                        id={item.link}
                                        key={item.id}
                                        className={`menuMovilItem ${pathname === item.link ? 'active' : ''}`}
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
                        <Link to="/wallets" className="DCBack" style={{ display: (pathname) ? '' : 'none' }} >
                            <i className="fas fa-arrow-left"></i>
                            <p>Volver</p>
                        </Link>
                    }


                    <div className={`DCTitle ${primary_path} ${movil_viewport ? 'movil' : ''}`} style={{ display: pathname ? 'none' : '' }} >
                        {
                            (movil_viewport && primary_path !== 'referral') ?
                                <Fragment>
                                    <Link to="/wallets" className={`menuMovilItem ${primary_path === 'wallets' ? 'active' : ''}`}>
                                        <div className={`menuMovilIcon ${primary_path === 'wallets' ? 'active' : ''}`} >
                                            <IconSwitch size={20} icon="wallets" color="#14b3f0" />
                                        </div>
                                        <p className="fuente" >Billeteras</p>
                                    </Link>

                                    <Link to="/withdraw_accounts" className={`menuMovilItem ${primary_path === 'withdraw_accounts' ? 'active' : ''}`}>
                                        <div className={`menuMovilIcon ${primary_path === 'withdraw_accounts' ? 'active' : ''}`} >
                                            <IconSwitch size={20} icon="withdraw" color="#14b3f0" />
                                        </div>
                                        <p className="fuente" >Retiros</p>
                                    </Link>

                                    <Link to="/security" className={`menuMovilItem ${primary_path === 'security' ? 'active' : ''}`}>
                                        <div className={`menuMovilIcon ${primary_path === 'security' ? 'active' : ''}`} >
                                            <IconSwitch size={20} icon="security" color="#14b3f0" />
                                        </div>
                                        <p className="fuente" >Seguridad</p>

                                    </Link>

                                </Fragment>
                                :
                                <p className="fuente">{title}</p>
                        }
                    </div>
                </div>
            </div>

        )

    }
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
        ...account_opts
    }
}

export default connect(mapStateToProps)(ContentTab)
