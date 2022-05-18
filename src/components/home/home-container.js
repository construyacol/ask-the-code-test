import React from "react";
// import loadable from "@loadable/component";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import { HomeLayout } from "./homeLayout";
import MenuPrincipalContainer from "../menuPrincipal/menu-principal-container";
// import MenuSuperiorContainer from "../menuSuperior/menuSuperiorContainer";
import MainMenuComponent from '../menu/mainMenu'
// import DashBoardContainer from "../dashBoard/dashboard-container";
// import { doLogout } from "../utils";
import withHandleError from "../withHandleError";
import styled from 'styled-components'
import SideMenuComponent from '../menu/sideMenu'

// const BuildedHome = (props) => (
//   <>
//     <MenuPrincipalContainer {...props} />
//     <MenuSuperiorContainer {...props} />
//     <DashBoardContainer {...props} />
//   </>
// );

const HomeContainer = () => {
  return (
    <Route
        path={["/:primary_path/:path", "/:primary_path"]}
        render={(renderProps) => (
          <HomeLayout>
            <SideMenuComponent {...renderProps}/>
            <AppContainer className="appContainer">
              <MainMenuComponent/>
              <Content>
                <SubMenu>SubMenu</SubMenu>
              </Content>
            </AppContainer>
            {/* <MenuPrincipalContainer {...renderProps} logOut={doLogout}/>
            <MenuSuperiorContainer {...renderProps} logOut={doLogout}/>
            <DashBoardContainer {...renderProps} logOut={doLogout}/> */}
          </HomeLayout>
        )}
      />
  );
};

// const BorderCont = styled.div`
//   border:1px solid red;
// `

const SubMenu = styled.div`
  height:60px;
  position:sticky;
  top:60px;
  background: rgb(233 233 233);
  display: grid;
  place-items: center;
  color: #666666;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`

const AppContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  overflow-y: scroll;
  position:relative;
  padding-bottom:100px;
`

const Content = styled.div`
  height: 2500px;
  position:relative;
  background: #efeff3;

  width: 100%;
  max-width: 1480px;
  justify-self: center;
`

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
