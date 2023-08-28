import styled from 'styled-components'

export const FallBackLayout = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  place-content: center;
  place-items: center;
`

export const FallBackContainer = styled.section`
  display: grid;
  place-items: center;
  .poweredBy__p{
    font-size: .7rem;
  }
  p{
    text-align: center;
  }
`

export const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: ${props => props.iframeLoaded ? `initial` : 'none'};
` 