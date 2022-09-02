import styled from 'styled-components'
import { Link } from "react-router-dom";


export const LevelDescriptionContent = styled.div`
    display: grid;
    row-gap: 3px;
`

export const LevelContent = styled.div`
    border-radius:5px;
    display: grid;
    padding: 7px 20px;
    height:calc(85px - 14px);
    border-left: 4px solid var(--primary);
    transform: scale(1);

    &.enabled{
        box-shadow: 3px 3px 6px 2px rgba(0,0,0,0.07);
        grid-template-columns: auto 1fr;
        align-items: center;
        column-gap: 12px;
        background:white;
        cursor:pointer;
    }

    &.disabled{
        background:#f4f4f6;
        border-left: 4px solid transparent;
        place-content: center;
        cursor: not-allowed;
    }

    &.isActived{
        transform: scale(1.05);
        transition: .3s;
        transform-origin: center;
    }

    p{
        font-family: "Raleway", sans-serif;
        color:var(--paragraph_color);
        margin: 0;
        
        &.disabled{
            font-size:20px;
            color:#EBEBF0;
            font-family: "Tomorrow",sans-serif;
            font-size: 40px;
            &._description{
                display:none;
            }
        }
    }

    ._title{
        font-size: 15px;
        font-weight: bold;
    }

    ._description{
        font-size:12px;
        font-family: "Tomorrow",sans-serif;
        opacity:50%;
    }

`

export const LevelsContainer = styled.div`
    display:grid;
    column-gap:20px;
    grid-template-columns: repeat(auto-fill, minmax(auto, 215px));
`

export const IdentityContent = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
`

export const IdentityContainer = styled.div`
    display:grid;
    grid-template-columns:1fr auto;
    column-gap:20px;
`

export const BenefitsContainer = styled.div`
    background: #F4F4F6;
    padding: 20px 20px;
    height: fit-content;
    min-height: 200px;
    max-width: 270px;
    width: 90vw;

    ul{
        padding:0;
    }

    p, h4, h5{
        color:var(--paragraph_color);
    }

    h4, h5{
        margin: 10px 0;
    }
`
export const ItemBenefit = styled.li`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 10px;
    p{
        font-size:14px;
    }
`

export const UiStateCont = styled.span`
    font-size: 12px;
    height:14px;
    width:auto;
    padding: 3px 6px;
    border-radius: 3px;

    &.verified{
        background: #2bc48a1f;
        color:#219D6E;
    }

    &.unverified{
        background: #cacaca59;
        color:var(--paragraph_color);
    }
`

export const SettingTitleCont = styled.div`
    display:flex;
    column-gap:5px;
    align-items: center;
`

export const SettingContent = styled.div`
    grid-column: 2 / 3;
    row-gap: 10px;
    display: grid;
    height: 3.5rem;
    grid-template-rows: auto 1fr;
    h3, p{
        color:var(--paragraph_color);
        margin:0;
    }
    h3{
        font-size:18px;
    }
    p{
        font-size:15px;
    }

`

export const IconContainer = styled.div`
    border: 1px solid #cacaca9e;
    border-radius:50%;
    width:3.5rem;
    height:3.5rem;
    grid-column: 1 / 2;
    display:grid;
    place-content:center;

    &.isActive{
        border-color:var(--primary);
    }
`
 
export const SettingElementLayout = styled.div`
    align-items: center;
    display:grid;  
    grid-template-columns:auto 1fr auto;
    column-gap:20px;  
    border-bottom: 1px solid #cacaca9e;
    &._lastElement{
        border-bottom: 1px solid transparent;
    }
`

export const ContentSectionLayout = styled.div`
    display:grid;
`

export const SecurityLayout = styled(ContentSectionLayout)`
    grid-template-columns:1fr;
    grid-auto-rows: 120px;
    row-gap:10px;
`

export const IdentityLayout = styled(ContentSectionLayout)`
    grid-template-columns:1fr;
    grid-template-rows:120px 1fr;
    row-gap:20px;
`

export const ContentLayout = styled.div`
    display:grid;
    grid-template-columns: minmax(auto, 220px) 1fr;
    padding-bottom: 30px;
    column-gap:30px;
`

export const SettingsMenuContainer = styled.div`
    border-right: 1px solid #cacaca9e;
`

export const ItemMenu = styled(Link)`
    display:grid;
    grid-template-columns:auto 1fr;
    background: #ececef70;
    padding: 0 15px;
    column-gap:10px;
    border-left: 3px solid #ececef;
    cursor:pointer;
    align-items:center;
    text-decoration: none;
    height:60px;

    &.selected{
        border-left: 3px solid var(--primary);
        background: #f9f9fb;
        position:relative;
        p{
            color:var(--primary);
        }
        &::after{
            content: "";
            width: 3px;
            heigth: 100%;
            position: absolute;
            right: -3px;
            background: #f9f9fb;
            height: 100%;
        }
    }

    &:hover p{
        color:var(--primary);
    }

    p{
        color:var(--paragraph_color);
        font-size:15px;
    }
`