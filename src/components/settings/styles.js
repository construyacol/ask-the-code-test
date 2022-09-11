import styled, { keyframes } from 'styled-components'
import { Link } from "react-router-dom";
import { OnlySkeletonAnimation } from 'components/widgets/loaders/skeleton'
import { device } from 'const/const'

// export const InProcessRejectMessageCont = styled.div`
//     position:absolute;
//     display: grid;
//     align-self: center;
//     justify-items: center;
//     p{
//         text-align:center;
//         color:var(--paragraph_color);
//         max-width:500px;zipObject
//     }
// `

export const FloatContainer = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    background: #f9f9fbcf;
    backdrop-filter: blur(5px);
    height: 100%;
    display: flex;
    place-content: center;
    height: 100%;
    z-index:1;
    .isActived{
        transform:scale(1);
    }
`

export const EmptyStateLayout = styled.div`
    display:flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    row-gap: 20px;

    p{
        text-align:center;
        color:var(--paragraph_color);
        max-width: 650px;
        font-size:15px;
    }
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

    @media ${device.mobile}{
        height:90px;
        grid-template-columns:auto 1fr auto;
        column-gap: 16px;
        p{
            font-weight:bold;
        }
    }
`



export const SettingsContent = styled.div`
    height:auto;
    position: sticky;
    top: 50px;

    &.skeleton{

        ${OnlySkeletonAnimation}

        ${ItemMenu}{
            &:hover p{
                color:var(--skeleton_color);
            }
        }

        p{
            background: var(--skeleton_color);
            color: var(--skeleton_color);
            width: fit-content;
            border-radius: 3px;
            &:hover{
                color: var(--skeleton_color);
            }
        }
        .icon_skeleton{
            width: 20px;
            height: 20px;
            background: var(--skeleton_color);
            border-radius: 3px;
        }
    }
`

export const ContactLocationContent = styled.div`
    display:grid;
    row-gap: 22px;
    position:relative;
    grid-auto-rows: 39px;
`

export const ContactLocationItem = styled.div`
    row-gap: 4px;
    display: grid;
    grid-template-columns: 1fr auto;

     &.isEditable:hover{
        ._editButton{
            display:flex;
        }
     }

    .contactLocationData,
    .contactLocationKey{
        grid-column: 1 / 2;
        margin:0;
        color:var(--paragraph_color);
        &.contactLocationData{
            font-size:15px;
        }
        &.contactLocationKey{
            font-size:13px;
        }
    }

    &.isEditable:hover{
        cursor:pointer;
    }
`


export const EditButton = styled.div`
    height:100%;
    display: flex;
    align-items: center;
    grid-column: 2 / 3;
    grid-row: 1 / 3;
    column-gap:5px;
    display:none;

    .edit_p{
        margin: 0;
        font-size: 11px;
    }
    
    &:hover{

        & ~.contactLocationKey,
        & ~.contactLocationData{
            color:var(--primary);
        }
        svg{
            fill: var(--primary);
        }
        .edit_p{
            color:var(--primary);
        }
    }
`




export const KycContentLayout = styled.div`

    position:relative;
    display:grid;
    
    &.location,
    &.identity{
        row-gap: 30px;
        grid-template-rows: auto auto 1fr;
    }
    h3{
        color:var(--paragraph_color);
        margin:0;
    }

    &.identity,
    &.contact,
    &.location{
        position:relative;
    }

    @media ${device.mobile} {
        &.location,
        &.identity,
        &.loading{
            grid-template-rows: auto auto minmax(300px, 1fr);
        }
    }

`

export const ItemRequirementMenu = styled.div`

    padding:0 15px;
    cursor:pointer;
    border-bottom:2px solid transparent;
    position:relative;

    p{
        color:var(--paragraph_color);
        font-size: 15px;
    }

    &.isActive{
        border-top: 2px solid var(--primary);
        background: var(--background);
        p{
            color:var(--primary);
        }
    }

    &.disabled{
        cursor: auto;
        p{
            color:var(--skeleton_color);
        }
    }

    &::after{
      content:"";
      position:absolute;
      top:0;
      right:0;
      width:100%;
      height:100%;
      background:transparent;
    }
`

export const RequirementMenu = styled.menu`

    height:50px;
    width:100%;
    background:#f4f4f6;
    margin: 0;
    padding: 0;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    display: flex;
    column-gap: 10px;
    margin-top: 10px;
    position: sticky;
    top: 60px;

    &.inProgressKyc{
        z-index:2;
    }

    &.skeleton{
        p{
            background: var(--skeleton_color);
            color: var(--skeleton_color);
            border-radius: 3px;
            ${OnlySkeletonAnimation};
        }
        z-index: 2;
    }
`


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

    &.skeleton{
        background:var(--skeleton_color);
        border-left: 4px solid transparent;
        ${OnlySkeletonAnimation};
    }

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

// export const LevelsWrapper = styled.div`
//     overflow: hidden;
//     &.close{
//         height: 95px;
//     }
// `

export const LevelsContainer = styled.div`
    display:grid;
    column-gap:25px;
    grid-template-columns: repeat(auto-fill, minmax(auto, 215px));
    min-height:85px;
    row-gap:15px;

    @media ${device.mobile} {
        grid-template-columns: 1fr;
        grid-template-columns: repeat(auto-fill, minmax(130px, auto));
    }
`

export const IdentityContent = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    row-gap: 30px;
    position:relative;
`

export const IdentityContainer = styled.div`
    display:grid;
    grid-template-columns: 1fr minmax(250px, 320px);
    column-gap:20px;

    @media ${device.laptop} {
        row-gap:50px;
        grid-template-columns: 1fr;
    }

`

export const BenefitsContainer = styled.div`
    background: #F4F4F6;
    padding: 20px 20px;
    height: fit-content;
    min-height: 200px;
    width: calc(100% - 40px);
    border-radius:6px;

    position: sticky;
    top: 70px;

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
        margin:10px 0;
    }
`

export const UiStateCont = styled.span`
    font-size: 12px;
    height:14px;
    width:auto;
    padding: 3px 6px;
    border-radius: 3px;

    @media ${device.mobile}{
        display:none;
    }

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
    align-self: end;
    @media ${device.mobile}{
        align-self: center;
    }
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
    display:grid;
    place-content:center;
    grid-column: 1 / 2;
    grid-row: 1 / 3;

    &.isActive{
        border-color:var(--primary);
    }

    @media ${device.mobile}{
        grid-row: 1 / 2;
        border-color:transparent;
        &.isActive{
            border-color:transparent;
        }
        width:auto;
        height:auto;
        &.skeleton__iconContainer{

        }
    }

`
 
export const SettingElementLayout = styled.div`
    align-items: center;
    display:grid;  
    grid-template-columns:auto 1fr auto;
    column-gap:20px;  
    border-bottom: 1px solid #cacaca9e;
    row-gap:10px;

    .settingButton{
        grid-row: 1 / 3;
        grid-column: 3;
    }

    .title__h3,
    .description__p{
        color:var(--paragraph_color);
        margin:0;
    }

    .title__h3{
        font-size:18px;
        grid-column: 2 / 3;
    }
    .description__p{
        font-size:15px;
        grid-column: 2 / 3;
        margin: 0;
        align-self: baseline;
    }

    @media ${device.mobile}{
        .description__p{
            grid-column: 1 / 3;
        }
        height: min-content;
        padding-bottom: 20px;
        column-gap: 10px;
        row-gap: 15px;
    }

    &._lastElement{
        border-bottom: 1px solid transparent;
    }

    &.skeleton{

        ${OnlySkeletonAnimation}

        .skeleton__iconContainer{
            position:relative;
            display: flex;
            place-items: center;
            width:22px;
            height:22px;
            &::after{
                content:"";
                position:absolute;
                width:100%;
                height:100%;
                border-radius:3px;
                background:var(--skeleton_color);
            }
        }

        .skeleton__h3,
        .skeleton__p{
            background: var(--skeleton_color);
            width: fit-content;
            color: var(--skeleton_color);
            border-radius: 3px;
        }
        .skeleton__p{
            height:15px;
        }
        .skeleton__h3{
            align-self:end;
        }

    }
`

const movilCtaAnim = keyframes`
0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
`;


export const ContentSectionLayout = styled.div`
    display:grid;
`

export const SecurityLayout = styled(ContentSectionLayout)`
    grid-template-columns:1fr;
    grid-auto-rows: 120px;
    row-gap:10px;
    .movilcta__i{
        grid-column: 3;
        grid-row: 1 / 3;
    }
` 

export const KycLayout = styled(ContentSectionLayout)`
    grid-template-columns:1fr;
    grid-template-rows:120px 1fr;
    row-gap:20px;
`

export const ContentLayout = styled.div`
    display:grid;
    grid-template-columns: minmax(auto, 240px) 1fr;
    padding-bottom: 30px;
    column-gap:30px;
    position:relative;

    @media ${device.mobile}{
        grid-template-columns: 1fr;
    }

    .anim-flow{
        animation: ${movilCtaAnim} 1s infinite;
    }

`

export const SettingsMenuContainer = styled.div`
    border-right: 1px solid #cacaca9e;

    @media ${device.mobile}{
        position: absolute;
        z-index: 3;
        width: 100%;
        height: 100%;
        background: #f9f9fb;
        display:none;

        &.isVisibleOnMovil{
            display:initial;
        }
    }
`