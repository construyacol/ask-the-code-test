import React, { useEffect } from 'react'
import HomeLayout from './homeLayout'
import MenuPrincipalContainer from '../menuPrincipal/menu-principal-container'
import MenuSuperiorContainer from '../menuSuperior/menuSuperiorContainer'
import DashBoardContainer from '../dashBoard/dashboard-container'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import withHandleError from '../withHandleError'
import ModalsSupervisor from './modals-supervisor'
import { doLogout } from '../utils'


const BuildedHome = (props) => (
  <>
    <MenuPrincipalContainer {...props} />
    <MenuSuperiorContainer {...props} />
    <DashBoardContainer  {...props} />
  </>
)

const HomeContainer = (props) => {
  return (
    <HomeLayout>
      <Route
        path={["/:primary_path/:path/:account_id/:tx_path/:order_id", "/"]}
        render={renderProps => (<ModalsSupervisor {...renderProps}  />)} />
      <Route
        path={["/:primary_path/:path", "/:primary_path"]}
        render={renderProps => (<BuildedHome {...renderProps} logOut={doLogout} />)} />
    </HomeLayout>
  )
}

HomeContainer.propTypes = {
  loader: PropTypes.bool,
  isSomeModalRendered: PropTypes.bool
}

function mapStateToProps({ isLoading }) {
  return {
    loader: isLoading.loader
  }
}

export default withHandleError(connect(mapStateToProps)(HomeContainer))
