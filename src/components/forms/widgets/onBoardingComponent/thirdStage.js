import { useEffect } from 'react'
import { useSelector } from "react-redux";
import { mainService } from "../../../../services/MainService";
// import { initStages } from '../../utils'
import { useActions } from '../../../../hooks/useActions'

import { CopyContainer } from './styles'

import {
    Container,
    Button
} from '../sharedStyles'

import {
    show
} from './utils'
import nerdFace from './assets/nerdFace.png'

const Welcome = ({ setDataForm, setLoading }) => {
    const actions = useActions();
    const isAppLoaded = useSelector(({ isLoading }) => isLoading.isAppLoaded);
    const executeAnimations = async() => {
        await show('.onBoardingCont__', 6000)
        // props.nextStage()
    }

    const initKycForm = async() => {
        let res = await mainService.createRequirementLevel()
        if(res){
            setLoading(true)
            const { requirements } = res
            const currentRequirement = requirements[0]
            const Element = await import(`../kyc/${currentRequirement}Component/init`)
            // eslint-disable-next-line react/jsx-pascal-case
            actions.renderModal(() => <Element.default/>)
        }
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
                onClick={initKycForm} 
                disabled={!isAppLoaded} 
                className={`fuente ${isAppLoaded ? 'showButton' : ''}`}
            >Comencemos</Button>
        </>
    )

}

export default Welcome


