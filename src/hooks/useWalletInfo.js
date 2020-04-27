import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function useWalletInfo() {
    const { balances, wallets } = useSelector(({ modelData }) => modelData)
    const { pairsForAccount } = useSelector(({ ui }) => ui.current_section)
    const { account_id } = useParams()

    if (!balances || !wallets || !account_id) {
        return { currentWallet: null, availableBalance: null, currentPair: null, currencyPairs: null }
    }

    const currentWallet = wallets[account_id]
    const availableBalance = balances[currentWallet.id].available
    const currentPair = {
        pair_id: pairsForAccount && pairsForAccount[currentWallet.id].current_pair.pair_id,
        secondary_coin: pairsForAccount && pairsForAccount[currentWallet.id].current_pair.currency,
        secondary_value: pairsForAccount && pairsForAccount[currentWallet.id].current_pair.currency_value
    }
    const currencyPairs = pairsForAccount && pairsForAccount[currentWallet.currency.currency].all_pairs

    return { currentWallet, availableBalance, currentPair, currencyPairs }
}