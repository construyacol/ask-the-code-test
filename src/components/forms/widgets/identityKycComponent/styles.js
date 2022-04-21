import styled from 'styled-components'



export const Header = styled.div`
  grid-column: 1/3;
  h1, h3{
    text-align:left;
  }
  .subtitle{
    margin-top:0;
  }
  h1{
    color:var(--title1);
    margin-top:0;
  }
  h3{
    color:var(--paragraph_color);
    display:flex;
    align-items:center;
    column-gap:10px;
  }
`

export const MainContainer = styled.div`
    display:grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: minmax(400px, 1fr) minmax(250px, 400px);
    padding: 2.5rem 1.5rem;
    max-width: 1480px;
    justify-self: center;
    width: calc(100vw - 3rem);
    row-gap:10px;
    column-gap:25px;
    height: calc(100vh - 5rem);

    .item_{
        display:grid;
    }

    @media screen and (max-width: 768px){
        grid-template-columns: 1fr;
        grid-template-rows: auto auto 1fr;
        padding: 2.5rem 1rem 1rem;
        height: calc(100vh - 3.5rem);
        width: calc(100vw - 2rem);

        ${Header}{
            grid-column:auto;
            h1{
                font-size:26px;
            }
        }
    }   

`


