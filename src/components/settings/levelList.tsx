import { 
    LevelsContainer,
    LevelContent,
    LevelDescriptionContent,
    // LevelsWrapper
} from './styles'

import { isEmpty } from 'lodash'
import { levelData, levelListProps } from '../../interfaces/settings/kyc'
import { LEVELS_DATA } from 'const/levels'
import getIcon from './icons'

const LevelListComponent = ({ levelRequirements, currentLevelView, user }:levelListProps) => {

    const getSuccessPercent = () => {
        let percent = 0
        if(user?.contact)percent += 25;
        if(user?.location)percent += 25;
        if(user?.identity){
            if(["accepted", "confirmed"].includes(user?.identity?.info_state))percent += 25;
            if(["accepted"].includes(user?.identity?.file_state))percent += 25;
        }
        return `${percent}%`
    }

    return(
            <LevelsContainer>
                {
                    !levelRequirements ?
                    ["1", "2"].map((_, index) => {
                        return(
                            <LevelContent
                                key={index}
                                className="skeleton"
                            />
                        )
                    })
                    :
                    Object.entries(LEVELS_DATA).map((level, index) => {

                        const levelKey = level[0]
                        const levelData:levelData = level[1]
                        const requirements = [levelKey].includes(levelRequirements?.name) ? levelRequirements.requirements : levelData.requirements
                        const disabled = !requirements || isEmpty(requirements)
                        const LevelIcon = levelData.requirements && getIcon(levelKey)
                        const isActive = currentLevelView === levelKey

                        return( 
                            <LevelContent 
                            key={index}
                            className={`${disabled ? 'disabled' : 'enabled'} ${isActive ? "isActived" : ""} `}
                            >   
                                {
                                    LevelIcon &&
                                    <LevelIcon
                                        className="_levelIcon"
                                        size={27}
                                        color="var(--primary)"
                                    />
                                }
                                <LevelDescriptionContent>
                                    <p className={`_title ${disabled ? "disabled" : ""} `}>{levelData.uiName}</p>
                                    <p className={`_description ${disabled ? "disabled" : ""} `}> {getSuccessPercent()} completado</p>
                                </LevelDescriptionContent>
                            </LevelContent>
                        )
                    })
                }
            </LevelsContainer>
    )
}


export default LevelListComponent