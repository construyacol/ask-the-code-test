import React from "react";
import loadable from "@loadable/component";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import HomeLayout from "./homeLayout";
import MenuPrincipalContainer from "../menuPrincipal/menu-principal-container";
import MenuSuperiorContainer from "../menuSuperior/menuSuperiorContainer";
import DashBoardContainer from "../dashBoard/dashboard-container";
import withHandleError from "../withHandleError";
import { doLogout } from "../utils";

const ModalsSupervisor = loadable(() => import("./modals-supervisor"));

const BuildedHome = (props) => (
  <>
    <MenuPrincipalContainer {...props} />
    <MenuSuperiorContainer {...props} />
    <DashBoardContainer {...props} />
  </>
);

const HomeContainer = () => {
  return (
    <HomeLayout>
      <Route
        path={["/:primary_path/:path/:account_id/:tx_path/:order_id", "/"]}
        render={(renderProps) => <ModalsSupervisor {...renderProps} />}
      />
      <Route
        path={["/:primary_path/:path", "/:primary_path"]}
        render={(renderProps) => (
          <BuildedHome {...renderProps} logOut={doLogout} />
        )}
      />
    </HomeLayout>
  );
};

HomeContainer.propTypes = {
  loader: PropTypes.bool,
  isSomeModalRendered: PropTypes.bool,
};

function mapStateToProps({ isLoading }) {
  return {
    loader: isLoading.loader,
  };
}

export default withHandleError(connect(mapStateToProps)(HomeContainer));
