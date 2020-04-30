import React, { useState, useEffect } from 'react'
import { useActions } from '../hooks/useActions'
import { useSelector } from 'react-redux'

export default function withListCreator(AsComponent) {    
    return function (props) {
        const { isLoading } = useSelector(state => state)
        const actions = useActions()
        const [items, setItems] = useState([])
        const toProps = {
            verificationState: true,
            loader: isLoading.loader
        }
        const { isWithdrawView, data } = props
        
        useEffect(() => {
            const newItems = data && Object.keys(data).filter(key => {
                return !(isWithdrawView && data[key].currency_type === 'crypto')
            }).map(key => {            
                return data[key]
            })
            setItems(newItems)
        }, [JSON.stringify(data)])
        

        return (
            <AsComponent {...toProps} actions={actions} items={items} {...props} />
        )
    }
}
