import styled, { keyframes } from 'styled-components'

const Welcome = props => {

    return(
        <Container className="introWelcome">
            <h1 className="fuente">Hola</h1>
            <Hand>👋</Hand>
        </Container>
    )

}

export default Welcome

const introWelcome = keyframes`
    0% {
        transform: translateY(50px);
        opacity:0;
    }
    100%{
        transform: translateY(0px);
        opacity:1;
    }
`;

const Container = styled.div`
    animation: ${introWelcome} .5s linear forwards;
    display: grid;
    align-items: center;
    justify-items: center;
    row-gap: 15px;
    transform: translateY(50px);
    opacity:0;

    h1{
        color: #0198ff;
        font-size: 50px;
        margin: 0;
    }
    span{
        font-size:45px;
    }
`




const handAnimation = keyframes`
    0% {
        transform: rotate(0deg);
    }
    15%{
        transform: rotate(45deg);
    }
    30% {
        transform: rotate(0deg);
    }
    45%{
        transform: rotate(45deg) ;
    }
    60% {
        transform: rotate(0deg);
    }
    ${'' /* 61%{
        transform: translateX(0px);
    }
    68%{
        transform: translateX(10px);
    }
    90%{
        transform: translateX(0px);
    } */}
`;


export const Hand = styled.span`
    animation: ${handAnimation} 3s .5s linear infinite;
    transform-origin: center;
`