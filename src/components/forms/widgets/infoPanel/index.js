import { useState } from 'react'
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
import getIcon from './icons'
import { IndicatorHover } from 'components/widgets/accountList/listView'
// import { useSelector } from "react-redux";
import { BiCheck, BiErrorAlt } from "react-icons/bi";

import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { P } from 'core/components/atoms'
import { findLastKey, isEmpty } from 'lodash'
import { ErrorMessage } from './styles'
// import ungapStructuredClone from '@ungap/structured-clone';

const InfoPanel = ({ 
  title, 
  stageData, 
  state,
  dataForm, 
  stageStatus, 
  user, 
  levelRequirements, //source data from identity HOC
  isOpenPanelInfo,
  stageController,
  viewportSizes:{ isMobile }
}) => {
 
  const [ toggleId, setToggleId ] = useState({ key:false })
  const currentIdentity = dataForm?.config?.currentIdentity
  const errorMessage = dataForm?.handleError?.errorMessage

  const toogleSection = e => {
    if(!e?.target?.dataset?.id)return;
    const key = e?.target?.dataset?.id
    setToggleId(prevState => {return {[key]:!prevState[key]}})
  }

  const getTopPanel = () => {
    const defaultTop = "0px"
    if(!isMobile && !levelRequirements)return defaultTop;
    const infoStateHeight = document.querySelector("#infoStatemobile__")?.clientHeight ?? 80;
    const titleHeight = document.querySelector("#titleContainer__")?.clientHeight ?? 0;
    const height = `${infoStateHeight + titleHeight + 50}px` ?? defaultTop;
    return height
  }

  if(!levelRequirements){
    return<InfoPanelSkeleton/>
  }

  let { itemsMenu, pendingRequirements } = levelRequirements
  let errors = dataForm?.handleError?.errors


  return (
      <InfoPanelContainer 
        id="infoPanel" 
        className={`${isMobile && isOpenPanelInfo ? 'isOpen' : ''}`}
        style={{top:getTopPanel()}}
      > 
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

                                const isFirstStage = id === 0
                                const stageIndex = stageController?.indexOf(key)
                                const prevStageKey = stageController && stageController[(stageIndex-1)]
                                const prevState = state[prevStageKey]
                                const isAvailable = (prevState || isFirstStage || errors || ["location"].includes(menuKey) || dataForm?.wrapperComponent?.includes('files')) ? true : false;


                                return ( 
                                  <li className={`${((inProgress || isCompleted || isSuccessfull) && isAvailable) ? 'checked' : ''} ${((inProgress || key === 'files') && itemRejected) ? 'inProgress reject' : key === stageData?.key ? 'inProgress' : ''} fuente ${itemRejected ? 'rejected' : ''}`} key={id}>
                                    { 
                                      ((isSuccessfull || isCompleted) && isAvailable) &&
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
        {
          errorMessage &&
            <ErrorMessage>
                <P color="red">{errorMessage}</P>
            </ErrorMessage>
        }
      </InfoPanelContainer>
  )
}

 
export default InfoPanel



const IsActiveIndicator = () => (
  <IndicatorHover className='isActive'>
      <div className="indicator" >
          <div className="indicatorSon"></div>
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
