import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCoinsendaServices } from "services/useCoinsendaServices";
// import useToastMessage from "hooks/useToastMessage";
import addPanelStagesToReqs from 'api/components/infoPanel'

export default function kycHoc(AsComponent) {
  return function (props) {

    // const [toastMessage] = useToastMessage();
    const { user } = useSelector((state) => state.modelData);
    const [ levelRequirements, setLevelRequirements ] = useState()
    const [ coinsendaServices ] = useCoinsendaServices(); 


    const getLevelRequirements = async() => {
      const reqs = await coinsendaServices.createRequirementLevel("level_1", false)
      if(!reqs)return;
      const _levelRequirements = await addPanelStagesToReqs({reqs, user})
      console.log('reqs', reqs)
      console.log('_levelRequirements', _levelRequirements)
      debugger
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

    return (
      <AsComponent
        user={user}
        levelRequirements={levelRequirements}
        {...props}
      />
    );
  };
}
 