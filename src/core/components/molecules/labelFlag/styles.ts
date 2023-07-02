import styled from 'styled-components';
import { device } from 'const/const'


export const LabelContainer = styled.span`
    font-size: 11px;
    height:14px;
    width:auto;
    padding: 3px 6px;
    border-radius: 3px;
    font-weight:normal;

    &.absolute{
        position: absolute;
        bottom: 5px;
        right: 5px;
        @media ${device.mobile} {
            top: 5px;
        }
    }

    &.verified,
    &.trade,
    &.accepted{
        background: #2bc48a1f;
        color:#219D6E;
    }

    &.rejected{
        background: #FFE0E0;
        color:#FF0000;
    }

    &.savings,
    &.confirmed{
        background:#f7f7f7;
        color:#FF8C00;
    }
    &.pending{
        background: #FFF1E0;
        color:#FF8C00;
    }

    &.unverified{
        background: #cacaca59;
        color:var(--paragraph_color);
    }
`