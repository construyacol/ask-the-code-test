import React from "react"
import HandleError from "./widgets/errorView"

export default function withHandleError(AsComponent) {
    return function (props) {
        return (
            <HandleError>                             
                <AsComponent {...props} />
            </HandleError>
        )
    }
}