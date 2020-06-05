import React from 'react'
import NumberBox from './number-box'
import { Handshake } from '../widgets/icons'

const ReferralCounter = () => {
    return (
        <NumberBox 
            textCss="grid-area: mid-right;" 
            Icon={Handshake} 
            quantity={"500 R"} 
            definition="Referidos" 
            highlight
            responsive={true}
        />
    )
}

export default ReferralCounter
