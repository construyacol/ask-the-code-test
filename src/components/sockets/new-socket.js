import { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import io from 'socket.io-client'
import Environtment from '../../environment'
// import { objectToArray } from '../../services'
import { withRouter } from "react-router";
import { useCoinsendaServices } from '../../services/useCoinsendaServices'
const { SocketUrl } = Environtment

let INTERVAL_ID = null
let SOCKET = null

function CoinsendaSocket({ actions, withdraws, deposits, activity_for_account, history, loggedIn, user }) {
    const [currentSwap, setCurrentSwap] = useState(null)
    const [currentDeposit, setCurrentDeposit] = useState(null)
    const [currentWithdraw, setCurrentWithdraw] = useState(null)
    const [mainService] = useCoinsendaServices()

    useEffect(() => {
        if (loggedIn) {
            SOCKET = io(SocketUrl)

            const tryReconnect = () => {
                if (SOCKET.connected === false) {
                    SOCKET.connect()
                }
            }
            SOCKET.on('disconnect', async function () {
                INTERVAL_ID = setInterval(tryReconnect, 2000)
            });

            SOCKET.on("connect", () => {
                clearInterval(INTERVAL_ID)
                const body = { body: { access_token: user.userToken } }
                SOCKET.emit('authentication', body);

                SOCKET.on("authenticated", () => {
                    SOCKET.on(`/swap/${user.id}`, async (swap) => {
                        if (swap.state === 'pending') {
                            setCurrentSwap(swap)
                        }
                        swapManagement(swap)
                    })

                    SOCKET.on(`/deposit/${user.id}`, async (deposit) => {
                        if (deposit.state === 'pending' && deposit.currency_type === 'crypto') {
                            setCurrentDeposit(deposit)
                        } else {
                            depositManagement(deposit)
                        }
                    })

                    SOCKET.on(`/withdraw/${user.id}`, async (withdraw) => {
                        if (withdraw.state === 'pending') {
                            setCurrentWithdraw(withdraw)
                        }
                        withdrawManagement(withdraw)
                    })
                })
            })
        }
        return () => {
            SOCKET && SOCKET.disconnect()
        }
    }, [loggedIn])

    const withdrawManagement = async ({ id, proof, state, currency_type, history }) => {
        if (proof) {
            if (!withdraws || (withdraws && !withdraws[id])) {
                const response = await mainService.getOrderById(id, 'withdraws')
                await actions.get_withdraws(response.account_id)
            }

            if (withdraws && withdraws[id]) {
                await actions.update_item_state({ [id]: { ...withdraws[id], proof: proof, sent: true, state: "accepted" } }, 'withdraws')
                await actions.update_activity_state(withdraws[id].account_id, 'withdraws')
                actions.addNotification('wallets', { account_id: withdraws[id].account_id, order_id: id }, 1)
                await actions.socket_notify(withdraws[id], 'withdraws')
                actions.other_modal_toggle()
                actions.success_sound()
            }
        }

        if (state === 'pending' && currency_type === 'crypto') {
            const res = await mainService.addUpdateWithdraw(id, 'confirmed')
            if (!res) {
                actions.isAppLoading(false)
                return actions.mensaje('No se ha podido crear la orden de retiro', 'error')
            }
        }

        if (state === 'confirmed' && currentWithdraw.currency_type === 'crypto') {
            const new_withdraw_model = {
                id: currentWithdraw.id,
                unique_id: currentWithdraw.id,
                type_order: 'withdraw',
                account_id: currentWithdraw.account_id,
                ...currentWithdraw,
                state: "confirmed"
            }

            await actions.add_item_state('withdraws', new_withdraw_model)
            await actions.update_activity_state(new_withdraw_model.account_id, 'withdraws')
            await actions.ManageBalance(new_withdraw_model.account_id, 'reduce', new_withdraw_model.amount)
            await actions.isAppLoading(false)
            actions.add_new_transaction_animation()
            actions.get_account_balances(user)
            history.push(`/wallets/activity/${new_withdraw_model.account_id}/withdraws`)
        }

        if (state === 'accepted' && currentWithdraw.currency_type === 'fiat') {
            const newWithdraw = {
                account_id: currentWithdraw.account_id,
                amount: currentWithdraw.amount,
                amount_neto: currentWithdraw.amount_neto,
                comment: "",
                country: currentWithdraw.country,
                currency: currentWithdraw.currency,
                currency_type: currentWithdraw.currency_type,
                cost: currentWithdraw.cost,
                cost_struct: currentWithdraw.cost_struct,
                deposit_provider_id: "",
                expiration_date: new Date(),
                id: currentWithdraw.id,
                state: "confirmed",
                sent: false,
                unique_id: currentWithdraw.id,
                userId: currentWithdraw.userId,
                withdraw_account: currentWithdraw.withdraw_account_id,
                withdraw_provider: currentWithdraw.withdraw_provider_id,
                type_order: "withdraw",
            }

            await actions.add_item_state('withdraws', newWithdraw)
            await actions.update_activity_state(newWithdraw.account_id, 'withdraws')
            actions.add_new_transaction_animation()
        }
    }

    const depositManagement = async (deposit) => {
        const { state, currency_type, account_id, id, confirmations } = deposit
        if (state === 'pending' && currency_type === 'fiat') {
            await actions.add_item_state('deposits', { ...deposit, type_order: 'deposit' })
            await actions.update_activity_state(account_id, 'deposits')
        }

        if (state === 'confirmed') {
            if (!deposits || (deposits && !deposits[id])) {
                const response = await mainService.getDepositById(id)

                if (activity_for_account[response.account_id] && activity_for_account[response.account_id].deposits) {
                    await actions.add_item_state('deposits', { ...response, type_order: 'deposit' })
                    await actions.update_activity_state(response.account_id, 'deposits')
                } else {
                    await actions.get_deposits(response.account_id)
                }

                actions.addNotification('wallets', { account_id: response.account_id, order_id: response.id }, 1)
                await actions.socket_notify({ ...response, state: 'confirmed' }, 'deposits', 'Nuevo deposito detectado')
                actions.other_modal_toggle()
                actions.success_sound()
                // setTimeout
                setTimeout(() => { actions.add_coin_sound() }, 1500)
            }
        }

        if (confirmations) {
            if (!deposits || (deposits && !deposits[id])) {
                const response = await mainService.getDepositById(id, 'deposits')
                await actions.get_deposits(response.account_id)
            }

            if (deposits && deposits[id]) {
                await actions.update_item_state({ [id]: { ...deposits[id], confirmations } }, 'deposits')
                await actions.update_activity_state(deposits[id].account_id, 'deposits')
            }
        }

        if (state === 'accepted') {

            if (!deposits || (deposits && !deposits[id])) {
                const response = await mainService.getDepositById(id, 'deposits')
                await actions.get_deposits(response.account_id)
            }

            if (deposits && deposits[id]) {
                actions.addNotification('wallets', { account_id: deposits[id].account_id, order_id: id }, 1)
                await actions.update_item_state({ [id]: { ...deposits[id], state: state } }, 'deposits')
                await actions.update_activity_state(deposits[id].account_id, 'deposits')
                actions.get_account_balances(user)
                await actions.socket_notify(deposits[id], 'deposits')
                actions.other_modal_toggle()
                actions.success_sound()
                setTimeout(() => { actions.add_coin_sound() }, 1500)
            }
        }

        if (state === 'rejected' || state === 'canceled') {
            if (deposits[id].state === 'canceled') { return false }
            await actions.update_item_state({ [id]: { ...deposits[id], state } }, 'deposits')
            await actions.update_activity_state(deposits[id].account_id, 'deposits')
            actions.exit_sound()
            const auxState = state === 'canceled' ? 'cancelado' : 'rechazado'
            actions.mensaje(`Deposito ${auxState}`, 'error')
        }

        if (state === 'confirmed') {
            if ((deposits && deposits[id]) && deposits[id].currency_type === 'fiat') {
                await actions.update_item_state({ [id]: { ...deposits[id], state: state } }, 'deposits')
                await actions.update_activity_state(deposits[id].account_id, 'deposits')
                actions.get_account_balances(user)
                history.push('?form=deposit_confirmed_success')
            }
        }

    }

    const swapManagement = async (swap) => {
        if (swap.state === 'pending') {
            await actions.current_section_params({ active_trade_operation: true })
            // el bought lo retorna el socket en el estado aceptado

            const newSwap = {
                account_id: swap.account_from,
                account_to: swap.account_to,
                action_price: swap.action_price,
                amount: '--',
                amount_neto: "",
                bought: '--',
                comment: "",
                currency: swap.to_spend_currency,
                currency_bought: swap.to_buy_currency,
                deposit_cost: "",
                deposit_provider_id: "",
                expiration_date: new Date(),
                id: swap.id,
                unique_id: swap.id,
                spent: swap.spent,
                state: swap.state,
                type_order: "swap"
            }

            await actions.add_item_state('swaps', newSwap)
            await actions.update_activity_state(swap.account_from, 'swaps')
            await actions.add_new_transaction_animation()
            actions.isAppLoading(false)
            return history.push(`/wallets/activity/${swap.account_from}/swaps`)
        }


        if (swap.state === 'accepted' && currentSwap && currentSwap.state !== 'done') {
            await actions.current_section_params({ swap_socket_channel: { ...currentSwap, state: 'processing' } })

            return setTimeout(async () => {
                await actions.success_sound()
                await actions.current_section_params({ swap_socket_channel: { ...currentSwap, state: 'done' }, swap_done_id: currentSwap.id, swap_done_out: true })
                await actions.swap_activity_update({ ...currentSwap, bought: swap.bought }, 'swaps')
                setCurrentSwap({ ...currentSwap, state: 'done' })

                setTimeout(async () => {
                    await actions.current_section_params({ active_trade_operation: false })
                    await actions.ManageBalance(currentSwap.account_from, 'reduce', currentSwap.spent)
                }, 4000)
            }, 3500)
        }

        if (swap.status === 'error') {
            actions.mensaje('El intercambio no se pudo realizar, contacta con soporte', 'error')
            actions.ticket_canceled()
        }
    }

    return null
}

const mapStateToProps = (state) => {
    const { loggedIn } = state.auth
    const { user, deposits, withdraws } = state.modelData

    return {
        loggedIn,
        user,
        deposits,
        withdraws,
        activity_for_account: state.storage.activity_for_account
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CoinsendaSocket))
