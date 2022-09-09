import { 
    LevelsContainer,
    LevelContent,
    LevelDescriptionContent,
    // LevelsWrapper
} from './styles'

import { isEmpty } from 'lodash'
import { levelData } from './types'
import { GoLocation } from "react-icons/go";
import { LEVELS_DATA } from 'const/levels'


const icons = {
    "level_1":GoLocation
}

const LevelListComponent = (props:any) => {

    const {
        levelRequirements,
        currentLevelView,
        user
    } = props

    const getSuccessPercent = (level:string) => {
        let percent = 0
        if(user?.contact)percent += 25;
        if(user?.location)percent += 25;
        if(user?.identity){
            if(["accepted"].includes(user?.identity?.info_state))percent += 25;
            if(["accepted"].includes(user?.identity?.file_state))percent += 25;
        }
        return `${percent}%`
    }

    return(
            <LevelsContainer>
                {
                    !levelRequirements ?
                    ["1", "2"].map((levelSkeleton, index) => {
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
                        const requirements = [levelKey].includes(levelRequirements?.name) ? levelRequirements.requirements : levelData.requeriments
                        const disabled = !requirements || isEmpty(requirements)
                        const LevelIcon = icons[levelKey as keyof typeof icons]
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
                                    <p className={`_description ${disabled ? "disabled" : ""} `}> {getSuccessPercent("level_1")} completado</p>
                                </LevelDescriptionContent>
                            </LevelContent>
                        )
                    })
                }
            </LevelsContainer>
    )
}


export default LevelListComponent