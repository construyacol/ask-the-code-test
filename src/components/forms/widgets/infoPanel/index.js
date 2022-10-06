import { useEffect, useState } from 'react'
// import styled from 'styled-components'
// import { setMessageError } from '../../utils'
import { H2, P } from 'components/widgets/typography'
import {
  // ErrorMessage,
  InfoPanelContainer,
  InfoContent,
  IconCont,
  ItemRequirement,
  ItemRequirementContainer
} from './styles'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';


import { useCoinsendaServices } from "services/useCoinsendaServices";
import getIcon from './icons'
import { IndicatorHover } from 'components/widgets/accountList/listView'
import { ApiGetContactStages } from '../kyc/contactComponent/api'
import { ApiGetLocationStages } from '../kyc/locationComponent/api'
import { getAllIdentityStages } from '../kyc/identityComponent/api'
import { useSelector } from "react-redux";
import ungapStructuredClone from '@ungap/structured-clone';
import { BiCheck } from "react-icons/bi";



const createContactLocationStage = async() => {
    let contactStages = await ApiGetContactStages()
    let locationStages = await ApiGetLocationStages()
    return {...contactStages, ...locationStages}
}

const createIdentityStage = async() => {
  let identityStages = await getAllIdentityStages()
  return identityStages
}

const createPanelStage = {
  location:createContactLocationStage,
  identity:createIdentityStage
}

const addPanelStagesToReqs = async({reqs, user}) => {

  let levelReqs = ungapStructuredClone(reqs)
  if(user?.identity) delete levelReqs.itemsMenu.location 
  
  for(let levelKey in levelReqs?.itemsMenu) {
    const stages = await createPanelStage[levelKey]()
    levelReqs.itemsMenu[levelKey].stages = stages
  }
  return levelReqs
}


const InfoPanel = ({ title, stageData, state, dataForm, stageStatus}) => {

  const [ levelRequirements, setLevelRequirements ] = useState()
  const [ coinsendaServices ] = useCoinsendaServices(); 
  const { user  } = useSelector((state) => state.modelData);
  // const identityState = getIdentityState(user?.identity)


  const getLevelRequirements = async() => {

    const reqs = await coinsendaServices.createRequirementLevel("level_1", false)
    const levelRequirements = await addPanelStagesToReqs({reqs, user})
    // const identityStages = await ApiGetIdentityStages()
    // levelReqs.itemsMenu.identity.stages = identityStages
    setLevelRequirements(levelRequirements)
  }

  useEffect(() => {
    // if(document.body.clientWidth > 768){
    //   document.querySelector('#mainLayout')?.classList.add("infoPanel");
    // }
    getLevelRequirements()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(()=>{
  //   if(handleError?.errors[stageData?.key]){
  //     setMessageError(`.label_text__${stageData.key}`, handleError.errors[stageData.key])
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [stageData])

  if(!levelRequirements){
    return <p>SKELETON</p>
  }
  
  let { itemsMenu, pendingRequirements } = levelRequirements

  console.log('stageData', stageData?.key)

  return (
      <InfoPanelContainer id="infoPanel">
          {/* <H2 className="title">
            {title || 'Título'} 
          </H2> */}
        <InfoContent>
              { 
                Object.entries(itemsMenu).map((itemMenu, index) => {
                  let menuKey = itemMenu[0]
                  const isDisabled = false
                  const Icon = getIcon(menuKey)
                  const isSuccessfull = ["accepted"].includes(user[menuKey]?.state)
                  const isActive = menuKey?.includes(pendingRequirements[0])
                  // eslint-disable-next-line no-lone-blocks
                  {/* const isDisabled = pendingRequirements.length <= 1 ? false : (!isActive && zipObject(pendingRequirements)?.hasOwnProperty(menuKey)) */}
                  return(
                    <ItemRequirementContainer>
                      <ItemRequirement
                          key={index} 
                          className={`${menuKey} ${isActive ? 'isActive' : ''} ${isDisabled ? 'disabled' : ''}`} 
                          data-id={menuKey}
                          // onClick={isDisabled ? () => null : toogleSection}
                      >   
                          <IconCont color={isActive || isSuccessfull ? 'primary' : ''}>
                            <Icon size={20}/>
                          </IconCont>
                          <P className="fuente bold">{itemsMenu[menuKey]?.uiName}</P>
                          <IndicatorHover className={isActive ? 'isActive' : ''}>
                              <div className="indicator" >
                                  <div className="indicatorSon" ></div>
                              </div>
                          </IndicatorHover>
                      </ItemRequirement> 
                      {
                        itemsMenu[menuKey]?.stages &&
                          <ul className={isSuccessfull ? 'isSuccessfull' : ''}>
                            {
                              Object.keys(itemsMenu[menuKey]?.stages).map((key, id) => {
                                if(key.includes('meta'))return null;

                                const inProgress = key === stageData?.key || ["phone"].includes(key);
                                const isCompleted = (state[key] && key !== stageData?.key) || (state[key] && ["success"].includes(stageStatus))

                                return (
                                  <li className={`${(inProgress || isCompleted || isSuccessfull) ? 'checked' : ''} fuente`} key={id}>
                                    { 
                                      (isSuccessfull || isCompleted) &&
                                      <BiCheck color="green" size={16} />
                                    }
                                    <P 
                                      style={{
                                        margin:"0", 
                                        padding:"11px 0 10px 0px",
                                        fontSize:"14px"
                                      }} 
                                      className="fuente"
                                      color={(isCompleted || isSuccessfull) ? 'primary' : ''}
                                      >
                                        {itemsMenu[menuKey]?.stages[key].ui_name}
                                    </P>
                                  </li>
                                )
                              })
                            }
                          </ul>
                      }
                    </ItemRequirementContainer>
                  )
                })
              }
        </InfoContent>

        
        {/* {
          handleError?.defaultErrorMessage &&
          <ErrorMessage>{handleError.defaultErrorMessage}</ErrorMessage>
        } */}
      </InfoPanelContainer>
  )
}

 
export default InfoPanel
 
