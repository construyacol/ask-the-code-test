import React from "react"
import { useCoinsendaServices } from "../services/useCoinsendaServices"
import { useToastMesssage } from "../hooks/useToastMessage"

export default function withCoinsendaServices(AsComponent) {
    return function (props) {
        const [ coinsendaServices ] = useCoinsendaServices()
        const [ toastMessage ] = useToastMesssage()
        return (                        
            <AsComponent toastMessage={toastMessage} coinsendaServices={coinsendaServices} {...props} />
        )
    }
}