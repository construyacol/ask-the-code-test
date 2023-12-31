import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../actions";
// import io from "socket.io-client";
// import Environtment from "../../environment";
import { withRouter } from "react-router";
import withCoinsendaServices from "../withCoinsendaServices";
import { getUserToken } from 'utils/handleSession'
import { funcDebounce, funcDebounces } from 'utils'
// import { objectToArray } from '../../services'
// let statusCounter = 0
import { checkIfFiat } from 'core/config/currencies';
import { serveModelsByCustomProps } from 'selectors'



import { postLocalNotification } from 'utils'
import socket from 'const/socket'

// const { SocketUrl } = Environtment;
// const socket = io(SocketUrl);
class SocketsComponent extends Component {
  
  state = {
    currentSwap: null,
    currentDeposit: null,
    currentWithdraw: null,
    // isUpdated: false
  };

  // async testSocketExecuted(orderMock) {
  //   console.log('======================================== ______ testSocketExecuted: ', orderMock)
  //     await this.setState({ currentDeposit: orderMock });
  //   } else {
  //     this.deposit_mangagement(orderMock);
  //   }
  // }

  // async testSocket() {

  //   // let identityMock = {
  //   //   id:"6184c8f067e372004414b156",
  //   //   file_state:"accepted"
  //   // }
   

  //   // let orderMock = {
  //   //   id:"6184c8f067e372004414b156",
  //   //   state:"rejected"
  //   // }

  //   // this.withdraw_mangagement(orderMock);
  //   // this.testSocketExecuted()


  //   // let confirmations = 1
  //   // setInterval(()=>{
  //   //   if(confirmations < 7){
  //   //     orderMock = {
  //   //       confirmations: confirmations,
  //   //       id: "617621370b0a1b0048ae9cae"
  //   //     }
  //   //     this.testSocketExecuted(orderMock)
  //   //     confirmations++
  //   //   }
  //   // }, 5000)

  //   // let statusMock = {
  //   //   countries:{
  //   //     international: "level_1"
  //   //   },
  //   //   id: "620403008a485b0067ed919b",
  //   //   updated_at: "2022-02-09T18:09:28.614Z",
  //   //   userId: "620402efbe929e0042d9de6c"
  //   // }

  //   // for (let index = 0; index < 2; index++) {
  //     // this.status_management(statusMock);
  //   // }

  // }

 async componentDidMount(){
 
    let intervalID

    let tryReconnect = () => {
      if (socket.connected === false) {
        socket.connect();
      } 
    };

    // let intervalID = setInterval(tryReconnect, 30000);
    socket.on("disconnect", async function (reason) {
      // console.log(' ============ SOCKET discconect interval ====> ', reason)
      intervalID = setInterval(tryReconnect, 2000);
    });
    

    socket.on("connect", async() => {
      clearInterval(intervalID);
      // console.log(' ============ SOCKET CONNECTED ')
      const { userToken } = await getUserToken()
      const body = { body: { access_token: userToken } };
      socket.emit("authentication", body);
    });
  
      socket.on("authenticated", () => document.querySelector('#home-container')?.classList?.add('socket-authenticated'));

      const { user } = this.props;
       
      socket.on(`/swap/${user.id}`, async (swap) => {
        if (swap.state === "pending") {
          await this.setState({ currentSwap: swap });
        }
        this.swap_management(swap);
      });

      socket.on(`/deposit/${user.id}`, async (deposit) => {
        if (deposit.state === "pending" && !checkIfFiat(deposit.currency)) {
          await this.setState({ currentDeposit: deposit });
        } else {
          this.deposit_mangagement(deposit);
        }
      });

      socket.on(`/withdraw/${user.id}`, async (withdraw) => {
        // console.log(withdraw)
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

      socket.on(`/identity/${user.id}`, async (identity) => {
        if(identity.file_state || identity.info_state){
          this.identity_management(identity)
        }
      });

      socket.on(`/identity_delete/${user.id}`, async (identity) => {
        this.props.coinsendaServices.updateUserStatus()
      });
 }




//  async componentDidUpdate(prevProps, prevState) {

//     // if (this.props.loggedIn !== prevProps.loggedIn) {
//       if (this.props.loggedIn) {
//         const { user } = this.props;
       
//         socket.once(`/swap/${user.id}`, async (swap) => {
//           if (swap.state === "pending") {
//             await this.setState({ currentSwap: swap });
//           }
//           this.swap_management(swap);
//         });

//         socket.once(`/deposit/${user.id}`, async (deposit) => {
//             await this.setState({ currentDeposit: deposit });
//           } else {
//             this.deposit_mangagement(deposit);
//           }
//         });

//         socket.once(`/withdraw/${user.id}`, async (withdraw) => {
//           console.log(withdraw)
//           if (withdraw.state === "pending") {
//             await this.setState({ currentWithdraw: withdraw });
//           }
//           this.withdraw_mangagement(withdraw);
//         });

//         socket.once(`/withdrawAccount/${user.id}`, async (withdrawAccount) => {
//           if (withdrawAccount.state === "pending") {
//             await this.setState({currentWithdrawAccount: withdrawAccount });
//           }
//           this.withdraw_account_mangagement(withdrawAccount);
//         });

//         socket.once(`/identity/${user.id}`, async (identity) => {
//           if(identity.file_state){
//             this.identity_management(identity)
//           }
//         });

//       }
//     // }
//   }

withdraw_account_mangagement = async(withdrawAccount) => {
    // console.log('withdraw_account_mangagement', withdrawAccount)
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
  // console.log('SOCKETwithdraw_mangagement', withdraw)
  if (withdraw.proof || (withdraw?.metadata?.withdraw_proof && withdraw?.metadata?.is_internal)) {
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


      funcDebounces({
        keyId:{[`withdraw_${withdraw?.state}`]:withdraw.id}, 
        storageType:"sessionStorage",
        timeExect:1500,
        callback:() => {
          postLocalNotification({
            title:"Coinsenda",
            summaryText:"Enhorabuena",
            largeBody:"¡Tu retiro ha sido debitado!",
            body:"¡Tu retiro ha sido debitado!"
          })
        }
      })

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

  if (withdraw.state === "pending" && !checkIfFiat(withdraw.currency)) {
    // Las ordenes de retiro cripto en estado pendiente se deben de confirmar vía api
    sessionStorage.removeItem(`withdrawInProcessFrom${withdraw?.account_id}`)
    funcDebounce( 
      {'storageCryptoWithdraw':`${withdraw.id}_${withdraw.state}`}, 
      async() => { 
        let { error } = await this.props.coinsendaServices.addUpdateWithdraw(withdraw.id, "confirmed");
        this.props.action.isAppLoading(false);
        if (error) return this.props.toastMessage(error?.message, "error");
      },
      false,
      8000
    );
  } 

  const { currentWithdraw } = this.state;
  // console.log('||||||||||||||||||||||| withdraw socket console ::', withdraw, currentWithdraw)
  // debugger
  // console.log('|||||||||||||||||||||||||||||||||||  Withdraw SOCKET ==>', withdraw.state, ' == ', withdraw.id, ' ==> ', currentWithdraw)
  if (withdraw.state === "confirmed" && !checkIfFiat(currentWithdraw.currency)) {
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
    
    if(sessionStorage.getItem(`withdrawToBitrefill${new_withdraw_model?.account_id}`)) return sessionStorage.removeItem(`withdrawToBitrefill${new_withdraw_model?.account_id}`);
    this.props.history.push(`/wallets/activity/${new_withdraw_model.account_id}/withdraws`);
  }

  if (withdraw.state === "accepted" && checkIfFiat(currentWithdraw.currency)) {

    let new_withdraw = {...this.state.currentWithdraw};
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

    this.props.history.push(`/wallets/activity/${new_withdraw.account_id}/withdraws`);
  }


  if (withdraw.state === "rejected" || withdraw.state === "canceled") {
    
    // await this.props.coinsendaServices.get_withdraws(this.props.withdraws[withdraw.id].account_id)
    setTimeout(async () => {
      await this.props.action.update_item_state(
        { 
          [withdraw.id]: {
            ...this.props.withdraws[withdraw.id],
            state: withdraw.state,
          },
        },
        "withdraws"
      );

      await this.props.coinsendaServices.updateActivityState(
        this.props.withdraws[withdraw.id].account_id,
        "withdraws"
      );

      await this.props.coinsendaServices.getWalletsByUser(true)

    }, 500);

    // this.props.action.exit_sound();
    let state = withdraw.state === "canceled" ? "cancelado" : "rechazado";
    this.props.toastMessage(`Retiro ${state}`, "error");

    funcDebounces({
      keyId:{[`withdraw_${withdraw?.state}`]:withdraw.id}, 
      storageType:"sessionStorage",
      timeExect:1500,
      callback:() => {
        postLocalNotification({
          title:"Coinsenda",
          summaryText:"Algo ha salido mal :(",
          largeBody:`¡Tu retiro No se ha podido realizar!`,
          body:`¡Tu retiro No se ha podido realizar!`
        })
      }
    })
  }
};

  deposit_mangagement = async (deposit) => {

    console.log('deposit_mangagement', deposit)
    // debugger

    if (deposit.state === "pending" && checkIfFiat(deposit.currency)) {
      await this.props.coinsendaServices.addItemToState("deposits", {
        ...deposit,
        type_order: "deposit",
      });
      await this.props.coinsendaServices.updateActivityState(
        deposit.account_id,
        "deposits"
      );

      this.props.action.update_item_state(
        {
          [deposit.account_id]: {
            ...this.props.wallets[deposit.account_id],
            count: 1,
          },
        },
        "wallets"
      );
    }

    if (deposit.state === "confirmed") {
      // console.log('||||||| SOCKET RESPONSE  ===>', deposit)
      sessionStorage.removeItem(`depositOrder_${deposit?.id}`)
      if (!this.props.deposits || (this.props.deposits && !this.props.deposits[deposit.id])) {
        // si el deposito no está en el estado, es porque es de tipo cripto...
        let cDeposit = await this.props.coinsendaServices.getDepositById(deposit.id);
        // console.log('|||||||| _______________________________________DEPOSIT cDeposit', cDeposit)
        if(cDeposit?.info?.is_referral) return;

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
          "Nuevo depósito detectado"
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
        const depositProvider = this.props.deposit_providers[this.props.deposits[deposit.id]?.deposit_provider_id]
        const depositAccountsByProvType = serveModelsByCustomProps(this.props.depositAccounts, 'provider_type')
        const depositAccount = depositAccountsByProvType[depositProvider?.provider_type];

        await this.props.action.update_item_state(
          {
            [deposit.id]: {
              ...this.props.deposits[deposit.id],
              confirmations: deposit.confirmations,
              state:deposit.confirmations > (depositAccount?.confirmations || 6) ? 'accepted' : 'confirmed'
            },
          },
          "deposits"
        );
        await this.props.coinsendaServices.updateActivityState(this.props.deposits[deposit.id].account_id, "deposits");
      }
      return;
    }





    if (deposit.state === "accepted") {


        funcDebounces({
          keyId:{[`deposit_${deposit?.state}`]:deposit.id}, 
          storageType:"sessionStorage",
          timeExect:1500,
          callback:() => {
            postLocalNotification({
              title:"Coinsenda",
              summaryText:"Enhorabuena",
              largeBody:"¡Tu depósito ha sido acreditado!",
              body:"¡Tu depósito ha sido acreditado!"
            })
          }
        })

      

      let cDeposit = await this.props.coinsendaServices.getOrderById(
        deposit.id,
        "deposits"
      );

        if (cDeposit?.info?.is_referral && this.props.activity_for_account[cDeposit.account_id] && this.props.activity_for_account[cDeposit.account_id].deposits) {
          await this.props.coinsendaServices.addItemToState("deposits", {
            ...cDeposit,
            type_order: "deposit",
          });
        } else if (!this.props.deposits || (this.props.deposits && !this.props.deposits[deposit.id])) {
          await this.props.coinsendaServices.get_deposits(cDeposit.account_id);
        }


      if (this.props.deposits && this.props.deposits[deposit.id]) {

        this.props.action.update_item_state(
          //actualiza el movimiento operacional de la wallet
          {
            [cDeposit.account_id]: {
              ...this.props.wallets[cDeposit.account_id],
              count: 1,
            },
          },
          "wallets"
        ); 
        
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

      funcDebounces({
        keyId:{[`deposit_${deposit?.state}`]:deposit.id}, 
        storageType:"sessionStorage",
        timeExect:1500,
        callback:() => {
          postLocalNotification({
            title:"Coinsenda",
            summaryText:"",
            largeBody:"Tu depósito NO ha sido aprobado",
            body:"Tu depósito NO ha sido aprobado"
          })
        }
      })

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
        await this.props.coinsendaServices.getWalletsByUser(true)
        // await this.props.action.update_pending_activity(this.props.deposits[deposit.id].account_id, 'deposits')
      }, 500);
      this.props.action.exit_sound();
      let state = deposit.state === "canceled" ? "cancelado" : "rechazado";
      this.props.toastMessage(`Depósito ${state}`, "error");
      // }, 2000)
    }

    if (deposit.state === "confirmed") {
      // console.log('deposito confirmado fiat')
      // this.props.coinsendaServices.showNotification('Deposito fiat', 'Su deposito ha sido confirmado con éxito')
      // alert('confirmed')
    // console.log('SOCKET_DEPOSIT_MANAGEMENT ==> ', deposit)

      if (
        this.props.deposits &&
        this.props.deposits[deposit.id] &&
        checkIfFiat(this.props.deposits[deposit.id].currency)
      ) {
        await this.props.action.update_item_state(
          {
            [deposit.id]: {
              ...deposit,
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
        this.props.toastMessage("Depósito confirmado con exito", "success");
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
          this.props.coinsendaServices.updateActivityState(currentSwap.account_to, "swaps");
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



  // funcDebounces({
  //   keyId:{[`withdraw_${withdraw?.state}`]:withdraw.id}, 
  //   storageType:"sessionStorage",
  //   timeExect:1500,
  //   callback:() => {
  //     postLocalNotification({
  //       title:"Coinsenda",
  //       summaryText:"Algo ha salido mal :(",
  //       largeBody:`¡Tu retiro No se ha podido realizar!`,
  //     })
  //   }
  // }) 
  

  identity_management = async(identity) => {
    // console.log('identitysocket =====================================> ', identity)
    if(["accepted"].includes(identity.file_state)){
      funcDebounces({
        keyId:{[`identity_${identity.id}`]:`${identity.file_state}_${identity.id}`}, 
        storageType:"sessionStorage",
        timeExect:5000,
        callback:async() => {
          await this.props.coinsendaServices.updateUserStatus(identity)
          this.props.coinsendaServices.init()
          this.props.history.push(`/wallets`);
          postLocalNotification({  
            title:"Coinsenda",
            summaryText:"Enhorabuena",
            largeBody:`¡Felicidades, tu cuenta ha sido verificada!`,
          })
        }
      })
    }else{
      funcDebounces({
        keyId:{[`identity_${identity.id}`]:`${identity.id}`}, 
        storageType:"sessionStorage",
        timeExect:3000,
        callback: async() => {
          await this.props.coinsendaServices.updateUserStatus(identity)
        }
      })
    }
  }

  render() {
    return <></>;
  }

}




const mapStateToProps = (state, props) => {
  // console.log('||||||||||||||||||||||||||||||||||||||||||||| ======>>> props Sockets ==> ', props)

  const { loggedIn } = state.auth;
  const {
    user,
    depositAccounts,
    deposits,
    withdraws,
    wallets,
    withdraw_accounts,
    swaps,
    currencies,
    deposit_providers
  } = state.modelData;
  const { ui } = state;

  return {
    loggedIn,
    user: user,
    deposits,
    depositAccounts,
    withdraws,
    activity_for_account: state.storage.activity_for_account,
    wallets,
    swaps,
    withdraw_accounts,
    isModalActive: ui.otherModal,
    isRenderModalActive: ui.modal.render,
    currencies,
    deposit_providers
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
