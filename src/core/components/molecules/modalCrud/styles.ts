import styled from 'styled-components'

export const Flex = styled.div`
    display: flex;
`

export const FlexColumn = styled(Flex)`
    flex-direction: column;
`

export const CrudContainer = styled(FlexColumn)`
    padding: 1.5rem 3rem;
    width: 70%;
    background-color: white;
    position:relative;
    border-radius: 10px;
    &.medium{
        max-width: 450px;
        row-gap: 20px;
    }
`
