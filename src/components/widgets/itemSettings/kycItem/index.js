import { useEffect, useState } from 'react';
import styled from 'styled-components'
import IconSwitch from "../../icons/iconSwitch";
import { ButtonForms } from "../../buttons/buttons";
import { useSelector } from "react-redux";

export default function KycItemComponent() {

    const atributos = {
        icon: "identity",
        size: 40,
        color: "#1babec",
    };

    return(
        <Layout>
            <Container>
                <IconContainer>
                    <IconSwitch {...atributos} />
                </IconContainer>
                <InfoContainer>
                    <Title className='fuente'>Verificación de identidad</Title>   
                    <Description className='fuente'>La verificación de identidad es obligatoria para cumplir con las normativas vigentes</Description>   
                    <StatusComponent></StatusComponent>   
                </InfoContainer>
                <ButtonContainer>
                    <ButtonForms
                        id="subItemSC"
                        type={"primary"}
                        active={true}
                        siguiente={null}
                        >
                        Verificar
                    </ButtonForms>
                </ButtonContainer>
            </Container>
        </Layout>
    )
}


const _levels = {
    location:{
        uiName:"Residencia",
        pending:"",
        confirmed:"",
        accepted:"Residencia accepted"
    },
    contact:{
        uiName:"Contacto",
        pending:"",
        confirmed:"",
        accepted:" Contacto accepted" 
    },
    identity:{
        uiName:"Identidad",
        pending:"",
        confirmed:"Hemos recibido tus datos de identidad, en las próximas 72 horas te estaremos contactando...",
        accepted:"Identidad accepted"
    }
}

const getColor = state => {
    const colors = {
        pending:"lightgrey",
        confirmed:"var(--title1)",
        accepted:"var(--primary)",
    }
    return colors[state]
}




const StatusComponent = props => {

    const user = useSelector(({ modelData:{ user } }) => user);
    const [ currentStage, setCurrentStage ] = useState('identity')
    const [ levels ] = useState(_levels)

    const getIdentityState = () => {
        if(!user?.identity)return null;
        let state = 'pending'
        const { file_state, info_state } = user?.identity
        if(file_state === info_state){
            state = file_state || info_state
        }
        return state
    }

    const getState = key => {
        let states = {
            contact:user[key] ? 'accepted' : 'pending',
            location:user[key]?.state,
            identity:getIdentityState
        }
        return typeof states[key] === 'function' ? states[key]() : states[key]
    }

    useEffect(() => {
        // POST ==> GET NEX LEVEL
        for (const level of Object.keys(levels)) {
            if(getState(level) !== 'accepted'){
                setCurrentStage(level)
                break;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let errorMessage = user[currentStage]?.errors[0]
    console.log(levels, currentStage, levels[currentStage][getState(currentStage)])
    return(
        <StatusContainer>
            <LevelOneCont>
                <LevelTitle>
                    <Text className="fuente2">Nivel 1</Text>
                </LevelTitle>

                <LevelsContainer>
                    {
                        Object.keys(levels).map((item, key) => {

                            let showConnector = (key + 1) < Object.keys(levels).length 

                            return(
                                <>
                                    <Level 
                                        key={key} 
                                        className={`${getState(item)}`}
                                        title={`${item === currentStage ? levels[currentStage]?.uiName : ''}`}
                                    >
                                        <IconSwitch 
                                            icon={item} 
                                            size={20}
                                            color={getColor(levels[item]?.state)}
                                        />
                                    </Level>
                                    {
                                        showConnector &&
                                        <hr className={`${getState(item)}`}/>
                                    }
                                </>
                            )
                        })
                    }
                </LevelsContainer>
                <LabelMessage 
                    state={getState(currentStage)} 
                    className={`fuente ${getState(currentStage)}`}>
                    {errorMessage || (currentStage && levels[currentStage][getState(currentStage)])}
                </LabelMessage>
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
    &::after{
        content: attr(title);
        position: absolute;
        bottom: -25px;
        font-family: "Raleway",sans-serif;
        font-size: 14px;
        color:var(--title1);
    }

    &.pending{
        filter:blur(1px);
        pointer-events:none;
    }
    &.accepted{
        border: 2px solid var(--primary);
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
    &.confirmed,
    &.pending,
    &.accepted,
    &.rejected
    {
        color:${props => getColor(props.state)};
    }
    
`

const LevelOneCont = styled.div`
    width:auto;
    max-width:300px;
    display: grid;
    grid-template-rows: auto minmax(85px, 1fr) 35px;
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
    height:140px;
    display:grid;
    padding-top:10px;
`







const Title = styled(Text)`
    font-size:25px;
`
const Description = styled(Text)`
    font-size:15px;
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
`

const IconContainer = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    background: white;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 1px solid #d5d5d6;
    border: 2px solid var(--primary);
    z-index: 1;
    place-self: center;
`

const Container = styled.div`
    grid-template-columns: 12vw 1fr 250px;
    display:grid;
    margin:15px 0;
    column-gap: 20px;
`

const Layout = styled.div`
    height: auto;
    border: 1px solid transparent;
    border-top-color: #d5d5d6;
    border-bottom-color: #d5d5d6;
    min-height: calc(190px - 40px);
    padding: 20px 0px;
    display:grid;
`