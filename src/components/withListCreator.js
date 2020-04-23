import React from 'react'
import { useCoinsendaServices } from '../services/useCoinsendaServices'
import { useActions } from '../hooks/useActions'

export default function withListCreator(AsComponent) {    
    return function (props) {
        const [, reduxState] = useCoinsendaServices()
        const actions = useActions()
        const { modelData, ui, isLoading } = reduxState
        const toProps = {
            verificationState: ui.verification_state,
            user: modelData.user,
            loader: isLoading.loader
        }
        const { isWithdrawView, data } = props
        const items = data && Object.keys(data).map(key => {
            if (isWithdrawView && data[key].currency_type === 'crypto') return false
            return data[key]
        })

        return (
            <AsComponent {...toProps} actions={actions} items={items} {...props} />
        )
    }
}
