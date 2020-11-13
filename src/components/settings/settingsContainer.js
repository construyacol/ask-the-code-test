import React, { Component, Fragment } from "react";
import DetailContainerLayout from "../widgets/detailContainer/detailContainerLayout";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../actions";
import SimpleLoader from "../widgets/loaders";
import ItemSettingsInit from "../widgets/itemSettings";
import { global_settings } from "../api/ui/settings.json";

class SettingsContainer extends Component {
  componentDidMount() {
    this.props.action.isAppLoading(true);
    // activamos el item desde aquí en caso de acceder al componente por medio de la ruta
    setTimeout(async () => {
      this.props.action.isAppLoading(false);
    }, 0);
  }

  enableToggle = () => {
    alert("Configuración Item");
  };

  render() {
    return (
      <Fragment>
        <DetailContainerLayout title="Configuraciones">
          {this.props.loader ? (
            <SimpleLoader label="Obteniendo configuraciones" />
          ) : (
            global_settings && <ItemSettingsInit data={global_settings} />
          )}
        </DetailContainerLayout>
      </Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    loader: state.isLoading.loader,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
