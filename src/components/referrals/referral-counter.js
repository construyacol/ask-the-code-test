import React from 'react'
import NumberBox from './number-box'

const ReferralCounter = () => {
    const Icon = () => (<i className="far fa-handshake" />)
    return (
        <NumberBox textCss="grid-area: mid-right;" Icon={Icon} quantity={"500 R"} definition="Referidos" highlight />
    )
}

export default ReferralCounter
