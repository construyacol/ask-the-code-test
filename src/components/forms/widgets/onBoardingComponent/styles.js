import styled from 'styled-components'



export const CopyContainer = styled.div`
    display:flex;
    p{
        font-size: 1em;
        text-align: center;
        max-width: 550px;
        line-height: 25px;
        font-size: 1.3em;
        color:var(--paragraph_color)
    }

    p > span{
        font-size: 1em;
        font-weight: bolder;
        color: #0198ff;
    }
    @media (max-width: 768px) {
        p{
            padding: 0 25px;
            font-size:1em;
        }
        
    }
`