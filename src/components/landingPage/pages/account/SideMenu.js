import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import PanelLeft from '../../components/PanelLeft'

const MenuLink = withRouter(props => {
  let {className} = props
  className = props.location.pathname.indexOf(props.to) === 0
    ? className
      ? `${className} active`
      : 'active'
    : className || ''
  return (
    <Link className={className} to={props.to}>{props.children}</Link>
  )
})

const WalletSubmenu = props => {
  return (
    <ul>
      <li>
        <MenuLink to="/user/wallets/cop">
          <i className="fa fa-dollar-sign fa-fw" />
          <span>COP</span>
        </MenuLink>
      </li>
      <li>
        <MenuLink to="/user/wallets/btc">
          <i className="fab fa-btc fa-fw" />
          <span>Bitcoin</span>
        </MenuLink>
      </li>
      <li>
        <MenuLink to="/user/wallets/ref">
          <i className="fa fa-user-alt fa-fw" />
          <span>Referido</span>
        </MenuLink>
      </li>
    </ul>
  )
}

const SideMenu = props => {
  return (
    <PanelLeft>
      <ul>
        <li>
          <MenuLink to="/dashboard">
            <i className="fa fa-home fa-fw" />
            <span>Inicio</span>
          </MenuLink>
        </li>
        <li>
          <MenuLink to="/user/wallets/cop">
            <i className="fa fa-wallet fa-fw" />
            <span>Billeteras</span>
          </MenuLink>
          {
            props.location.pathname.indexOf('/user/wallets') === 0 ||
            props.submenusOpen
              ? <WalletSubmenu />
              : ''
          }
        </li>
        <li>
          <MenuLink to="/user/balance">
            <i className="fa fa-calculator fa-fw" />
            <span>Saldos</span>
          </MenuLink>
        </li>
        <li>
          <MenuLink to="/user/referrals">
            <i className="fas fa-user-friends fa-fw" />
            <span>Referidos</span>
          </MenuLink>
        </li>
        <li>
          <MenuLink to="/user/help">
            <i className="fa fa-question fa-fw" />
            <span>FAQ</span>
          </MenuLink>
        </li>
      </ul>
    </PanelLeft>
  )
}

export default withRouter(SideMenu)
