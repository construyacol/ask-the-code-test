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
import { isSafari } from '../../../utils'
import { ORDER_TYPE_UI_NAME } from '../../../const/const'
 
// import "./activity_view.css";
import withCoinsendaServices from "../../withCoinsendaServices";

import { createSelector } from "reselect";




import { device } from 'const/const'
import styled from 'styled-components'



const ALlistAll = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, 80px);
  height: auto;
  grid-auto-flow: row dense;
  min-height: 100%;
  grid-row-gap: 20px;
  transform-style: preserve-3d;
  justify-items: center;
  &.is_safari{
    min-height: -webkit-fit-content;
  }
`

const ALactivity = styled.section`
  width: 100%;
  height: auto;
  position: relative;

  &.ALactivityPending{
    margin-top: 35px;
  }
`

const ALpendingMom = styled.div`
  position: relative;
  display: block;
  background: #f5f5f5;
  padding: 15px 20px;
  border-radius: 6px;
  margin-bottom: 50px;

  @media ${device.mobile} {
    margin-bottom: 0;
    padding: 0;
    background:transparent;
  }
`

const ALtext = styled.p`
  color: var(--paragraph_color);
`

const ALpendingCont = styled.div`
  overflow: hidden;
  transition: 0.3s;
  position: relative;
  padding: 0 15px;

  &:hover{
    height: 800px;
  }

  @media ${device.mobile} {
    padding: 0;
  }
`

const ALlist = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, 80px);
  height: auto;
  grid-auto-flow: row dense;
  min-height: 100%;
  grid-row-gap: 20px;
  transform-style: preserve-3d;
  perspective: 1000px;
  perspective-origin: center top;
  transition: 0.3s;
  display: grid;
  justify-items: center;
`

const ALverTodo = styled.p`
  position: absolute;
  bottom: -30px;
  margin: 0;
  right: 0;
  color: var(--paragraph_color);
  cursor: pointer;
  font-family: "Raleway", sans-serif;
  font-size: 15px;
  &:hover{
    color: #b48728;
  }
  i{
    margin-left: 7px;
  }
  span{
    color: #ff8660;
    font-family: "Tomorrow", sans-serif;
  }
`

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
          <ALpendingMom
            className="ALpendingMom"
            style={{ display: pending ? "block" : "none" }}
          >
            <ALtext
              className="ALtext fuente"
              style={{ display: pending ? "block" : "none" }}
            >
              {`${ORDER_TYPE_UI_NAME[tx_path]?.ui_name}s`|| 'Operaciones'} en proceso{" "}
            </ALtext>
            <ALpendingCont
              className="ALpendingCont"
              style={{ height: `${expandible}px` }}
            >
              <ALlist className="ALlist" style={{ height: `${expandidoMax}px`}}>
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
              </ALlist>
            </ALpendingCont>
            <ALverTodo
              className="ALverTodo"
              onClick={this.expandir}
              style={{display: expandidoMax / 100 < 2 || expandido ? "none" : "block"}}
            >
              Ver todo
              <span>+{expandidoMax / 100 - 1}</span>
              <i className="fas fa-angle-down"></i>
            </ALverTodo>
            <ALverTodo className="ALverTodo" onClick={this.contraer} style={{display:expandidoMax / 100 < 2 || !expandido ? "none" : "block"}}>
              Reducir
              <i className="fas fa-angle-up"></i>
            </ALverTodo>
          </ALpendingMom>
        )}

        <ALactivity className={`ALactivity ${pending && tx_path !== "swaps" ? "ALactivityPending" : ""}`}>
          {/* <p className="ALtext fuente">Operaciones realizadas</p> */}
          <ALlistAll className={`ALlistAll ${isSafari()}`}>
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
          </ALlistAll>

          <InifiniteScrollComponent
            setLoader={this.setLoader}
            loader={this.state.scrollLoader}
          />
        </ALactivity>
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
