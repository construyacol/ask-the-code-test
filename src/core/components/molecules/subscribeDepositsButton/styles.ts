import styled from 'styled-components'
interface CrudContainerProps {
    rowGap?: string;
  }

export const Container = styled.div<CrudContainerProps>`
    position:relative;
    border-radius: 10px;
    display: flex;
    max-width: fit-content;
    max-height: 40px;
    align-self: center;
    column-gap: 15px;
`
