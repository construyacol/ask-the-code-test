import React from "react"
import { useCoinsendaServices } from "../services/useCoinsendaServices"

export default function withCoinsendaServices(AsComponent) {
    return function (props) {
        const [ coinsendaServices ] = useCoinsendaServices()
        return (                        
            <AsComponent coinsendaServices={coinsendaServices} {...props} />
        )
    }
}