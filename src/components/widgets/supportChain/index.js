import { Container, Chain, Chains } from './styles'
import { isEmpty } from 'lodash'
import depositNetworksHoc from 'components/hoc/depositNetworksHoc'
import withdrawNetworksHoc from 'components/hoc/withdrawNetworksHoc'
import IconSwitch from 'components/widgets/icons/iconSwitch'

const SupportChains = ({ networks, currentNetwork, toggleNetwork }) => {
    console.log('networks', networks)
    if(isEmpty(networks)) return null;
    return(
        <Container>
            <Chains>
                <h4 className="fuente">Red :</h4>
                {
                    Object.keys(networks).map((network, index) => {
                        const activeChain = currentNetwork?.provider_type === network
                        const { user_friendly } =  networks[network]
                        return(
                            <Chain key={index} className={`${activeChain ? 'isActive' : ''}`} onClick={() => toggleNetwork(network)}>
                                {
                                    activeChain &&
                                    <IconSwitch
                                        icon={networks[network]?.provider_type}
                                        size={15}
                                    />
                                }
                                <p className={`fuente ${activeChain ? 'active' : ''}`}>
                                    {network}
                                    &nbsp; 
                                    <span className='fuente2'>{user_friendly ? `(${user_friendly?.token_protocol || user_friendly?.network})` : ''}</span>
                                </p>
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