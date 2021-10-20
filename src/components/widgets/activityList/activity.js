import React, { Fragment, Component } from "react";
// import ItemList from './viewItem'
import OrderItem from "./order_item";
// import { serve_orders, ticketModalView } from '../../../services'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
// import OrderDetail from '../modal/render/orderDetail'
// import SimpleLoader from '../loaders'
import InifiniteScrollComponent from "./infiniteScroll";

import "./activity_view.css";
import withCoinsendaServices from "../../withCoinsendaServices";

import { createSelector } from "reselect";

class ActivityList extends Component {
  state = {
    activity: null,
    expandible: 90,
    expandido: false,
    filter: true,
    current_order_loader: null,
    deleting: null,
    deleted: null,
    scrollLoader: null,
  };

  // componentDidMount(){
  //   this.props.action.CurrentForm('ticket')
  //   this.init_activity()
  // }

  componentDidUpdate(prevProps) {
    if (this.props.tx_path !== prevProps.tx_path) {
      this.contraer();
    }
  }

  setLoader = (scrollLoader) => {
    this.setState({ scrollLoader });
  };

  expandir = () => {
    const { expandidoMax } = this.props;

    this.setState({
      expandible: expandidoMax,
      expandido: true,
    });
  };

  contraer = () => {
    this.setState({
      expandible: 90,
      expandido: false,
    });
  };

  delete_order_confirmation = (id) => {
    this.props.action.confirmationModalToggle();
    this.props.action.confirmationModalPayload({
      title: "Esto es importante, estas a punto de...",
      description: "Eliminar esta orden, ¿Estas seguro de hacer esto?",
      txtPrimary: "Eliminar",
      txtSecondary: "Cancelar",
      payload: id,
      action: this.delete_order,
      img: "deleteticket",
    });
  };

  delete_order = async (id) => {
    const {
      tx_path,
      // user
    } = this.props;

    // this.props.action.isAppLoading(true)
    await this.setState({
      current_order_loader: id,
      deleting: true,
    });

    let deleted =
      tx_path === "deposits" &&
      (await this.props.coinsendaServices.deleteDeposit(id));

    if (!deleted) {
      // await this.setState({deleting:false, current_order_loader:0})
      return false;
    }

    // await this.setState({deleting:false,deleted:true})

    // this.setState({
    //   // expandidoMax:(this.props.expandidoMax - 100),
    //   expandible:this.state.expandido ? (this.props.expandidoMax) : '90px'
    // });

    await this.setState({ deleting: false, current_order_loader: 0 });
    this.props.action.isAppLoading(false);
    // this.setState({deleted:true})
    // this.props.action.mensaje('Orden eliminada con éxito', 'success')
  };

  confirmPayment = async (props) => {
    const { ticket } = props;

    const { primary_path, account_id, path, tx_path } = this.props.match.params;
    this.props.history.push(
      `/${primary_path}/${path}/${account_id}/${tx_path}/${ticket.id}`
    );

    this.props.action.toggleModal();
    setTimeout(() => {
      this.props.action.IncreaseStep("ticket");
    }, 170);

    setTimeout(() => {
      let inputFile = document.getElementById("TFileUpload");
      if (!inputFile) {
        return false;
      }
      inputFile.click();
    }, 740);

    this.props.history.push("?form=upload_deposit_payment_proof");
  };


  render() {
    const {
      activity,
      pending,
      expandidoMax,
      tx_path,
    } = this.props;

    const {
      expandible,
      expandido,
    } = this.state;


    return (
      <Fragment>
        {tx_path !== "swaps" && (
          <section
            className="ALpendingMom"
            style={{ display: pending ? "block" : "none" }}
          >
            <p
              className="ALtext fuente"
              style={{ display: pending ? "block" : "none" }}
            >
              Pendiente{" "}
            </p>
            <div
              className="ALpendingCont"
              style={{ height: `${expandible}px` }}
            >
              <div className="ALlist" style={{ height: `${expandidoMax}px` }}>
                {activity &&
                  activity.map((item, indx) => {
                    // Si la orden esta en accepted, canceled, rejected ó es un retiro pendiente
                    if (
                      item.state === "accepted" ||
                      item.state === "canceled" ||
                      item.state === "rejected" 
                    ) {
                      return null;
                    }
                    // if ((item.state === 'accepted' || item.state === 'canceled' || item.state === 'rejected') || ((tx_path === 'withdraws' && item.state === 'pending') && item.currency_type !== 'crypto')) { return null }
                    // if (item.state === 'pending' && item.currency_type === 'crypto') { return null }
                    return (
                      <OrderItem
                        order={{ ...item }}
                        key={indx}
                      />
                    );

                    // if (this.props.tx_path === 'deposits' || this.props.tx_path === 'withdraws') {
                    //   return <OrderItem
                    //     order={{ ...item }}
                    //     handleAction={this.verTicket}
                    //     key={indx}
                    //   />
                    // } else {
                    //   return <ItemList key={item.id}
                    //     confirmPayment={this.confirmPayment}
                    //     lastPendingId={lastPending}
                    //     newDepositStyle={newDepositStyle}
                    //     verTicket={this.verTicket}
                    //     delete_order={this.delete_order_confirmation}
                    //     ticket={item}
                    //     loader={loader}
                    //     current_order_loader={current_order_loader}
                    //     deleting={deleting}
                    //     deleted={deleted}
                    //     currencies={currencies}
                    //     {...this.props}
                    //   />
                    // }

                    // console.log('ConFill AFTER', item, item.state, indx, ' - ', activity.length)
                  })}
              </div>
            </div>
            <p
              className="ALverTodo"
              onClick={this.expandir}
              style={{
                display: expandidoMax / 100 < 2 || expandido ? "none" : "block",
              }}
            >
              {/* <p className="ALverTodo" onClick={this.expandir} style={{display:expandido ? 'none' : 'block'}}> */}
              Ver todo
              <span>+{expandidoMax / 100 - 1}</span>
              <i className="fas fa-angle-down"></i>
            </p>
            <p className="ALverTodo" onClick={this.contraer} style={{display:expandidoMax / 100 < 2 || !expandido ? "none" : "block"}}>
              Reducir
              <i className="fas fa-angle-up"></i>
            </p>
          </section>
        )}

        <section className={`ALactivity ${pending && tx_path !== "swaps" ? "ALactivityPending" : ""}`}>
          <p className="ALtext fuente">Actividad</p>
          <div className="ALlistAll">
            {activity.map((item, index) => {
              if (
                item.state !== "accepted" &&
                item.state !== "canceled" &&
                item.state !== "rejected" &&
                tx_path !== "swaps"
              ) {
                return null;
              }
              return <OrderItem
                      index={index}
                      order={item}
                      key={index}
                    />;
            })}
          </div>

          <InifiniteScrollComponent
            setLoader={this.setLoader}
            loader={this.state.scrollLoader}
          />
        </section>
      </Fragment>
    );
  }
}

const isCriptoWallet = (state, { params }) => {
  return state.modelData.wallets[params.account_id] === "crypto";
};

const selectCurrentList = createSelector(
  (state) => state.currencies,
  isCriptoWallet,
  (_, props) => props.isWithdraws,
  (currencies, isCryptoWallet, isWithdraws) => {
    let currency_list;
    if (!isWithdraws && currencies && isCryptoWallet) {
      currencies.map((currency) => {
        return (currency_list = {
          ...currency_list,
          [currency.currency]: {
            ...currency,
          },
        });
      });
    }

    return currency_list;
  }
);

function mapStateToProps(state, props) {
  const { user } = state.modelData;
  const { isWithdraws, match } = props;
  const { params } = match;
  // const { current_wallet } = props
  const { currentFilter } = state.ui.current_section.params;
  const { activity_for_account } = state.storage;
  let pending_index = `pending_${params.tx_path}`;

  let pending_activity =
    activity_for_account[params.account_id] &&
    activity_for_account[params.account_id][pending_index];

  if (isWithdraws) {
    pending_activity = {};
  }

  return {
    newDepositStyle: state.ui.current_section.params.new_order_style,
    currentFilter: currentFilter,
    tx_path: params.tx_path,
    loader: state.isLoading.loader,
    short_name: state.ui.current_section.params.short_name,
    swap_done_out: state.ui.current_section.params.swap_done_out,
    user: user,
    // current_activity_account:activity_for_account[current_wallet.id],
    // activity:activity_for_account[current_wallet.id] && activity_for_account[current_wallet.id][params.tx_path],
    currencies: selectCurrentList(state, { params, isWithdraws }),
    ...pending_activity,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCoinsendaServices(ActivityList));
