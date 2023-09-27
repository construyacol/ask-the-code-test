import styled from 'styled-components';


export const ContentContainer = styled.div`
  width: 100%;
  display: grid;
  row-gap: 2rem;
  grid-template-rows: 1fr auto auto;
  justify-items: center;
`

export const Layout = styled.div`

  position: absolute;
  z-index: 99;
  padding: 1.5rem;
  height: calc(100vh - 3rem);
  width: calc(100% - 3rem);
  background: #1ABC9C;
  display: grid;
  place-content: center;
  background: linear-gradient(rgb(255, 255, 255) 0%, rgb(236, 242, 248) 100%);

  p a {
    padding: 5px 10px;
    border-radius: 3px;
    background: #FFF;
    color: #1ABC9C;
    font-weight: bold;
    text-decoration: none;
  }
`