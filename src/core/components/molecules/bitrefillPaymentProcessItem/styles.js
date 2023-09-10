import styled from 'styled-components'


export const IsCompletedIcontainer = styled.div`
    width: 60%;
    height: 60%;
    border-radius: 50%;
    display: flex;
    place-content: center;
    place-items: center;
    border: 1px solid var(--green_color);
    background-color: var(--green_color);
`

export const IconContainer = styled.div`
    height: 3rem;
    width: 3rem;
    aspect-ratio: 1; 
    background-color: white;
    border: 1px solid #E9E9E9;
    border-radius: 50%;
    display: flex;
    place-content: center;
    place-items: center;
    transition:.3s;
    img{
        transition: .3s;
        opacity: .01;
    }
    &.inProgress{
        border-color: var(--primary);
        img{
            opacity: 1;
        }
    }
    &.isCompleted{
        /* border-color: var(--green_color); */
    }
`

export const ProcessItem = styled.div`
    height: 4rem;
    width: 100%;
    background-color: #43576814;
    border: 1px solid #E9E9E9;
    background-color: #43576808;
    backdrop-filter: blur(10px);
    border-radius: 9px;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    padding: 0 0.7rem;
    width: calc(100% - 1.4rem);
    column-gap: 1rem;
    opacity: .3;
    transition: .3s;

    &.isCompleted{
        opacity: 1;

    }
    &.inProgress{
        opacity: 1;
        .titleProcess{
            font-weight: 600;
        }
    }
    p, span{
        font-size: .9rem;
    }

    &.isCompleted{
        p, span{
            color:var(--green_color)
        }
    }

`



