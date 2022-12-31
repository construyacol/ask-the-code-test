import { Container, Chain, Chains } from './styles'


const chains = [
    'Tron',
    'Ethereum',
    'Coinsenda'
]

const DEFAULT_CHAIN = 'Ethereum'

const SupportChain = () => {

    return(
        <Container>
            <Chains>
                <h4 className="fuente">Red:</h4>
                {
                    chains.map(chain => {
                        const activeChain = DEFAULT_CHAIN === chain
                        return(
                            <Chain className={`${activeChain ? 'isActive' : ''}`}>
                                <p className='fuente'>{chain}</p>
                            </Chain>
                        )
                    })
                }
            </Chains>
        </Container>
    )
}

export default SupportChain