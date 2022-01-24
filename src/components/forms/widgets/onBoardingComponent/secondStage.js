import { useEffect } from 'react'
import {
    Container
} from '../sharedStyles'

import { CopyContainer } from './styles'

import {
    show,
    hide
} from './utils'
import party from './assets/party.png'


const Welcome = props => {

    const executeAnimations = async() => {
        await show('.onBoardingCont__', 6000)
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
                    Aquí <span>tu</span> eres lo más importante, por eso te brindamos el intercambio más seguro y confiable para tus operaciones
                </p>
            </CopyContainer>
        </Container>
    )

}

export default Welcome









