import { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import {
    Container
} from '../sharedStyles'

import {
    show,
    hide
} from './utils'


const Welcome = props => {

    const executeAnimations = async() => {
        await show('.onBoardingCont__', 5000)
        await hide('.onBoardingCont__', 500)
        props.nextStage()
    }

    useEffect(() => {
        executeAnimations()
    }, [])

    return(
        <Container className="onBoardingCont__">
            <h1 className="fuente flip-in-ver-right">🎉</h1>
            <CopyContainer>
                <p className="fuente">
                    Gracias por elegir <span>Coinsenda</span>, el intercambio de criptomonedas más seguro y confiable
                </p>
            </CopyContainer>
        </Container>
    )

}

export default Welcome





const CopyContainer = styled.div`
    display:flex;
    p{
        font-size: 1em;
        text-align: center;
        max-width: 520px;
        line-height: 25px;
        font-size: 1em;
        color:#4e4e4e;
    }

    p > span{
        font-size: 1em;
        font-weight: bolder;
        color: #0198ff;
    }
`



