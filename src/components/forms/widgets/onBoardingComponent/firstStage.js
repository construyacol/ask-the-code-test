import { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import {
    Container
} from '../sharedStyles'

import {
    show, 
    hide
} from './utils'
import hand from './assets/hand.png'


const Welcome = props => {

    const executeAnimations = async() => {
        await show('.onBoardingCont__', 3000)
        await hide('.onBoardingCont__', 500)
        props.nextStage()
    }

    useEffect(() => {
        executeAnimations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <Container className="onBoardingCont__" rowGap={5}>
            <h2 className="fuente">Bienvenido a</h2>
            <HandContainer>
                <Hand>
                    <img src={hand} width={55} alt="hand"/>
                </Hand>
                <WelcomeText>
                    <p className="fuente">
                        Coinsenda
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
        width: 300px;
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
        font-size: 50px;
        font-weight:bold;
        margin: 0;
        color:#0198ff;
    }
`



const HandContainer = styled.div`
    display:flex;
    align-items:center;
    column-gap: 5px;
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


export const Hand = styled.div`
    animation: ${handAnimation} .5s .3s linear forwards;
    transform-origin: center;
`