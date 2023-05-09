import { useRef, useEffect, useState } from "react";
// import { Container, Chain, Chains } from './styles'
import depositNetworksHoc from 'components/hoc/depositNetworksHoc'
import withdrawNetworksHoc from 'components/hoc/withdrawNetworksHoc'
import useViewport from 'hooks/useViewport'
import { GrNetwork } from 'react-icons/gr';
import NetworkItem from './networkItem'
import DropDownList from 'components/widgets/dropDown'
import { isEmpty } from 'lodash'


const SelectNetwork = ({ className, ...props }) => {

    const { isMobile } = useViewport()
    const FilterElement = useRef()
    const [ selectOptions, setSelectOptions ] = useState()

    const networkChange = async ({ value }) => {
        if(!value)return
        props.toggleNetwork(value)
    };

    useEffect(() => {
        if(!isEmpty(props.networks)){
            (() => {
                let netWorks = {}
                for (let network in props.networks) {
                    netWorks = {
                        ...netWorks,
                        [network]:{
                            ...props.networks[network],
                            value:network,
                            component:() => <NetworkItem networkData={props.networks[network]} />,
                        }
                    }
                }
                setSelectOptions(netWorks)
            })()
        }
    }, [props.networks])

    useEffect(() => { 
        FilterElement.current.style.top = `180px`
        const subMenuHeight = document.querySelector('.subMenu')?.clientHeight
        const mainMenuHeight = document.querySelector('.MenuSuperiorLayout')?.clientHeight
        const accountTitle = document.querySelector('.accountDetailTitle')?.clientHeight
        let totalHeight = subMenuHeight + mainMenuHeight + accountTitle
        FilterElement.current.style.top = `${totalHeight}px`
    }, [])

    const positionNets = 'over'
    const classNamesPos = {
        under:"titleUnderPos justify-start",
        over:"titleOverPos justify-end",
    }

    return(
        <DropDownList
            refEl={FilterElement}
            className={`${isMobile ? 'isMobile stickyPos' : `stickyPos withOutBackground ${classNamesPos[positionNets]}`} withIconDisable`}
            defaultOption={props?.currentNetwork?.provider_type}
            title="Red"
            MainIcon={GrNetwork}
            options={selectOptions}
            handleAction={networkChange}
        />
    )
}
 
export const AvailableDepositNetwork = depositNetworksHoc(SelectNetwork)
export const AvailableWithdrawNetwork = withdrawNetworksHoc(SelectNetwork)













// const SupportChains = ({ networks, currentNetwork, toggleNetwork }) => {
//     if(isEmpty(networks)) return null;
//     return(
//         <Container>
//             <Chains>
//                 <h3 className="fuente">Red</h3>
//                 {
//                     Object.keys(networks).map((network, index) => {
//                         const activeChain = currentNetwork?.provider_type === network
//                         const { user_friendly } =  networks[network]
//                         return(
//                             <Chain key={index} className={`${activeChain ? 'isActive' : ''}`} onClick={() => toggleNetwork(network)}>
//                                 <IconSwitch
//                                     icon={networks[network]?.provider_type}
//                                     size={16}
//                                 />
//                                 <p className={`fuente ${activeChain ? 'active' : ''}`}>
//                                     {network}
//                                     &nbsp; 
//                                     <span className='fuente2'>{user_friendly ? `(${user_friendly?.token_protocol || user_friendly?.network})` : ''}</span>
//                                 </p>
//                             </Chain>
//                         )
//                     })
//                 }
//             </Chains>
//         </Container>
//     )
// }

// export const SupportDepositChains = depositNetworksHoc(SupportChains)
// export const SupportWithdrawChains = withdrawNetworksHoc(SupportChains)

