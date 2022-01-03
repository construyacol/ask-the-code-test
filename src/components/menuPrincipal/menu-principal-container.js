import React, { Component } from "react";
import MenuPrincipalLayout from "./mPrincipalLayout";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { scroller } from "react-scroll";
import PropTypes from "prop-types";
import actions from "../../actions";
import withCoinsendaServices from "../withCoinsendaServices";
import "./mPrincipal.css";

class MenuPrincipalContainer extends Component {
  activarItem = async (name, link) => {
    this.props.action.section_view_to("initial");
    this.props.action.CleanNotifications(name);
    window.requestAnimationFrame(() => {
      scroller.scrollTo("firstInsideContainer", {
        duration: this.props.path === link ? 500 : 0,
        smooth: true,
        containerId: "containerElement",
        offset: -50
      });
    });
  };

  close_menu_principal = () => {
    this.props.action.current_section_params({ show_menu_principal: false });
  };

  componentDidMount() {
    window.requestAnimationFrame(() => {
      scroller.scrollTo("firstInsideContainer", {
        offset: 0,
        duration: 0,
        smooth: true,
        containerId: "containerElement",
      });
    });
    if (window.innerWidth < 768) {
      return this.props.action.current_section_params({
        show_menu_principal: false,
      });
    }
    this.props.action.current_section_params({ show_menu_principal: true });
  }

  changeCountry = () => {
    this.props.coinsendaServices.setAppLoading(false);
  };

  navigateTo = async (pathname) => {
    await this.props.history.push(pathname);
    return this.props.action.current_section_params({
      show_menu_principal: false,
    });
  };

  openSelectCountry = async () => {
    this.props.action.confirmationModalToggle();
    this.props.action.confirmationModalPayload({
      title: "Cambiar país de operación",
      description:
        "Elige el país en el que deseas operar, recuerda que cada país maneja un perfil de operación diferente.",
      txtPrimary: "Cambiar de país",
      txtSecondary: "Cancelar",
      payload: "account_id",
      action: this.changeCountry,
      svg: "coinsenda",
      type: "select_country",
    });
  };

  render() {
    return (
      <MenuPrincipalLayout
        activarItem={this.activarItem}
        path={this.props.path}
        refCallback={this.refCallback}
        close_menu_principal={this.close_menu_principal}
        openSelectCountry={this.openSelectCountry}
        navigateTo={this.navigateTo}
        {...this.props}
      />
    );
  }
}

MenuPrincipalContainer.propTypes = {
  path: PropTypes.string,
  show_menu_principal: PropTypes.bool,
  user: PropTypes.object,
  verification_state: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

function mapStateToProps(state, props) {
  const path = props.match.params.primary_path;
  const { user } = state.modelData;
  const { verification_state } = state.ui;

  return {
    user,
    path,
    show_menu_principal: state.ui.current_section.params.show_menu_principal,
    verification_state,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCoinsendaServices(MenuPrincipalContainer));
