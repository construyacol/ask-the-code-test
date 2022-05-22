import styled from 'styled-components'
import { useParams  } from "react-router-dom";
import { OnlySkeletonAnimation } from '../loaders/skeleton'
import { device } from '../../../const/const'

const UI_NAME_TITLE = {
    wallets:"Billeteras",
    withdraw_accounts:"Cuentas de retiro",
    referral:"Referidos",
    security:"Centro de seguridad"
}

export default function TitleSection({ titleKey, skeleton, children }) {

    const params = useParams()
    const key = titleKey || params.primary_path
    const title = UI_NAME_TITLE[key] || key

    return(
        <TitleContainer>
            <Title className={`fuente ${skeleton ? 'skeleton' : ''}`}>
                {skeleton ? 'Loading module' : title}
            </Title>
            {children}
        </TitleContainer>
    )
}

export const SubTitleSection = ({ 
    titleKey, 
    skeleton, 
    children, 
    handleAction, 
    iconClass,
    className
}) => {

    const params = useParams()
    const key = titleKey || params.primary_path
    const title = UI_NAME_TITLE[key] || key

    return(
        <SubContainer>
            <SubTitle 
                className={
                    `fuente ${skeleton ? 'skeleton' : ''} 
                      ${handleAction ? 'cta' : ''}
                      ${iconClass ? 'withIcon' : ''}
                    `
                } 
                onClick={handleAction ? handleAction : null}
            >
                {
                    iconClass &&
                      <i className={iconClass}></i>
                }
                {skeleton ? 'Loading module' : title}
            </SubTitle>
            {children}
        </SubContainer>
    )
}

const Container = styled.div`
    display:grid;
    grid-template-columns:1fr auto;
`

const TitleContainer = styled(Container)`
    border-bottom: 1px solid #d5d5d6;
`

const SubContainer = styled(Container)`
    padding:0;
    grid-row-start: 2;
    @media ${device.mobile} {
        grid-row-start: 1;
        padding-top:20px;
    }
`


const SubTitle = styled.p`
    color:var(--paragraph_color);
    font-size:16px;
    margin: 0;
    padding: 0;
    column-gap:8px;
    display:flex;
    align-items:center;
    width:fit-content;
    
    &.cta{
       cursor:pointer;
       &:hover{
           color:var(--primary);
       }
    }
`

const Title = styled.h1`
    color:var(--paragraph_color);
    font-size:28px;
    margin: 0;
    padding: 30px 0 20px;

    &.skeleton{
      color:var(--skeleton_color);
      background:var(--skeleton_color);
      width: fit-content;
      border-radius: 4px;
      padding: 0;
      margin:30px 0 20px;
      ${OnlySkeletonAnimation};
    }
`