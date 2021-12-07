import styled from "styled-components"


const Captures = ({ state }) => {


    return(
        <Container id="captures">
            {
                Object.keys(state).map((stateKey, key) => {
                    return (
                        <img src={state[stateKey]} width={"100%"} key={key} alt=""/>
                    )
                })
            }
        </Container>
    )

}

export default Captures

const Container = styled.div`
    position: absolute;
    width: 150px;
    height: auto;
    min-height: 120px;
    z-index: 2;
    background: #ededed;
    bottom: 10px;
    right: 10px;
    border-radius: 6px;
    border: 3px solid darkgrey;
`