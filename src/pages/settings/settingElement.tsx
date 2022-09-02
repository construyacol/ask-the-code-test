import { IoMailUnreadOutline } from 'react-icons/io5';
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { BsShieldLock } from 'react-icons/bs';
import { IoMdFingerPrint } from 'react-icons/io';
// import { VscVerified } from 'react-icons/vsc';

import { 
    SettingElementLayout,
    IconContainer,
    SettingContent,
    SettingTitleCont,
    UiStateCont
} from './styles'

import {
    settingType
} from './types'

import RenderAuxComponent from 'components/forms/widgets/renderAuxComponent'


const getIcon = (iconValue:string) => {
    const icons = {
        email:IoMailUnreadOutline,
        twofa:BsShieldLock,
        identity:IoMdFingerPrint
    }
    return icons[iconValue as keyof typeof icons]
}
const SettingElement = (props:settingType) => {
    const { 
        itemElement, 
        isCompleted, 
        isLastElement,
        AuxComponent
    } = props

    const IconVerified = isCompleted ? FiCheckCircle : FiAlertCircle;
    const uiState = isCompleted ? itemElement?.states?.uiEnabled : itemElement?.states?.uiDisabled;
    const IconSetting = getIcon(itemElement?.value) || IconVerified


    return( 
        <SettingElementLayout className={`${isLastElement ? '_lastElement' : ''}`}>
            <IconContainer className={`${isCompleted ? 'isActive' : ''}`}>
                <IconSetting
                   color={isCompleted ? "var(--primary)" : "var(--paragraph_color)"} 
                   size={23}
                />
            </IconContainer>
            <SettingContent>
                <SettingTitleCont>
                    <h3 className="fuente">{itemElement.uiName} &nbsp;</h3>
                    <IconVerified
                        size={16}
                        color={`${isCompleted ? "#219D6E" : "red" }`}
                    />
                    
                    <UiStateCont className={`fuente ${isCompleted ? "verified" : "unverified" }`}>
                        {uiState}
                    </UiStateCont>

                </SettingTitleCont>
                <p className="fuente">{itemElement.uiDescription}</p>
            </SettingContent>
            {
                AuxComponent && 
                <RenderAuxComponent AuxComponent={AuxComponent} {...props} />
            }
        </SettingElementLayout>
    )
}

export default SettingElement