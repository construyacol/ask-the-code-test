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
        await show('.onBoardingCont__', 4000)
        await hide('.onBoardingCont__', 500)
        props.nextStage()
    }

    useEffect(() => {
        executeAnimations()
    }, [])

    return(
        <Container className="onBoardingCont__">
            <h1 className="fuente">Hola</h1>
            <HandContainer>
                <Hand>👋</Hand>
                <WelcomeText>
                    <p className="fuente">
                        Bienvenido(a)
                    </p>
                </WelcomeText>
            </HandContainer>
        </Container>
    )

}

export default Welcome


const welcomeAnimation = keyframes`
    0% {
        width: 0px;
    }
    100%{
        width: 245px;
    }
`;


const WelcomeText = styled.div`
    overflow: hidden;
    width: 0;
    animation: ${welcomeAnimation} .2s .9s linear forwards;
    position:relative;

    &::after{
        content: "";
        position: absolute;
        width: 40px;
        height: 100%;
        background: white;
        top: 0;
        right: -10px;
        filter: blur(7px);
        pointer-events: none;
    }

    p{
        font-size: 35px;
        margin: 0;
        color:#0198ff;
    }
`



const HandContainer = styled.div`
    display:flex;
`






const handAnimation = keyframes`
    0% {
        transform: rotate(0deg);
    }
    50%{
        transform: rotate(45deg);
    }
    85% {
        transform: rotate(0deg) translateX(-10px);
    }
    100%{
        transform: translateX(0px);
    }
`;


export const Hand = styled.span`
    animation: ${handAnimation} .5s .3s linear forwards;
    transform-origin: center;
`