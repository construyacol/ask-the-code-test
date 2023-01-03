import { Container, Chain, Chains } from './styles'
import { isEmpty } from 'lodash'
import depositNetworksHoc from 'components/hoc/depositNetworksHoc'
import withdrawNetworksHoc from 'components/hoc/withdrawNetworksHoc'


const SupportChains = ({ networks, currentNetwork, toggleNetwork }) => {

    if(isEmpty(networks)) return null;

    return(
        <Container>
            <Chains>
                <h4 className="fuente">Red :</h4>
                {
                    Object.keys(networks).map((network, index) => {
                        const activeChain = currentNetwork?.provider_type === network
                        return(
                            <Chain key={index} className={`${activeChain ? 'isActive' : ''}`} onClick={() => toggleNetwork(network)}>
                                <p className='fuente'>{network}</p>
                            </Chain>
                        )
                    })
                }
            </Chains>
        </Container>
    )
}


export const SupportDepositChains = depositNetworksHoc(SupportChains)
export const SupportWithdrawChains = withdrawNetworksHoc(SupportChains)