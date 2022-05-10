import styled from 'styled-components'


export const PrefixContainer = styled.div`

transition:.3s;
position:absolute;
align-self: center;
height: 70%;
width: 75px;
display: grid;
cursor:pointer;
border-right: 1px solid gray;
background:white;
padding: 0 15px;
left:0;

align-items: center;
column-gap: 8px;
overflow: hidden;
grid-template-columns: auto auto 1fr;

    .prefixInputContainer{
        margin-left:25px;
        input{
            color:"gray";
            transition:0s;
        }
    }
    
    svg{
        position: absolute;
        right: ${props => props.activeStage ? '15px' : '5px'};
    }
    
    .prefix_flag_{
        border-radius:50%;
        background:#bbbbbb;
        height: 25px;
        width: 25px;
        background-image: url(${props => props.img || ''});
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }

    .prefixContainer__prefix_text::after{
        content: '';
        height: 100%;
        width: 300%;
        position: absolute;
        left: -70%;
    }

    p{
        position:relative;
        height: 70%;
        display: flex;
        align-items: center;
        align-self: center;
        margin:0;
        width: max-content;
    }

`