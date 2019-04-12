import React, { Component } from 'react';
import { connect } from 'react-redux'
import { login, logout } from '../actions/auth'
import { fetchIdentity } from '../actions/identity'
import { Redirect } from 'react-router-dom'
import Loader from '../components/Whitespace'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import PanelLeft from '../components/PanelLeft'
import PanelRight from '../components/PanelRight'

class Session extends Component {
  constructor (props) {
    super(props)

    this.state = {
      firstRender: true,
      processing: true,
      loggedin: false
    }
    const URI = new window.URL(window.location.href)
    const token = URI.searchParams.get('token')
    this.props.login(token)
      .catch(error => {
        console.log(
          '%c Login error',
          'color: orange; background-color: #333; padding: 2px'
        )
        return this.props.logout(token)
      })
  }
  componentWillReceiveProps (newProps) {
    const newState = {
      firstRender: false,
      processing: newProps.isFetching,
      loggedin: Boolean(newProps.user && newProps.user.email)
    }
    this.setState(newState)
  }

  render () {
    // early return for desperate purposes
    if (this.state.firstRender || this.state.processing) {
      return <Loader />
    }
    return (
      <Grid fluid>
        <Row>
          <PanelLeft />
          <PanelRight>
            {
              this.state.loggedin
                ? <Redirect to={{ pathname: '/dashboard' }} />
                : <Redirect to={{ pathname: '/' }} />
            }
          </PanelRight>
        </Row>
      </Grid>
    )
  }
}

const mapStateToProps = state => state.auth

const mapDispatchToProps = (dispatch) => {
  return {
    login: token => dispatch(login(token)),
    logout: token => dispatch(logout(token)),
    fetchIdentity: token => dispatch(fetchIdentity(token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Session)
