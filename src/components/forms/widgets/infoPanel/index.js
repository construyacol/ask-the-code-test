import { useEffect, useState } from 'react'
import {
  InfoPanelContainer,
  InfoContent,
  IconCont,
  ItemRequirement,
  ItemRequirementContainer,
  Ul
} from './styles'
import { 
  IconContainer 
} from 'styles/global'
import { useCoinsendaServices } from "services/useCoinsendaServices";
import getIcon from './icons'
import { IndicatorHover } from 'components/widgets/accountList/listView'
import { useSelector } from "react-redux";
import { BiCheck, BiErrorAlt } from "react-icons/bi";
import addPanelStagesToReqs from 'api/components/infoPanel'

import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { P } from 'components/widgets/typography'
import { findLastKey, isEmpty } from 'lodash'
import ungapStructuredClone from '@ungap/structured-clone';



const IsActiveIndicator = () => (
  <IndicatorHover className='isActive'>
      <div className="indicator" >
          <div className="indicatorSon" ></div>
      </div>
  </IndicatorHover>
)

const ArrowIconSwitch = ({ isSuccessfull, isOpen }) => {

  if(!isSuccessfull) return null;
  let size = 24

  return(
    <IconContainer>
      {
        isOpen ?
          <BiChevronUp size={size}/>
        :
          <BiChevronDown size={size}/>
      }
    </IconContainer>
  )
}

const InfoPanel = ({ title, stageData, state, dataForm, stageStatus, setInfoStages }) => {

  const [ levelRequirements, setLevelRequirements ] = useState()
  const [ toggleId, setToggleId ] = useState({key:false})
  const [ coinsendaServices ] = useCoinsendaServices(); 
  const { user } = useSelector((state) => state.modelData);
  const currentIdentity = dataForm?.config?.currentIdentity

  const toogleSection = e => {
    if(!e?.target?.dataset?.id)return;
    const key = e?.target?.dataset?.id
    setToggleId(prevState => {return {[key]:!prevState[key]}})
  }

  const getLevelRequirements = async() => {
    const reqs = await coinsendaServices.createRequirementLevel("level_1", false)
    if(!reqs)return;
    const _levelRequirements = await addPanelStagesToReqs({reqs, user})
    setLevelRequirements(_levelRequirements)
    // const { pendingRequirements, itemsMenu } = _levelRequirements
    // const currentRequirement = pendingRequirements[0] || 'identity'
    // let stages = ungapStructuredClone(itemsMenu[currentRequirement]?.stages)
    // if(stages?.files)delete stages.files;
    
    // setInfoStages({
    //   allStages:stages && Object.keys(stages),
    //   stages,
    //   currentRequirement,
    //   levelRequirements:_levelRequirements
    // })
  }

  useEffect(() => {
    getLevelRequirements()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(!levelRequirements){
    return<InfoPanelSkeleton/>
  }
  
  let { itemsMenu, pendingRequirements } = levelRequirements
  let errors = dataForm?.handleError?.errors

  return (
      <InfoPanelContainer id="infoPanel">
        <InfoContent>
              { 
                Object.entries(itemsMenu).map((itemMenu, index) => {

                  let menuKey = itemMenu[0]
                  const isDisabled = false
                  const Icon = getIcon(menuKey)
                  const isSuccessfull = ["accepted"].includes(user[menuKey]?.state) && menuKey !== 'identity';
                  const currentPendingRequirement = ["location", "contact"].includes(pendingRequirements[0]) ? "location" : pendingRequirements[0]
                  const isActive = menuKey?.includes(currentPendingRequirement) || (isEmpty(pendingRequirements) && menuKey === 'identity')
                  const sectionState = isSuccessfull ? 'complete' : isActive ? 'inProgress' : 'pending'
                  const AuxComponentIcon = isActive ? IsActiveIndicator : ["complete", "pending"].includes(sectionState) ? ArrowIconSwitch: () => null

                  return(
                    <ItemRequirementContainer key={index} className={`${sectionState}`}>

                      <ItemRequirement
                          className={`${menuKey} ${isActive ? 'isActive' : ''} ${isSuccessfull ? 'isSuccessfull' : ''} ${isDisabled ? 'disabled' : ''}`} 
                          data-id={`${menuKey}`}
                          onClick={ ["complete", "pending"].includes(sectionState) ? toogleSection : () => null }
                      >   
                          <IconCont color={isActive || isSuccessfull ? 'primary' : ''}>
                            <Icon size={20}/>
                          </IconCont>
                          <P className="titleSection fuente bold">{itemsMenu[menuKey]?.uiName}</P>
                          <AuxComponentIcon
                            isSuccessfull={true}
                            isOpen={toggleId[menuKey]}
                          />
                      </ItemRequirement> 

                      {
                        itemsMenu[menuKey]?.stages &&
                          <Ul 
                            style={{ height:["complete", "pending"].includes(sectionState) && !toggleId[menuKey] ? 0 :`calc(${Object.keys(itemsMenu[menuKey]?.stages).length} * 40px)` }}
                            >
                            {
                              Object.keys(itemsMenu[menuKey]?.stages).map((key, id) => {
                                if(key.includes('meta'))return null;

                                const inProgress = key === stageData?.key || ["phone"].includes(key);
                                const itemRejected = (errors && errors[key]) && true

                                const isCompleted = (state[key] && key !== stageData?.key) || 
                                (state[key] && ["success"].includes(stageStatus)) || 
                                (key !== stageData?.key && ["phone"].includes(key)) ||   
                                (["confirmed"].includes(currentIdentity?.info_state) && key !== 'files') || 
                                (["confirmed"].includes(currentIdentity?.info_state) && key === 'files' && !findLastKey(state, (lastItem) => lastItem === undefined)) ||
                                ((errors && !errors[key]) && key !== 'files');

                                return (
                                  <li className={`${(inProgress || isCompleted || isSuccessfull) ? 'checked' : ''} fuente ${itemRejected ? 'rejected' : ''}`} key={id}>
                                    { 
                                      (isSuccessfull || isCompleted) &&
                                      <BiCheck color="green" size={16} />
                                    }
                                    {
                                      !isCompleted && itemRejected &&
                                      <BiErrorAlt color="red" size={16} />
                                    }
                                    <P  
                                      className="fuente ulItem"
                                      color={(isCompleted || isSuccessfull) ? 'primary' : itemRejected ? 'red' : ''}
                                      >
                                        {itemsMenu[menuKey]?.stages[key].ui_name}
                                    </P>
                                  </li>
                                )
                              })
                            }
                          </Ul>
                      }

                    </ItemRequirementContainer>
                  )
                })
              }
        </InfoContent>
      </InfoPanelContainer>
  )
}

 
export default InfoPanel
 



export const InfoPanelSkeleton = ({ items = [1,2,3] }) => (
  <InfoPanelContainer>
    <InfoContent>
      <ItemRequirementContainer>
        <ItemRequirement>
          <IconCont skeleton/>
          <P skeleton>---- SKELETON ----</P>
        </ItemRequirement>
        <Ul>
          {
            items.map((item, index) => {
              return(
                <li key={index}>
                  <P  className="fuente ulItem" skeleton>---- SKELETON ----</P>
                </li>
              )
            })
          }
        </Ul>
      </ItemRequirementContainer>
    </InfoContent>
  </InfoPanelContainer>
)
