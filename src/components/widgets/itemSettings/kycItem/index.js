import { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components'
import IconSwitch from "../../icons/iconSwitch";
import { ButtonForms } from "../../buttons/buttons";
import { useSelector } from "react-redux";
import SimpleLoader, { LoaderContainer } from "../../loaders";
import { OnlySkeletonAnimation } from "../../loaders/skeleton";
import { mainService } from '../../../../services/MainService'
import { useActions } from '../../../../hooks/useActions'
import useViewport from '../../../../hooks/useWindowSize'
import { device } from '../../../../const/const'
import { identityInfo } from '../../../forms/widgets/kyc/identityComponent/identityUtils'
 
// import { LEVELS_INFO } from '../../../../const/levels'
// import { funcDebounce } from "../../../../utils";

export default function KycItemComponent() {

    const actions = useActions()
    // NECESITO TENER habilitado algo para consultar los requerimientos de cada uno de los niveles
    const { confirmedIdentity } = identityInfo() 

    const [ levels, setLevels ] = useState()
    const [ requirements, setRequeriments ] = useState([])
    const { isMovilViewport } = useViewport()

    const user = useSelector(({ modelData:{ user } }) => user);

    const openModalKyc = async(props = {}) => {
        const currentRequirement = props?.componentRef || requirements[0]
        if(!currentRequirement)return;
        const Element = await import(`../../../forms/widgets/kyc/${currentRequirement}Component/init`)
        // eslint-disable-next-line react/jsx-pascal-case
        actions.renderModal(() => <Element.default {...props} />)
    }

    const atributos = {
        icon: "identity",
        size: isMovilViewport ? 30 : 40,
        color: "#1babec",
    };

    const init = async() => {
        // TODO: ADD debounce func
        let res = await mainService.createRequirementLevel()
        if(!res)return ;
        setLevels(res.levels)
        setRequeriments(res.requirements)
    }

    useEffect(() => {
        init()
    }, [user])

    
    return(
        <Layout>
            <Container>
                {
                    !isMovilViewport &&
                    <IconContainer>
                        <IconSwitch {...atributos} />
                    </IconContainer>
                }
                <InfoContainer>
                    <Title className='fuente'>Verificación de identidad</Title>   
                    <Description className='fuente'>La verificación de identidad es obligatoria para cumplir con las normativas vigentes</Description>   
                    <StatusComponent
                        levelName={"Nivel 1"}
                        levels={levels}
                        user={user}
                    />   
                </InfoContainer>
                <ButtonContainer>
                {
                    (requirements?.length > 0 && mainService.getVerificationState() !== 'accepted') ?
                        <ButtonForms
                            id="subItemSC"
                            type={"primary"}
                            active={true}
                            siguiente={openModalKyc}
                            clases="callToAction"
                            >
                            Verificar
                        </ButtonForms>
                        :
                    (mainService.getVerificationState() === 'accepted' && !confirmedIdentity) &&
                        <ButtonForms
                            id="subItemSC"
                            type={"secundary"}
                            active={true}
                            siguiente={() => openModalKyc({componentRef:'identity', isNewId:true})}
                            >
                            Crear identidad
                        </ButtonForms>
                }
                </ButtonContainer>
            </Container>
        </Layout>
    )
}




const getColor = state => {
    const colors = {
        pending:"lightgrey",
        confirmed:"var(--title1)",
        accepted:"var(--primary)",
        rejected:"rgb(84, 0, 0)"
    }
    return colors[state]
}




const StatusComponent = ({ levels, user, levelName }) => {

    const [ currentStage, setCurrentStage ] = useState('identity')
    // console.log('||||||  VerificationState ==> ', mainService.getVerificationState())

    const getIdentityState = () => {
        let state = 'pending'
        if(!user?.identity)return state;
        const { file_state, info_state } = user?.identity

        if([info_state, file_state].includes("rejected")){
            return "rejected"
        }else if(info_state === file_state){
            state = info_state
        }
        return state
    }

    const getState = key => {
        let states = {
            contact:user[key] ? 'accepted' : 'pending',
            location:user[key]?.state || 'pending',
            identity:getIdentityState
            // identity:mainService.getVerificationState
        }
        return typeof states[key] === 'function' ? states[key]() : states[key]
    }

    useEffect(() => {
        if(levels){
            for (const level of Object.keys(levels)) {
                if(getState(level) !== 'accepted'){
                    setCurrentStage(level)
                    break;
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [levels])

    const userState = mainService.getVerificationState()
    let errorMessage = (user[currentStage]?.errors && userState === 'rejected')  && user[currentStage]?.errors[0]

    if(!levels){return <StatusSkeleton/>}

    return(
        <StatusContainer>
            
            <LabelMessage 
                state={getState(currentStage)} 
                className={`fuente ${getState(currentStage)}`}>
                {errorMessage || ((currentStage && levels) && levels[currentStage][getState(currentStage)])}
            </LabelMessage>

            <LevelOneCont>
                <LevelTitle>
                    <Text className={`fuente2`}>{levelName}</Text>
                </LevelTitle>

                <LevelsContainer>
                    {
                        levels &&
                            Object.keys(levels).map((item, key) => {
                                let showConnector = (key + 1) < Object.keys(levels).length 
                                console.log('--------------------------- ', item, getState(item))
                                return(
                                    <Fragment key={key}>
                                        <Level 
                                            className={`${item === currentStage ? '_current' : ''} ${getState(item)}`}
                                            title={`${levels[item]?.uiName || ''}`}
                                        >
                                        {
                                            getState(item) === 'confirmed' ?
                                                <LoaderContainer>
                                                    <SimpleLoader loader={2} />
                                                </LoaderContainer>
                                            :
                                                <IconSwitch 
                                                    icon={item} 
                                                    size={20}
                                                    color={getColor(levels[item]?.state)}
                                                />
                                        }
                                        </Level>
                                        {
                                            showConnector &&
                                            <hr className={`${getState(item)}`}/>
                                        }
                                    </Fragment>
                                )
                            })
                    }
                </LevelsContainer>
                
            </LevelOneCont>
        </StatusContainer>
    )
}


const StatusSkeleton = () => {

    const levels = new Array(3).fill({})

    return(
        <StatusContainer>
            <LabelMessage className="skeleton">
                This awesome status message 
            </LabelMessage>
            <LevelOneCont>
                <LevelTitle>
                    <Text className="skeleton">level1</Text>
                </LevelTitle>

                <LevelsContainer>
                    {
                        levels.map((item, key) => {
                            let showConnector = (key + 1) < Object.keys(levels).length 
                            return(
                                <Fragment key={key}>
                                    <Level className='_current confirmed skeleton'/>
                                    {
                                        showConnector &&
                                        <hr className="pending"/>
                                    }
                                </Fragment>
                            )
                        })
                    }
                </LevelsContainer>
            </LevelOneCont>
        </StatusContainer>
    )
}



const Level = styled.div`
    width:50px;
    height:40px;
    border: 2px solid lightgrey;
    border-radius:4px;
    position:relative;
    display:grid;
    place-items: center;
    .lds-roller{
        transform:scale(.35);
    }
    :hover{
        cursor:pointer;
        ::after{
            content: attr(title);
            position: absolute;
            bottom: -25px;
            font-family: "Raleway",sans-serif;
            font-size: 13px;
            color:var(--title1);
        }
        &.pending{
            &::after{
                content:"";
            }
            &._current::after{
                content: attr(title);
            }
        }
    }
    &._current::after{
        content: attr(title);
        position: absolute;
        bottom: -25px;
        font-family: "Raleway",sans-serif;
        font-size: 13px;
        color:var(--title1);
    }

    &.pending{
        filter:blur(1px);
        .iconSty{
            filter:grayscale(1);
        }
        &._current{
            filter:blur(0px);
            border: 2px solid var(--primary);
            .iconSty{
                filter:grayscale(0);
            }
        }
        
    }

    &.rejected{
        .iconSty{
            filter: sepia(1);
        }
    }

    &.rejected{
        border: 2px solid rgb(155 0 0);
    }

    &.accepted{
        border: 2px solid var(--primary);
    }

    &.skeleton{
        ::after{
            content: "sss";
            align-self: center;
            bottom: auto;
            background: rgb(202, 202, 202);
            color:rgb(202, 202, 202);
            border-radius: 2px;
        }
    }

`

const LevelsContainer = styled.div`
    display:grid;
    grid-template-columns:1fr auto 1fr auto 1fr;
    place-items:center;
    hr{
        width: 50px;
        border: 1px solid #d3d3d3;
        &.pending{
            filter:blur(1px);
        }
        &.accepted{
            border: 1px solid var(--primary);
        }
    }
`

const LevelTitle = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    column-gap: 15px;

    p{
        font-size:14px;
    }

    &::before{
        content:"";
        border-bottom:1px solid #d3d3d3;
    }
    &::after{
        content:"";
        border-bottom:1px solid #d3d3d3;
    }
`

const Text = styled.p`
    margin:0;
    color:var(--paragraph_color);
`


const LabelMessage = styled(Text)`
    font-size:15px;
    &.confirmed,
    &.accepted,
    &.rejected
    {
        color:${props => getColor(props.state)};
    }
    &.pending{
        color:var(--paragraph_color);
    }
`

const LevelOneCont = styled.div`
    width:auto;
    max-width:300px;
    display: grid;
    grid-template-rows: auto minmax(85px, 1fr);
    row-gap:10px;
    position:relative;

    ${LabelMessage}{
        font-size:14px; 
        position: absolute;
        bottom: 0;
        width: max-content;
    }
`




const StatusContainer = styled.div`
    height:auto;
    display:grid;
    padding-top:10px;
    row-gap:17px;

    .skeleton{
        ${OnlySkeletonAnimation}
    }

    p.skeleton{
        width: fit-content;
        background:rgb(202, 202, 202);
        color:rgb(202, 202, 202);
    }
    @media (max-width: 768px) {
        place-items:center;
    }
`







const Title = styled(Text)`
    font-size:25px;
`
const Description = styled(Text)`
    font-size:15px;
    @media (max-width: 768px) {
        display:none;
    }
`




const ButtonContainer = styled.div`
    display:grid;
    align-items:center;

    .contButton{
        transform:scale(.9);
    }
`

const InfoContainer = styled.div`
    display:grid;
    align-items: center;
    grid-template-rows: 50px 30px 1fr;
    row-gap: 7px;
    @media ${device.laptop}{
        row-gap: 10px;
    }
    @media ${device.mobile}{
        row-gap: 0;
        text-align: center;
        grid-template-rows: 50px 1fr;
        ${Title}{
            text-align:left;
        }
        ${LabelMessage}{
            justify-self: start;
            text-align: left;
        }
    }
`

const IconContainer = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    background: white;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid var(--primary);
    z-index: 1;
    place-self: center;
    
    @media ${device.mobile} {
        background: transparent;
        border: none;
    }

    @media ${device.laptop}{
        justify-self: start;
    }
`

const Container = styled.div`
    grid-template-columns: minmax(auto,200px) minmax(350px,1fr) minmax(auto,200px);
    display:grid;
    margin: 0 0 15px 0;
    column-gap: 20px;
    
    @media ${device.laptop}{
        column-gap: 10px;
        grid-template-columns: minmax(auto,130px) minmax(350px,1fr) minmax(auto,200px);
    }
    @media ${device.mobile} {
        grid-template-columns: 1fr;
        grid-template-rows:1fr auto;
        row-gap:3.5rem;
        column-gap: 10px;
    }
`

const Layout = styled.div`
    height: auto;
    border: 1px solid transparent;
    border-bottom-color: #d5d5d6;
    min-height: calc(190px - 20px);
    padding: 0 0 20px 0px;
    display:grid;
    @media (max-width: 768px) {
    padding: 0px 0px 20px;
    }
`