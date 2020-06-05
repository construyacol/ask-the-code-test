import React from 'react'
import NumberBox from './number-box'

const WithdrawAd = () => {
    const Icon = () => (<i className="far fa-handshake" />)
    return (
        <NumberBox
            style={{ marginBottom: "20%" }}
            textCss="grid-area: bottom-right;"
            Icon={Icon}
            height="135px"
            quantity={"$500.000"} 
            definition="Saldo total en <strong>COP</strong>"
            bottomText={`<p>RETIRAR TOTAL <i class="fas fa-arrow-up"/></p>`}
            withPadding
            center
            />
    )
}

export default WithdrawAd
