import { useEffect } from 'react'
import styled from 'styled-components'
import {
    Container,
    Button
} from '../sharedStyles'

import {
    show
} from './utils'
import nerdFace from './assets/nerdFace.png'


const Welcome = props => {

    const executeAnimations = async() => {
        await show('.onBoardingCont__', 6000)
        // props.nextStage()
    }

    useEffect(() => {
        executeAnimations()
    }, [])

    return(
        <>
            <Container className="onBoardingCont__" rowGap={15}>
                {/* <h1 className="fuente flip-in-ver-right">🤓</h1> */}
                <img className="flip-in-ver-right" src={nerdFace} width={55} alt="party"/>
                <CopyContainer>
                    <p className="fuente">
                        Antes de iniciar tu experiencia en <span>Coinsenda</span>, te pediremos algunos datos para conocerte un poco más...
                    </p>
                </CopyContainer>
            </Container>
            <Button className='fuente' onClick={() => props.nextStage()}>Comencemos</Button>
        </>
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



