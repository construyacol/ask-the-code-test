import TitleSection from 'components/widgets/titleSectionComponent'
import { SettingsLayout } from 'components/widgets/layoutStyles'
// import IconSwitch from 'components/widgets/icons/iconSwitch'
import { settingsMenu } from 'api/ui/menuItems'
import { 
    ContentLayout, 
    SettingsMenuContainer, 
    ItemMenu,
    SettingsContent
} from './styles'
import { IoMdFingerPrint } from 'react-icons/io';

import { BsShieldLock } from 'react-icons/bs';
import { useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// Sub Dependences
import loadable from "@loadable/component";
import { getIdentityState } from 'utils'
import useViewport from 'hooks/useWindowSize'
    

type params = { settings_path?:string }
// type Icons = { identity:any, security:any }


const SettingsComponent = () => { 

    let history = useHistory();
    let { settings_path }:params = useParams();
    const { isMovilViewport } = useViewport();

    const { user  } = useSelector(({ modelData }:any) => modelData);
    const identityState = getIdentityState(user?.identity)

    const redirects = () => {
        if(isMovilViewport)return;
        if(!settings_path && !["accepted"].includes(identityState)) history.push("/settings/kyc");
        else if(!settings_path) history.push("/settings/security");
    }

    useEffect(() => {

        redirects()

        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings_path])

    return(
        <SettingsLayout>
            <TitleSection
                titleKey="Ajustes  > "
                subTitle={settingsMenu[settings_path as keyof typeof settingsMenu]?.uiName}
            />
            <ContentLayout>
                <SettingsMenuComponent
                    currentSection={settings_path}
                />
                <ContentSection 
                    currentSection={settings_path}
                />
            </ContentLayout>
        </SettingsLayout>
    )
} 

export default SettingsComponent


type contentSection = { 
    currentSection?:string,
}

const ContentSection = ({ currentSection }:contentSection) => {
    return(
        <RenderComponent
            currentSection={currentSection}
        />
    )
}


const KycView = loadable(() => import(/* webpackPrefetch: true */ "pages/settings/kycView"), { fallback: <div>Cargando kyc...</div> });
const SecurityView = loadable(() => import(/* webpackPrefetch: true */ "pages/settings/securityView"), { fallback: <div>Cargando Security...</div> });


const RenderComponent = (props:any) => {
    const { currentSection } = props
    let View = currentSection as Element
    const Views = {
      kyc: <KycView {...props} />, 
      security: <SecurityView {...props} />
    };
    return Views[View] || <div>No hay vista disponible</div>;
};


const getIcon = (iconValue:string) => {
    const icons = {
        security:BsShieldLock,
        kyc:IoMdFingerPrint
    }
    return icons[iconValue as keyof typeof icons]
}

export const SettingsMenuComponent = (props:any) => {

    const { 
        currentSection,
        skeleton
    } = props

    return(
        <SettingsMenuContainer> 
            <SettingsContent className={`${skeleton ? "skeleton" : ""}`}>
                {
                    Object.keys(settingsMenu).map((itemKey, index) => {

                        const itemMenu = settingsMenu[itemKey as keyof typeof settingsMenu]
                        const Icon = getIcon(itemKey)
                        const isSelected = currentSection === itemKey
                        const iconSize = ["kyc"].includes(itemKey) ? 20 : 18 

                        return(
                            <ItemMenu 
                                key={index} 
                                className={`${isSelected ? 'selected' : ''}`}
                                to={`/settings/${itemKey}`}
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
                            </ItemMenu>
                        )
                    })
                }
            </SettingsContent>
        </SettingsMenuContainer>
    )
}



// settingsMenu