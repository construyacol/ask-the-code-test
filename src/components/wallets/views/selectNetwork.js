import depositNetworksHoc from 'components/hoc/depositNetworksHoc'
import withdrawNetworksHoc from 'components/hoc/withdrawNetworksHoc'
import { SelectListContainer, ItemListComponent, SelectListSkeleton } from 'components/forms/widgets/selectListComponent'
import { BiRightArrowAlt } from 'react-icons/bi';
import { OptionInputContainer } from 'components/forms/widgets/sharedStyles'
import styled from 'styled-components'
import { capitalizeWord } from 'utils'
import { isEmpty } from 'lodash' 
import { P } from 'core/components/atoms'
  

const Layout = styled.section`
    width: 100%;
    height: 100%;
    .span__protocol{
        font-size: 14px;
        opacity: 0.5;
        font-weight: 400;
        color: var(--paragraph_color);
    }
`
 
const SelectNetwork = ({ networks, toggleNetwork, uiName }) => {
   return(
      <Layout>
         {
            isEmpty(networks) ?
            <SelectListSkeleton stageIndicator={false}/>
            :
            <OptionInputContainer>
               <P className="fuente _pLabel _inputLabelP">{uiName}</P>
               <SelectListContainer>
               {
                     Object.keys(networks).map((networkName, index) => {
                        const network = networks[networkName]
                        const { user_friendly } =  network
                        return(  
                           <ItemListComponent 
                                 key={index}
                                 className="createButton"
                                 lastIndex
                                 handleAction={() => toggleNetwork(networkName)}
                                 itemList={{
                                    icon:network?.icon || networkName,
                                    auxUiName:network?.auxUiName,
                                    uiName: () => <>
                                       Red {capitalizeWord(network?.uiName || networkName)}
                                       <span className='fuente2 span__protocol'>{user_friendly ? `(${user_friendly?.token_protocol?.toUpperCase() || user_friendly?.network?.toUpperCase()})` : ''}</span>
                                    </> 
                                 }}
                                 AuxComponent={[
                                    () => <BiRightArrowAlt className="button_item--nextCta" size={37} />
                                 ]}
                           />
                        )
                     })
               }
               </SelectListContainer>
            </OptionInputContainer>
         }
      </Layout>
   )
}


export const SelectDepositNetwork = depositNetworksHoc(SelectNetwork)
export const SelectWithdrawNetwork = withdrawNetworksHoc(SelectNetwork)