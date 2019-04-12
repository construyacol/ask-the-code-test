import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Nav from 'react-bootstrap/lib/Nav'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../../actions/auth'
import { withRouter } from 'react-router-dom'
// import config from '../../default'
const falsy = () => false

const UserMenu = props => {
  const { logout, token } = props
  return (
    <Nav pullRight>
      <NavDropdown
        eventKey={3}
        title={<span>Mi Cuenta <i className="fa fa-user-tie"></i></span>}
        id="basic-nav-dropdown">
        <LinkContainer to="/dashboard" isActive={falsy}>
          <MenuItem>Inicio</MenuItem>
        </LinkContainer>
        <MenuItem divider className="hidden-sm hidden-md hidden-lg" />
        <LinkContainer to="/user/wallets/cop" isActive={falsy} className="hidden-sm hidden-md hidden-lg">
          <MenuItem>Billetera COP</MenuItem>
        </LinkContainer>
        <LinkContainer to="/user/wallets/btc" isActive={falsy} className="hidden-sm hidden-md hidden-lg">
          <MenuItem>Billetera BTC</MenuItem>
        </LinkContainer>
        <LinkContainer to="/user/wallets/ref" isActive={falsy} className="hidden-sm hidden-md hidden-lg">
          <MenuItem>Billetera REF</MenuItem>
        </LinkContainer>
        <LinkContainer to="/user/balance" isActive={falsy} className="hidden-sm hidden-md hidden-lg">
          <MenuItem>Saldos</MenuItem>
        </LinkContainer>
        <LinkContainer to="/user/referrals" isActive={falsy} className="hidden-sm hidden-md hidden-lg">
          <MenuItem>Área de Referidos</MenuItem>
        </LinkContainer>
        <MenuItem divider className="hidden-sm hidden-md hidden-lg" />
        <LinkContainer to="/user/profile" isActive={falsy}>
          <MenuItem>Información Personal</MenuItem>
        </LinkContainer>
        {/* <LinkContainer to="/user/profile/notifications" isActive={falsy}>
          <MenuItem>Notificaciones</MenuItem>
        </LinkContainer> */}
        <LinkContainer to="/user/profile/security" isActive={falsy}>
          <MenuItem>Seguridad</MenuItem>
        </LinkContainer>
        <LinkContainer to="/user/profile/verification" isActive={falsy}>
          <MenuItem>Verificación</MenuItem>
        </LinkContainer>
        <LinkContainer to="/help" isActive={falsy}>
          <MenuItem>Ayuda</MenuItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem onClick={() => logout(token)}>
          Salir
        </MenuItem>
      </NavDropdown>
    </Nav>
  )
}

UserMenu.propTypes = {
  logout: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired
}
const mapStateToProps = state => ({token: state.auth.token })
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: token => dispatch(logout(token))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserMenu))
