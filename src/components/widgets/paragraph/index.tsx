import Paragraph from './styles'

type paragraph = {
    text?:string,
    className?:string    
}

const P =({ 
    text,
    className
}:paragraph) => (

    <Paragraph className={className}>
        {text}
    </Paragraph>

)

export default P
