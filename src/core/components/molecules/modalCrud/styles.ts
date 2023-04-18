import styled from 'styled-components'
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
    width: 90%;
    background-color: white;
    position:relative;
    border-radius: 10px;
    row-gap: ${props => props.rowGap ? `${props.rowGap}` : '0'};
    &.medium{
        max-width: 450px;
        row-gap: 20px;
    }
`
