import styled from 'styled-components';


export const PaymentRequestLayout = styled.div`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: linear-gradient( to bottom right, #005894, #0198ff );
    justify-content: center;
    align-items: center;
`

export const HeaderContainer = styled.div`
    display: flex;
    place-content: center;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.palette.skeleton_color};
`



export const ContentContainer = styled.div`
    p, input{
        font-size:15px;
        /* color: ${props => props.theme.palette.text_color}; */
        width: 100%;
    }
    display: flex;
    flex-direction: column;
    row-gap: 30px;
    margin: 20px 0;
`
