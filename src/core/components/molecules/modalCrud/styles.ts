import { CAPACITOR_PLATFORM } from 'const/const';
import styled from 'styled-components'
import { device } from "const/const"

interface CrudContainerProps {
    rowGap?: string;
}

export const Flex = styled.div`
    display: flex;
`

export const FlexColumn = styled(Flex)`
    flex-direction: column;
`

export const CrudContainer = styled(FlexColumn)<CrudContainerProps>`
    padding: 1.5rem 3rem;
    width: calc(100% - 6rem);
    background-color: white;
    position:relative;
    border-radius: 10px;
    row-gap: ${props => props.rowGap ? `${props.rowGap}` : '0'};

    &.height-fit-content{
        height: fit-content;
    }
    &.no-padding{
        padding: 0;
    }
    &.medium{
        max-width: 450px;
        row-gap: 20px;
        ${CAPACITOR_PLATFORM === 'ios' ? 'padding: 1.5rem 1.5rem;' : ''}
    }
    &.large{
        max-width: 700px;
        row-gap: 20px;
    }
    @media ${device.mobile} {
        padding: 1.5rem 1rem;
        width: calc(100% - 2rem);
    }
`
