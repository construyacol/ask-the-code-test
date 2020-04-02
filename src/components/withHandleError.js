import React from "react"
import HandleError from "./widgets/errorView"
import ToastContainers from './widgets/toast/ToastContainer'
import SocketsComponent from './sockets/sockets'

export default function withHandleError(AsComponent) {
    return function (props) {
        return (
            <HandleError>
                <ToastContainers />
                <SocketsComponent />
                <AsComponent {...props} />
            </HandleError>
        )
    }
}