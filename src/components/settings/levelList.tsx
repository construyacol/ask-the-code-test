import { 
    LevelsContainer,
    LevelContent,
    LevelDescriptionContent,
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
        currentLevelView
    } = props

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
                                <p className={`_description ${disabled ? "disabled" : ""} `}>0% completado</p>
                            </LevelDescriptionContent>
                        </LevelContent>
                    )
                })
            }
        </LevelsContainer>
    )

}


export default LevelListComponent