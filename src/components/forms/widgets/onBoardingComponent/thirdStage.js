import { useEffect } from 'react'
import { useSelector } from "react-redux";

import { CopyContainer } from './styles'

import {
    Container,
    Button
} from '../sharedStyles'

import {
    show
} from './utils'
import nerdFace from './assets/nerdFace.png'

const Welcome = props => {

    const isAppLoaded = useSelector(({ isLoading }) => isLoading.isAppLoaded);
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
                        Para brindarte una experiencia segura dentro de <span>Coinsenda</span>, te pediremos algunos datos
                    </p>
                </CopyContainer>
            </Container>
            <Button 
                onClick={() => props.nextStage()} 
                disabled={!isAppLoaded} 
                className={`fuente ${isAppLoaded ? 'showButton' : ''}`}
            >Comencemos</Button>
        </>
    )

}

export default Welcome


