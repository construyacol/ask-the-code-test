import React, { Component } from 'react';
import { connect } from 'react-redux'
import NavItem from 'react-bootstrap/lib/NavItem'
import Nav from 'react-bootstrap/lib/Nav'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import Navbar from 'react-bootstrap/lib/Navbar'
import { withRouter, Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import logo from '../Landing/img/logo.png'

import UserMenu from './usermenu'
import config from '../../default'
import PricesWidget from '../PricesWidget'
import PricesModal from '../PricesModal'

import '../../styles/header.css'

const oauth = config.oauth
const signinUri = `${oauth.host}/${oauth.signin}?clientId=${oauth.key}`
const signupUri = `${oauth.host}/${oauth.signup}?clientId=${oauth.key}`

class Links extends Component {
  state = {
    localCode: ''
  }
  
  componentDidMount () {

    // Search ref_code in localStore
    const localCode = localStorage.getItem('ref_code')

    if (localCode) {
      this.setState({
        localCode
      })
    }
  }

  handleClickRemove = () => {
    localStorage.removeItem('ref_code')
  }

  render () {
    const { localCode } = this.state

    return (
      <Nav pullRight className="menu-right">
        <NavItem href={signinUri}>Ingresar</NavItem>
        {
          localCode ? (
            <NavItem onClick={this.handleClickRemove} href={`${signupUri}&ref_code=${localCode}`}>Regístrate</NavItem>
          ) : (
            <NavItem href={signupUri}>Regístrate</NavItem>
          )
        }
        <LinkContainer to="/help" isActive={()=>false}>
          <NavItem>Ayuda</NavItem>
        </LinkContainer>
      </Nav>
    )
  }
}

class PhiNavbar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {showModal: false}
  }
  render () {
    return (
      <Navbar
        fluid
        collapseOnSelect
        default
        fixedTop
        className={this.props.isLanding ? 'landing-nav' : ''}>
        <Row>
          <Navbar.Header className="text-center col-lg-2 col-md-3 col-sm-3">
            <Col xs={6}>
              <Navbar.Brand>
                <Link to="/">
                  <img alt="Coinsenda" src={logo} />
                </Link>
              </Navbar.Brand>
            </Col>
            <Col xs={6} mdHidden smHidden lgHidden className="text-left">
              <Navbar.Toggle />
              <a
                href="#prices"
                onClick={() => this.setState({showModal: true})}
                className="price-link">
                Cotización
              </a>
            </Col>
          </Navbar.Header>
          <Navbar.Collapse>
            <div className={this.props.auth.isLoggedIn ? '' : 'col-sm-9'}>
              {
                this.props.auth.isLoggedIn
                  ? <UserMenu />
                  : <Links />
              }
              <PricesWidget classes="hidden-xs nav-prices nav navbar-nav" />
            </div>
          </Navbar.Collapse>
        </Row>
        <PricesModal
          open={this.state.showModal}
          closeHandler={() => this.setState({showModal: false})}
        />
      </Navbar>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default withRouter(connect(mapStateToProps)(PhiNavbar))
