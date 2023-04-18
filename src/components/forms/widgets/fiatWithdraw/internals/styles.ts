import styled from 'styled-components'

export const Flex = styled.div`
    display: flex;
`

export const FlexColumn = styled(Flex)`
    flex-direction: column;
`

export const Content = styled(FlexColumn)`
    row-gap: 20px;
`

export const ButtonCont = styled(Flex)`
    column-gap: 15px;
    justify-content: center;
`

export const IdentifierCont = styled(Flex)`
    column-gap:7px;
    padding-left: 12px;
    border-left: 2px solid var(--primary);
`