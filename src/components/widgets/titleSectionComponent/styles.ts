import styled from 'styled-components'
import { OnlySkeletonAnimation } from '../loaders/skeleton'
import { device } from '../../../const/const'


const Container = styled.div`
    display:grid;
    grid-template-columns:1fr auto;
`

export const TitleContainer = styled(Container)`
    border-bottom: 1px solid #d5d5d6;
    position: sticky;
    z-index:2;

    &.accountDetailTitle.wallets{
        grid-template-columns: auto 1fr;
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
        @media ${device.mobile} {
            &.main{
                top: 100px;
            }
        }

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

export const SubContainer = styled(Container)`
    padding:0;
    @media ${device.mobile} {
        display:none;
    }
`


export const SubTitle = styled.p`
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

export const Title = styled.h1`
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