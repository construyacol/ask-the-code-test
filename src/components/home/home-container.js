import React from 'react'
import HomeLayout from './homeLayout'
import MenuPrincipalContainer from '../menuPrincipal/menuPrincipalContainer'
import MenuSuperiorContainer from '../menuSuperior/menuSuperiorContainer'
import DashBoardContainer from '../dashBoard/dashBoardContainer'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import withHandleError from '../withHandleError'
import ModalsSupervisor from './modals-supervisor'

const BuildedHome = (props) => (
  <>
    <MenuPrincipalContainer {...props} />
    <MenuSuperiorContainer {...props} />
    <DashBoardContainer  {...props} />
  </>
)

function HomeContainer(props) {
  const {
    isSomeModalRendered,
    doLogout,
  } = props

  return (
    <HomeLayout modal={isSomeModalRendered} >
      <ModalsSupervisor />
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


function mapStateToProps({ form, isLoading, ui }) {
  const isSomeModalRendered = form.isModalVisible || ui.modal_confirmation.visible || ui.otherModal
  return {
    loader: isLoading.loader,
    isSomeModalRendered
  }
}

export default withHandleError(connect(mapStateToProps)(HomeContainer))
