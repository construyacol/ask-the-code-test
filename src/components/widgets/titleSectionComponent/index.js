import styled from 'styled-components'
import { useParams  } from "react-router-dom";
import { OnlySkeletonAnimation } from '../loaders/skeleton'
import { device } from '../../../const/const'

const UI_NAME_TITLE = {
    wallets:"Billeteras",
    withdraw_accounts:"Cuentas de retiro",
    referral:"Referidos",
    settings:"Ajustes",
    activity:"Actividad",
    deposit:"Depositar",
    withdraw:"Retirar",
    swap:"Intercambiar"
}

export default function TitleSection({ 
    titleKey, 
    skeleton, 
    children, 
    className = "",
    subMenuRef,
    subTitle
    // ...props
}) {

    const params = useParams()
    const key = titleKey || params.primary_path
    const title = UI_NAME_TITLE[key] || key
   
    return(
        <TitleContainer 
            className={`accountDetailTitle ${className} ${key}`}
            // onScrollCapture={handleScroll}
            // id="scrollElement"
            ref={subMenuRef}
        >
            <Title className={`fuente ${skeleton ? 'skeleton' : ''}`}>
                <span className={`${subTitle ? '_breadCrumbParent' : ''}`}>{skeleton ? 'Loading module' : title}</span>
                {
                    subTitle && <span className={`_mainBreadCrumb`}>{subTitle}</span>
                }
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
    iconClass
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
    position: sticky;
    z-index:2;

    &.accountDetailTitle.wallets{
        grid-template-columns: auto auto 1fr;
        align-items: center;
        column-gap: 17px;
        .AddNewItemContainer{
            justify-content: end;
        }
    }

    &.sticky{
        position: sticky;
        top: 60px;
        background: #f9f9fbdb;
        backdrop-filter: blur(8px);
    }
    
    
    &.accoun-detail{
        top: 120px;
        z-index: 3;
        background: rgb(249 249 251 / 94%);
        backdrop-filter: blur(6px);

        .ALFilterSect{
            align-items:center;
        }
        .ALfiltros{
            background:transparent;
        }
        
        h1{
            padding: 12px 0 20px;
            font-size:24px;
        }

        @media ${device.mobile} {
            &.createWithdrawAccount{
                position: initial;
                z-index: 1;
            }
        }
    }

    ._breadCrumbParent{
        font-size:18px !important;
        font-weight: normal;
        cursor:pointer;
        &:hover{
          text-decoration: underline;
        }
    }

    ._breadCrumbChild{
        font-size:24px;
        font-weight: bold;
    }

    ._mainBreadCrumb{
        margin-left: 7px; 
    }

`

const SubContainer = styled(Container)`
    padding:0;
    @media ${device.mobile} {
        display:none;
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
    padding: 30px 0 22px;

    &.skeleton{
      color:var(--skeleton_color);
      background:var(--skeleton_color);
      width: fit-content;
      border-radius: 4px;
      padding: 0;
      margin:30px 0 20px;
      ${OnlySkeletonAnimation};
    }

    @media ${device.mobile} {
        font-size:25px;
    }
`