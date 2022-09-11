import { IoMailUnreadOutline } from 'react-icons/io5';
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { BsShieldLock } from 'react-icons/bs';
import { IoMdFingerPrint } from 'react-icons/io';
// import { VscVerified } from 'react-icons/vsc';
import P from 'components/widgets/paragraph'

import { 
    SettingElementLayout,
    IconContainer,
    // SettingContent,
    SettingTitleCont,
    UiStateCont
} from './styles'

import { settingType } from 'components/settings/types'
import RenderAuxComponent from 'components/forms/widgets/renderAuxComponent'

const getIcon = (iconValue:string | undefined) => {
    const icons = {
        email:IoMailUnreadOutline,
        twofa:BsShieldLock,
        identity:IoMdFingerPrint
    }
    return icons[iconValue as keyof typeof icons]
}
 
export const SettingElementSkeleton = () => {
    return(
        <SettingElementLayout className="skeleton">
            <IconContainer className="skeleton__iconContainer"/>
            <h3 className="fuente skeleton__h3 title__h3">--- this is a title &nbsp;</h3>
            <p className="fuente description__p skeleton__p">this is awesome description ------</p>
        </SettingElementLayout>
    )
}

const SettingElement = (props:settingType) => {
    const { 
        itemElement, 
        isCompleted, 
        isLastElement,
        AuxComponent,
        handleAction
    } = props

    const IconVerified = isCompleted ? FiCheckCircle : FiAlertCircle;
    const uiState = isCompleted ? itemElement?.states?.uiEnabled : itemElement?.states?.uiDisabled;
    const IconSetting = getIcon(itemElement.value) || IconVerified

    
    return( 
        <SettingElementLayout className={`${isLastElement ? '_lastElement' : ''}`} onClick={handleAction || null}>
            <IconContainer className={`${isCompleted ? 'isActive' : ''}`}>
                <IconSetting
                   color={isCompleted ? "var(--primary)" : "var(--paragraph_color)"} 
                   size={23}
                />
            </IconContainer>
                <SettingTitleCont>
                    <h3 className="fuente title__h3">{itemElement.uiName} &nbsp;</h3>
                    <IconVerified
                        size={16}
                        color={`${isCompleted ? "#219D6E" : "red" }`}
                    />
                    <UiStateCont className={`fuente ${isCompleted ? "verified" : "unverified" }`}>
                        {uiState}
                    </UiStateCont>
                </SettingTitleCont>
                <P 
                    text={itemElement.uiDescription} 
                    className="description__p fuente"
                />
                {/* <p className="fuente description__p">{itemElement.uiDescription}</p> */}
            {
                AuxComponent && 
                <RenderAuxComponent AuxComponent={AuxComponent} {...props} />
            }
        </SettingElementLayout>
    )
}

export default SettingElement