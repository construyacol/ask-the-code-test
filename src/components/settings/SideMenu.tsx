
import { 
    SettingsMenuContainer, 
    ItemMenu,
    SettingsContent
} from 'components/settings/styles'

import { settingsMenu } from 'api/ui/menuItems'
import getIcon from './icons'
import { BiRightArrowAlt } from 'react-icons/bi';


const SideMenuComponent = (props:any) => {

    const { 
        currentSection,
        skeleton,
        isMovilViewport,
        identityState,
        BASE_URL = "settings"
    } = props

    const isVisibleOnMovil = isMovilViewport && !currentSection

    return(
        <SettingsMenuContainer className={`${isVisibleOnMovil ? "isVisibleOnMovil" : ""}`}> 
            <SettingsContent className={`${skeleton ? "skeleton" : ""}`}>
                {
                    Object.keys(settingsMenu).map((itemKey, index) => {

                        const itemMenu = settingsMenu[itemKey as keyof typeof settingsMenu]
                        const Icon = getIcon(itemKey)
                        const isSelected = currentSection === itemKey
                        const iconSize = isMovilViewport ? 22 : ["kyc"].includes(itemKey) ? 20 : 18 

                        return(
                            <ItemMenu  
                                key={index} 
                                className={`${isSelected ? 'selected' : ''}`}
                                to={`/${BASE_URL}/${itemKey}`}
                            >
                                {
                                    skeleton ?
                                        <div className="icon_skeleton"></div>
                                    :
                                        <Icon 
                                            size={iconSize} 
                                            color={isSelected ? "var(--primary)" : "var(--paragraph_color)"} 
                                        />
                                }

                                <p className='fuente'>{itemMenu?.uiName}</p>

                                {
                                    isMovilViewport && 
                                        <BiRightArrowAlt 
                                            size={34} 
                                            color="var(--paragraph_color)" 
                                            className={`${(!["accepted"].includes(identityState) && ["kyc"].includes(itemKey)) ? 'anim-flow' : ''}`} 
                                        />
                                }

                            </ItemMenu>
                        )
                    })
                }
            </SettingsContent>
        </SettingsMenuContainer>
    )
}

export default SideMenuComponent