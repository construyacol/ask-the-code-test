import styled from 'styled-components'
import { InfoWrapper, IconCont } from './styles'
import getIcon from './icons'
import { P } from 'components/widgets/typography'
interface infoProps {
    id?:string;
    [key:string]:any;
}

const InfoStateComponent = ({currentStage, ...props}:infoProps) => { 

    // console.log('InfoStateComponent stages', props.levelRequirements)
    // debugger

    if(!props.levelRequirements)return <p>Cargando...</p>

    const { dataForm:{ formName }, levelRequirements:{ itemsMenu } } = props
    const stages = itemsMenu[formName]?.stages
    const Icon = getIcon('identity')

    // if(!levelRequirements)return <p>Cargando...</p>
    // console.log('InfoStateComponent', currentStage, props)
    // debugger
    // if(!infoStages?.levelRequirements || !infoStages?.allStages || !infoStages?.levelRequirements?.itemsMenu || !infoStages?.currentRequirement)return <p>Cargando...</p>;
    // const { levelRequirements:{ itemsMenu }, currentRequirement, allStages, stages } = infoStages
    // const progress = Math.ceil((currentStage)*100 / allStages.length);
    const progress = 50;
    // const nextStage = allStages[(currentStage+1)]

    console.log('InfoStateComponent stages', stages, props)
debugger


    return(
        <InfoWrapper {...props} >
            <InfoContainer>
                <IconCont color={'primary'}>
                    <Icon size={20}/>
                </IconCont>
                <TextCont>
                    <P className="titleSection fuente bold">
                        Contácto y residencia
                        {/* {itemsMenu && itemsMenu[currentRequirement]?.uiName}  */}
                        <span className={`fuente2 ${progress < 50 ? 'orange' : 'green'}`}>
                            {progress}%
                        </span> 
                    </P>
                    <P className="description"><span>Siguiente:</span>Apellidos</P>
                    {/* {
                        stages[nextStage]?.ui_name ?
                            <P className="description"><span>Siguiente:</span>{stages[nextStage]?.ui_name}</P>
                        :
                            <P className="description success">A punto de completar</P>
                    } */}
                </TextCont>

            </InfoContainer>
        </InfoWrapper>
    )
}

export default InfoStateComponent

const TextCont = styled.div`
    display:grid;
    grid-template-rows: auto auto;
    row-gap:6px;
`

const InfoContainer = styled.div`
    display:grid;
    grid-template-columns:auto 1fr auto;
    column-gap:10px;
    align-items: center;
    .titleSection{
        margin: 0;
        font-size:18px;
        display: flex;
        column-gap: 10px;
        span{
            font-weight: normal;
            font-size: 11px;
            padding: 4px 7px;
            border-radius: 2px;
            &.orange{
                background: ${props => props.theme.palette.orange_background};
                color: ${props => props.theme.palette.orange_color};
            }
            &.green{
                background: ${props => props.theme.palette.green_background};
                color: ${props => props.theme.palette.green_color};
            }
        }
    }
    .description.success{
        color: ${props => props.theme.palette.green_color};
        padding:0;
        border-left: none;
    }
    .description{
        display: flex;
        margin: 0;
        font-size:14px;
        border-left: 1px solid gray;
        padding-left: 10px;
        column-gap: 7px;
        span{
            opacity:.5;
        }
    }
`