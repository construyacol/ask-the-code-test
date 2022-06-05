import styled from 'styled-components'


export default function ListViewComponent() {
    return(
        <ListViewContainer>
            <p>Lista de elementos</p>
        </ListViewContainer>
    )
}

export const ListViewContainer = styled.div`
    display:grid;
    height:1500px;
    margin-bottom:50px;
`