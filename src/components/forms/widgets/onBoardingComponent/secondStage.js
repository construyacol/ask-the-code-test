import { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import {
    Container
} from '../sharedStyles'

import {
    show,
    hide
} from './utils'
import party from './assets/party.png'


const Welcome = props => {

    const executeAnimations = async() => {
        await show('.onBoardingCont__', 4500)
        await hide('.onBoardingCont__', 500)
        props.nextStage()
    }

    useEffect(() => {
        executeAnimations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <Container className="onBoardingCont__" rowGap={15}>
            <img className="flip-in-ver-right" src={party} width={55} alt="party"/>
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



