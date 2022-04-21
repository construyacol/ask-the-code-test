import styled from 'styled-components'
import { Text, PriorityContainer } from './styles'
import { WITHDRAW_PRIORITY_FEE } from '../../../../../const/const'


export default function PriorityComponent ({ availableCosts = [], currentPriority = "medium_priority", setPriority }) {
    
    const handleClick = value => {
        setPriority(value)
    }

    return(
        <PriorityContainer>
            <HeaderTitle>
                <P className="fuente">Prioridad</P>
                <HR/>
            </HeaderTitle>
            <PriorityControl>
                {
                    Object.keys(WITHDRAW_PRIORITY_FEE).map((_key, index) => {
                        const _item = WITHDRAW_PRIORITY_FEE[_key]
                        return  <PriorityOption
                                    key={index}
                                    className="fuente"
                                    title={_item?.ui_name}
                                    color={_item?.ui_color}
                                    actived={_key === currentPriority}
                                    available={availableCosts[_key] ? true : false}
                                    onClick={availableCosts[_key] ? () => handleClick(_item?.value) : null}
                                    // available
                                    // onClick={() => handleClick(_item?.value)}
                                />
                    })
                }
            </PriorityControl>
        </PriorityContainer>
    )

}

const P = styled(Text)`
    font-weight:bold;
    font-size:15px;
`




const PriorityOption = styled.div`
    width:auto;
    padding:5px 15px;
    border: ${props => props.color ? `1px solid ${props.color}` : `1px solid #d3d3d3`};
    height: fit-content;
    border-radius:3px;
    font-size:14px;
    opacity: ${props => (props.available && props.actived) ? "1" : (props.available && !props.actived) ? "0.35" : "0.5"};
    background:${props => props.actived ? `${props.color}25` : "transparent"};
    cursor:${props => props.available ? "pointer" : "auto" };
    filter: ${props => (props.available && !props.actived) ? "blur(.5px)" : props.available ? "none" : "grayscale(1) blur(1px)"};

    &::after{
        content: attr(title);
        color: ${props => props.color ? `${props.color}` : `#d3d3d3`};
        font-weight:bold;
        font-size:14px;
    }
`

const PriorityControl = styled.div`
    height:60px;
    background:#fbfbfb;
    display:flex;
    place-items: center;
    place-content: center;
    column-gap: 15px;
`

const HR = styled.div`
    width:100%;
    height:1px;
    background:#efefef;
    align-self: center;
`

const HeaderTitle = styled.div`
    display:grid;
    grid-template-columns:auto 1fr;
    column-gap: 10px;
`


