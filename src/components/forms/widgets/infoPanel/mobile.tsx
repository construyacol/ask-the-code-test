import styled from 'styled-components'
import { InfoWrapper, IconCont } from './styles'
import getIcon from './icons'
import { P } from 'components/widgets/typography'
// import { FiArrowRight } from 'react-icons/fi'
import { MdMoreVert, MdClose } from 'react-icons/md'


interface infoProps {
    id?:string;
    [key:string]:any;
}

const InfoStateComponent = (props:infoProps) => { 
    if(!props.levelRequirements)return <p>Cargando...</p>

    const { 
        dataForm:{ formName }, 
        levelRequirements:{ itemsMenu }, 
        dataForm, 
        customStage,
        isOpenPanelInfo,
        setIsOpenPanelInfo,
        // viewportSizes:{ isMobile }
    } = props

    const currentStage = customStage || props.currentStage
    const errors = dataForm?.handleError?.errors
    const formKey = ["contact"].includes(formName) ? "location" : formName
    const stages = errors || itemsMenu[formKey]?.stages
    const Icon = getIcon('identity')
    const progress = Math.ceil((currentStage)*100 / Object.keys(stages).length);
    const sumStage = ["location"].includes(formName) ? 2 : 1;
    const nextStage = currentStage < Object.keys(stages).length ? (currentStage + sumStage) : 1;
    // console.log('InfoStateComponent', currentStage < Object.keys(stages).length, stages, dataForm)
    const OpenCloseIcon = isOpenPanelInfo ? MdClose : MdMoreVert
    return(
        <InfoWrapper {...props} >
            <InfoContainer>
                <IconCont color={'primary'}>
                    <Icon size={20}/>
                </IconCont>
                <TextCont>
                    <P className="titleSection fuente bold">
                        {itemsMenu[formKey]?.uiName}
                        <span className={`fuente2 ${progress < 50 ? 'orange' : 'green'}`}>
                            {progress}%
                        </span> 
                    </P>
                    <TextContainer>
                        <P className="description description__title">Prox:</P>
                        <DescriptionContainer>
                            <DescriptionCarousel style={{transform:`translateY(-${nextStage*16}px)`}}>
                                {
                                    Object.keys(stages).map((stageKey, key) => {
                                        let stageData = dataForm?.stages[stageKey] || stages[stageKey]
                                        return <P key={key} className="description">{stageData?.ui_name || stageData?.uiName}</P>
                                    })
                                }
                                 <P className="description success">A punto de completar</P>
                            </DescriptionCarousel>
                        </DescriptionContainer>
                    </TextContainer>
                </TextCont>

                <OpenCloseIcon size={25} color="#06a" onClick={() => setIsOpenPanelInfo(!isOpenPanelInfo)}/>
                
            </InfoContainer>
        </InfoWrapper>
    )
}

export default InfoStateComponent

const DescriptionCarousel = styled.div`
    display: grid;
    grid-auto-rows: 16px;
    transition: .3s;
    transform: translateY(0px);
    transform: translateY(-16px);
`

const DescriptionContainer = styled.div`
    overflow: scroll;
    max-height:15px;
`

const TextContainer = styled.div`
    border-left: 1px solid #b6bfc7;
    display:flex;
    padding-left: 10px;
    column-gap: 7px;
`

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
        column-gap: 7px;
        &.description__title{
            opacity:.5;
        }
    }
`