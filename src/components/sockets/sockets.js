import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../actions";
import io from "socket.io-client";
import Environtment from "../../environment";
// import { objectToArray } from '../../services'
import { withRouter } from "react-router";
import withCoinsendaServices from "../withCoinsendaServices";
import { getToken } from '../utils'
const { SocketUrl } = Environtment;


class SocketsComponent extends Component {
  state = {
    currentSwap: null,
    currentDeposit: null,
    currentWithdraw: null,
    isUpdated: false,
  };

//   async testSocketExecuted(depositMock) {
//     // console.log('======================================== ______ testSocketExecuted: ', depositMock)
//     if (depositMock.state === "pending" && depositMock.currency_type === "crypto") {
//       await this.setState({ currentDeposit: depositMock });
//     } else {
//       this.deposit_mangagement(depositMock);
//     }
//    }
//   async testDeposit() {
//     let depositMock = {}
//     let confirmations = 1
//     setInterval(()=>{
//     // setTimeout(()=>{
//       if(confirmations < 7){
//         depositMock = {
//           confirmations: confirmations,
//           id: "617621370b0a1b0048ae9cae"
//         }
//         this.testSocketExecuted(depositMock)
//         confirmations++
//       }
//     }, 5000)
//   }

//  componentDidMount(){
//    setTimeout(()=> {
//      this.testDeposit()
//    }, 5000)
//  }

 async componentDidUpdate(prevProps) {


    if (!this.state.isUpdated || this.props.loggedIn !== prevProps.loggedIn) {
      this.setState({
        isUpdated: true,
      });
      if (this.props.loggedIn) {
        const socket = io(SocketUrl);
        const { user } = this.props;
        const { userToken } = await getToken()

        let tryReconnect = () => {
          if (socket.connected === false) {
            socket.connect();
          } 
        };

        // setInterval(tryReconnect, 30000);
        let intervalID = setInterval(tryReconnect, 30000);
        socket.on("disconnect", async function (reason) {
          intervalID = setInterval(tryReconnect, 2000);
        });

        socket.on("connect_error", (reason) => {
          console.log('|||||||||||||||||||||||||  connect_error ===>', reason)
          debugger
          setTimeout(() => {
            socket.connect();
          }, 1000);
        });

        socket.on("connect", () => {
          clearInterval(intervalID);
          const body = { body: { access_token: userToken } };
          // console.log('authentication userToken', userToken)
          // debugger
          socket.emit("authentication", body);

          socket.on("authenticated", () => {

            socket.on(`/swap/${user.id}`, async (swap) => {
              if (swap.state === "pending") {
                await this.setState({ currentSwap: swap });
              }
              this.swap_management(swap);
            });


            socket.on(`/deposit/${user.id}`, async (deposit) => {
              if (deposit.state === "pending" && deposit.currency_type === "crypto") {
                await this.setState({ currentDeposit: deposit });
              } else {
                this.deposit_mangagement(deposit);
              }
            });



            socket.on(`/withdraw/${user.id}`, async (withdraw) => {
              console.log(withdraw)
              if (withdraw.state === "pending") {
                await this.setState({ currentWithdraw: withdraw });
              }
              this.withdraw_mangagement(withdraw);
            });

            socket.on(`/withdrawAccount/${user.id}`, async (withdrawAccount) => {
              if (withdrawAccount.state === "pending") {
                await this.setState({currentWithdrawAccount: withdrawAccount });
              }
              this.withdraw_account_mangagement(withdrawAccount);
            });

            socket.on(`/profile/${user.id}`, async (status) => {
              if(status.countries){
                this.status_management(status)
              }
            });

          });
        });
      }
    }
  }





  withdraw_account_mangagement = async(withdrawAccount) => {


      if(!this.props.withdraw_accounts[withdrawAccount.id]){return}

      if(withdrawAccount.state === 'in_progress' || withdrawAccount.state === 'complete' || withdrawAccount.state === 'rejected'){
        this.props.action.update_item_state({
          [withdrawAccount.id]: {
            ...this.props.withdraw_accounts[withdrawAccount.id],
            ...withdrawAccount
          }
        }, "withdraw_accounts");

        if(withdrawAccount.state === 'complete'){
          this.props.toastMessage("Nueva cuenta de retiro inscrita", "success");
          this.props.action.success_sound();
        }

      }

  }

  withdraw_mangagement = async (withdraw) => {
    // console.log('||||||||||||||||||||||| withdraw socket console ::', withdraw)

    if (withdraw.proof) {
      if (
        !this.props.withdraws ||
        (this.props.withdraws && !this.props.withdraws[withdraw.id])
      ) {
        // Si no hay ordenes de retiro, ó si las hay, pero no está este retiro dentro de las ordenes disponibles en el estado
        let cWithdraw = await this.props.coinsendaServices.getOrderById(
          withdraw.id,
          "withdraws"
        );
        await this.props.coinsendaServices.get_withdraws(cWithdraw.account_id);
        // entonces consulte las ultimas ordenes de retiro de esta cuenta y actualiza el estado
        await this.setState({ currentWithdraw: cWithdraw });
      }
      // Teniendo la orden de retiro en el estado, agrégue la prueba de pago y actualice el estado a: "aceptado" en el modelo de la orden de retiro
      if (this.props.withdraws && this.props.withdraws[withdraw.id]) {
        await this.props.action.update_item_state(
          {
            [withdraw.id]: {
              ...this.props.withdraws[withdraw.id],
              proof: withdraw.proof,
              sent: true,
              state: "accepted",
            },
          },
          "withdraws"
        );
        await this.props.coinsendaServices.updateActivityState(
          this.props.withdraws[withdraw.id].account_id,
          "withdraws"
        );
        this.props.action.addNotification(
          "wallets",
          {
            account_id: this.props.withdraws[withdraw.id].account_id,
            order_id: withdraw.id,
          },
          1
        );
        // this.props.coinsendaServices.showNotification('Retiro exitoso', 'Retiro enviado con éxito')
        this.props.action.success_sound();
        if (!this.props.isModalActive && !this.props.isRenderModalActive) {
          await this.props.action.socket_notify(
            this.props.withdraws[withdraw.id],
            "withdraws"
          );
          this.props.action.toggleOtherModal();
        }
      }
    }

    if (withdraw.state === "pending" && withdraw.currency_type === "crypto") {
      // Las ordenes de retiro cripto en estado pendiente se deben de confirmar vía api
      let res = await this.props.coinsendaServices.addUpdateWithdraw(
        withdraw.id,
        "confirmed"
      );
      if (!res) {
        this.props.action.isAppLoading(false);
        return this.props.toastMessage(
          "No se ha podido crear la orden de retiro",
          "error"
        );
      }
    }

    const { currentWithdraw } = this.state;
    // console.log('|||||||||||||||||||||||||||||||||||  Withdraw SOCKET ==>', withdraw.state, ' == ', withdraw.id, ' ==> ', currentWithdraw)

    if (
      withdraw.state === "confirmed" &&
      currentWithdraw.currency_type === "crypto"
    ) {
      // Añade esta orden de retiro crypto confirmado al estado
      // actualiza la actividad de la cuenta a la que corresponde este retiro y actualiza el balance
      let new_withdraw_model = {
        id: currentWithdraw.id,
        account_id: currentWithdraw.account_id,
        ...currentWithdraw,
        state: "confirmed",
      };
      await this.props.coinsendaServices.addItemToState(
        "withdraws",
        new_withdraw_model
      );
      await this.props.coinsendaServices.updateActivityState(
        new_withdraw_model.account_id,
        "withdraws"
      );
      await this.props.coinsendaServices.manageBalance(
        new_withdraw_model.account_id,
        "reduce",
        new_withdraw_model.amount
      );
      await this.props.action.isAppLoading(false);
      this.props.action.add_new_transaction_animation();
      // this.props.coinsendaServices.getWalletsByUser(true)
      this.props.history.push(
        `/wallets/activity/${new_withdraw_model.account_id}/withdraws`
      );
    }

    if (
      withdraw.state === "accepted" &&
      currentWithdraw.currency_type === "fiat"
    ) {
      let new_withdraw = this.state.currentWithdraw;
      await this.props.coinsendaServices.addItemToState("withdraws", {
        ...new_withdraw,
        state: "confirmed",
      });
      await this.props.coinsendaServices.updateActivityState(
        new_withdraw.account_id,
        "withdraws"
      );
      this.props.action.add_new_transaction_animation();
      // alert('withdraw accepted')
      //update used_counter of withdraw account relation

      if (this.props.withdraw_accounts[currentWithdraw.withdraw_account_id]) {
        let withdraw_account = this.props.withdraw_accounts[
          currentWithdraw.withdraw_account_id
        ];
        //actualiza el movimiento operacional de la cuenta de retiro
        this.props.action.update_item_state(
          {
            [currentWithdraw.withdraw_account_id]: {
              ...withdraw_account,
              used_counter: ++withdraw_account.used_counter,
              inscribed: true,
            },
          },
          "withdraw_accounts"
        );
      }
    }

    // if(withdraw.metadata && !withdraw.state){
    //   // alert('withdraw socket')
    //
    //     const { userId } = withdraw
    //     let fiat_accounts = await this.props.coinsendaServices.getFiatAccountByUserId()
    //     if(!fiat_accounts){return false}
    //
    //     for (let i = 0; i < fiat_accounts.length; i++) {
    //       if(fiat_accounts[i].currency.currency !== 'usd'){
    //         const { activity_for_account } = this.props
    //         if(activity_for_account[fiat_accounts[i].id] && activity_for_account[fiat_accounts[i].id].withdraws){return false}
    //         await this.props.coisendaServices.get_withdraws(fiat_accounts[i].id)
    //       }
    //     }
    //     this.props.toastMessage('Retiro(s) ha(n) sido enviado(s) a tu cuenta bancaria.', 'success')
    //     this.props.action.success_sound()
    //
    // }
  };

  deposit_mangagement = async (deposit) => {

    if (deposit.state === "pending" && deposit.currency_type === "fiat") {
      await this.props.coinsendaServices.addItemToState("deposits", {
        ...deposit,
        type_order: "deposit",
      });
      await this.props.coinsendaServices.updateActivityState(
        deposit.account_id,
        "deposits"
      );
    }

    // if(deposit.state === 'confirmed' && && this.state.currentDeposit.currency_type === 'crypto')){
    if (deposit.state === "confirmed") {
      if (!this.props.deposits || (this.props.deposits && !this.props.deposits[deposit.id])) {

        // si el deposito no está en el estado, es porque es de tipo cripto...
        let cDeposit = await this.props.coinsendaServices.getDepositById(deposit.id);
        // console.log('|||||||| _______________________________________DEPOSIT cDeposit', deposit.id)
        
        if (this.props.activity_for_account[cDeposit.account_id] && this.props.activity_for_account[cDeposit.account_id].deposits) {
          await this.props.coinsendaServices.addItemToState("deposits", {
            ...cDeposit,
            type_order: "deposit",
          });
          await this.props.coinsendaServices.updateActivityState(cDeposit.account_id, "deposits");
        } else {
          await this.props.coinsendaServices.get_deposits(cDeposit.account_id);
        }
        this.props.action.update_item_state(
          {
            [cDeposit.account_id]: {
              ...this.props.wallets[cDeposit.account_id],
              count: 1,
            },
          },
          "wallets"
        ); //actualiza el movimiento operacional de la wallet
        this.props.action.addNotification("wallets", { account_id: cDeposit.account_id, order_id: cDeposit.id }, 1);
        // this.props.coinsendaServices.showNotification('Deposito Cripto', 'Nuevo deposito detectado')
        await this.props.action.socket_notify(
          { ...cDeposit, state: "confirmed" },
          "deposits",
          "Nuevo deposito detectado"
        );
        this.props.action.toggleOtherModal();
        this.props.action.success_sound();
        setTimeout(() => {
          this.props.action.add_coin_sound();
        }, 1500);
      }
    }


    if (deposit.confirmations) {

      if (!this.props.deposits || (this.props.deposits && !this.props.deposits[deposit.id])) {
        let cDeposit = await this.props.coinsendaServices.getOrderById(deposit.id, "deposits");
        await this.props.coinsendaServices.get_deposits(cDeposit.account_id);
        // console.log('=============> DEPOSIT SOCKET ', cDeposit)
      }

      if (this.props.deposits && this.props.deposits[deposit.id]) {
        await this.props.action.update_item_state(
          {
            [deposit.id]: {
              ...this.props.deposits[deposit.id],
              confirmations: deposit.confirmations,
              state:deposit.confirmations > 5 ? 'accepted' : 'confirmed'
            },
          },
          "deposits"
        );
        await this.props.coinsendaServices.updateActivityState(this.props.deposits[deposit.id].account_id, "deposits");
      }
      return;
    }





    if (deposit.state === "accepted") {
      let cDeposit = await this.props.coinsendaServices.getOrderById(
        deposit.id,
        "deposits"
      );

      if (!this.props.deposits || (this.props.deposits && !this.props.deposits[deposit.id])) {
        await this.props.coinsendaServices.get_deposits(cDeposit.account_id);
      }

      if (this.props.deposits && this.props.deposits[deposit.id]) {
        this.props.action.update_item_state(
          {
            [cDeposit.account_id]: {
              ...this.props.wallets[cDeposit.account_id],
              count: 1,
            },
          },
          "wallets"
        ); //actualiza el movimiento operacional de la wallet
        this.props.action.addNotification(
          "wallets",
          {
            account_id: this.props.deposits[deposit.id].account_id,
            order_id: deposit.id,
          },
          1
        );
        await this.props.action.update_item_state(
          {
            [deposit.id]: {
              ...this.props.deposits[deposit.id],
              state: deposit.state,
            },
          },
          "deposits"
        );
        await this.props.coinsendaServices.updateActivityState(
          this.props.deposits[deposit.id].account_id,
          "deposits"
        );
        await this.props.coinsendaServices.getWalletsByUser(true);
        await this.props.action.socket_notify(
          this.props.deposits[deposit.id],
          "deposits"
        );
        await this.props.action.renderModal(null);
        this.props.action.toggleOtherModal();
        this.props.action.success_sound();
        // this.props.coinsendaServices.showNotification('Deposito aceptado', 'Tu deposito ha sido aceptado exitosamente')
        setTimeout(() => {
          this.props.action.add_coin_sound();
        }, 1500);
      }
    }








    if (deposit.state === "rejected" || deposit.state === "canceled") {
      if (this.props.deposits[deposit.id].state === "canceled") {
        return false;
      }
      // setTimeout(async()=>{
      // Tiempo para que transcurra la animación del item

      setTimeout(async () => {
        await this.props.action.update_item_state(
          {
            [deposit.id]: {
              ...this.props.deposits[deposit.id],
              state: deposit.state,
            },
          },
          "deposits"
        );
        await this.props.coinsendaServices.updateActivityState(
          this.props.deposits[deposit.id].account_id,
          "deposits"
        );
        // await this.props.action.update_pending_activity(this.props.deposits[deposit.id].account_id, 'deposits')
      }, 500);
      this.props.action.exit_sound();
      let state = deposit.state === "canceled" ? "cancelado" : "rechazado";
      this.props.toastMessage(`Deposito ${state}`, "error");
      // }, 2000)
    }

    if (deposit.state === "confirmed") {
      // console.log('deposito confirmado fiat')
      // this.props.coinsendaServices.showNotification('Deposito fiat', 'Su deposito ha sido confirmado con éxito')
      if (
        this.props.deposits &&
        this.props.deposits[deposit.id] &&
        this.props.deposits[deposit.id].currency_type === "fiat"
      ) {
        await this.props.action.update_item_state(
          {
            [deposit.id]: {
              ...this.props.deposits[deposit.id],
              state: deposit.state,
            },
          },
          "deposits"
        );
        await this.props.coinsendaServices.updateActivityState(
          this.props.deposits[deposit.id].account_id,
          "deposits"
        );
        await this.props.coinsendaServices.getWalletsByUser(true);
        // this.props.history.push('?form=deposit_confirmed_success')
        this.props.action.isAppLoading(false);
        this.props.action.success_sound();
        this.props.toastMessage("Deposito confirmado con exito", "success");
      }
    }
  };







  swap_management = async (swap) => {
    // console.log('||||||||||||||||||||||||||||| ===========> SOCKET SWAP => ', swap.state, '  ==>  ', swap)
    // debugger


    if (swap.state === "pending") {
      // await this.props.action.current_section_params({ active_trade_operation: true })
      // el bought lo retorna el socket en el estado aceptado
      let new_swap = swap;
      await this.props.coinsendaServices.addItemToState("swaps", {
        ...new_swap,
        state: "pending",
        activeTrade: true,
      });
      await this.props.coinsendaServices.updateActivityState(
        new_swap.account_from,
        "swaps"
      );
      this.props.action.isAppLoading(false);
      await this.props.history.push(`/wallets/activity/${new_swap.account_from}/swaps`);
      this.props.action.add_new_transaction_animation();
    }


    if(swap.state === 'rejected' || swap.state === 'canceled'){

      setTimeout(async () => {
        this.props.action.update_item_state(
          {
            [this.state.currentSwap.id]: {
              ...this.props.swaps[this.state.currentSwap.id],
              state: swap.state,
              bought: swap.bought,
              activeTrade: false
            },
          },
          "swaps"
        );
        this.props.coinsendaServices.updateActivityState(this.state.currentSwap.account_from, "swaps");
        this.props.action.ticket_rejected();
        return this.props.toastMessage("El intercambio no se pudo realizar, contacta con soporte", "error");
      }, 2500);

    }




    if (swap.state === "accepted" && this.state.currentSwap.state !== "done") {
      const { currentSwap } = this.state;

      await this.setState({ currentSwap: { ...currentSwap, state: "done" } });
      setTimeout(async () => {
        await this.props.action.success_sound();
        this.props.action.update_item_state(
          {
            [currentSwap.id]: {
              ...this.props.swaps[currentSwap.id],
              state: "confirmed",
              bought: swap.bought,
            },
          },
          "swaps"
        );
      }, 2500);

      setTimeout(async () => {
        this.props.action.update_item_state(
          {
            [currentSwap.id]: {
              ...this.props.swaps[currentSwap.id],
              state: "accepted",
            },
          },
          "swaps"
        );
        await this.props.action.success_sound();
        setTimeout(async () => {
          await this.props.action.update_item_state(
            {
              [currentSwap.id]: {
                ...this.props.swaps[currentSwap.id],
                activeTrade: false,
              },
            },
            "swaps"
          );
          await this.props.coinsendaServices.manageBalance(
            currentSwap.account_from,
            "reduce",
            currentSwap.spent
          );
          await this.props.action.add_coin_sound();
          await this.props.toastMessage(
            "Nuevo intercambio realizado",
            "success"
          );
          this.props.coinsendaServices.updateActivityState(currentSwap.account_from, "swaps");
        }, 2000);
      }, 5500);

      // add the acredited order into account to
      if (this.props.wallets[currentSwap.account_to]) {
        const { wallets } = this.props;
        this.props.coinsendaServices.updateActivityState(
          currentSwap.account_to,
          "swaps"
        );
        this.props.action.update_item_state(
          {
            [currentSwap.account_to]: {
              ...wallets[currentSwap.account_to],
              count: 1,
            },
          },
          "wallets"
        );
      }
    }



    if (swap.status === "error") {
      this.props.toastMessage(
        "El intercambio no se pudo realizar, contacta con soporte",
        "error"
      );
      this.props.action.ticket_canceled();
      // this.props.action.current_section_params({swap_socket_channel:this.state.currentSwap})
    }
  };


  status_management = async(status) => {
    await this.props.coinsendaServices.updateUserStatus(status)
    if(status.countries.international === 'level_1'){
      this.props.coinsendaServices.init()
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state, props) => {
  // console.log('||||||||||||||||||||||||||||||||||||||||||||| ======>>> props Sockets ==> ', props)

  const { loggedIn } = state.auth;
  const {
    user,
    deposits,
    withdraws,
    wallets,
    withdraw_accounts,
    swaps,
  } = state.modelData;
  const { ui } = state;

  return {
    loggedIn,
    user: user,
    deposits,
    withdraws,
    activity_for_account: state.storage.activity_for_account,
    wallets,
    swaps,
    withdraw_accounts,
    isModalActive: ui.otherModal,
    isRenderModalActive: ui.modal.render,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    action: bindActionCreators(actions, dispatch),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withCoinsendaServices(SocketsComponent))
);
