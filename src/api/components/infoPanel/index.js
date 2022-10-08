import { ApiGetContactStages } from 'components/forms/widgets/kyc/contactComponent/api'
import { ApiGetLocationStages } from 'components/forms/widgets/kyc/locationComponent/api'
import { getAllIdentityStages } from 'components/forms/widgets/kyc/identityComponent/api'
import ungapStructuredClone from '@ungap/structured-clone';

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
  if(["accepted"].includes(user?.identity?.file_state)) delete levelReqs.itemsMenu.location;
  for(let levelKey in levelReqs?.itemsMenu) {
    const stages = await createPanelStage[levelKey]()
    levelReqs.itemsMenu[levelKey].stages = stages
  }
  return levelReqs
}

export default addPanelStagesToReqs