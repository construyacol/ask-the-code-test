import React from "react"
import useKeyActionAsClick from "../hooks/useKeyActionAsClick"

export default function withKeyActions(AsComponent, eventName = 'onkeydown') {
    return function (props) {
        const idCancel = useKeyActionAsClick(true, `cancel-button-${eventName}`, 8, true, eventName, true)
        const idAccept = useKeyActionAsClick(true, `accept-button-${eventName}`, 13, false, eventName, true)

        return (                        
            <AsComponent idCancel={idCancel} idAccept={idAccept}  {...props} />
        )
    }
}