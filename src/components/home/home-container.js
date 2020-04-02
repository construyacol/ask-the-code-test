import React from 'react'
import HomeLayout from './homeLayout'
import MenuPrincipalContainer from '../menuPrincipal/menuPrincipalContainer'
import MenuSuperiorContainer from '../menuSuperior/menuSuperiorContainer'
import DashBoardContainer from '../dashBoard/dashBoardContainer'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
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
    otherModal,
    modalVisible,
    modalConfirmation,
    doLogout,
  } = props

  return (
    <HomeLayout modal={modalConfirmation || otherModal || modalVisible ? true : false} >
      <ModalsSupervisor />
      <Route
        path={["/:primary_path/:path", "/:primary_path"]}
        render={renderProps => (<BuildedHome {...renderProps} logOut={doLogout} />)} />
    </HomeLayout>
  )

}


HomeContainer.propTypes = {
  loader: PropTypes.bool,
  modalConfirmation: PropTypes.bool,
  modalVisible: PropTypes.bool,
  otherModal: PropTypes.bool
}


function mapStateToProps(state) {
  return {
    modalVisible: state.form.modal_visible,
    loader: state.isLoading.loader,
    modalConfirmation: state.ui.modal_confirmation.visible,
    otherModal: state.ui.otherModal,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default withHandleError(connect(mapStateToProps, mapDispatchToProps)(HomeContainer))
