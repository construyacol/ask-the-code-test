import React from "react"
import useKeyActionAsClick from "../hooks/useKeyActionAsClick"

export default function withKeyActions(AsComponent) {
    return function (props) {
        const idCancel = useKeyActionAsClick(true, 'cancel-button', 8, true, 'onkeyup', true)
        const idAccept = useKeyActionAsClick(true, 'accept-button', 13, false, 'onkeyup', true)

        return (                        
            <AsComponent idCancel={idCancel} idAccept={idAccept}  {...props} />
        )
    }
}