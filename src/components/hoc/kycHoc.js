import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCoinsendaServices } from "services/useCoinsendaServices";
import addPanelStagesToReqs from 'api/components/infoPanel'
import useViewport from 'hooks/useViewport'

export default function kycHoc(AsComponent) {
  return function (props) {

    const { user } = useSelector((state) => state.modelData);
    const [ levelRequirements, setLevelRequirements ] = useState()
    const [ coinsendaServices ] = useCoinsendaServices(); 
    const viewportSizes = useViewport()
    const [ isOpenPanelInfo, setIsOpenPanelInfo ] = useState(false)

    const getLevelRequirements = async() => {
      const reqs = await coinsendaServices.createRequirementLevel("level_1", false)      
      if(!reqs)return;
      const _levelRequirements = await addPanelStagesToReqs({reqs, user})
      setLevelRequirements(_levelRequirements)
    }

    useEffect(() => {
      getLevelRequirements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <AsComponent
        user={user}
        levelRequirements={levelRequirements}
        viewportSizes={viewportSizes}
        isOpenPanelInfo={isOpenPanelInfo}
        setIsOpenPanelInfo={setIsOpenPanelInfo}
        {...props}
      />
    );
  };
}
 