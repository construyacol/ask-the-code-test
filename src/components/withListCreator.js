import React from 'react'
import { useActions } from '../hooks/useActions'
import { useSelector } from 'react-redux'

export default function withListCreator(AsComponent) {
    return function (props) {
        const loader = useSelector(state => state.isLoading.loader)
        const actions = useActions()
        const toProps = {
            verificationState: true,
            loader
        }
        const { isWithdrawView, data } = props
        const newItems = data && Object.keys(data).filter(key => {
            return !(isWithdrawView && data[key].currency_type === 'crypto')
        }).map(key => {
            return data[key]
        })


        return (
            <AsComponent {...toProps} actions={actions} items={newItems} {...props} />
        )
    }
}
