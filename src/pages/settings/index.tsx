import TitleSection from 'components/widgets/titleSectionComponent'
import { SettingsLayout } from 'components/widgets/layoutStyles'
// import IconSwitch from 'components/widgets/icons/iconSwitch'
import { settingsMenu } from 'api/ui/menuItems'
import { 
    ContentLayout, 
} from 'components/settings/styles'

import { useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import loadable from "@loadable/component";
import { getIdentityState } from 'utils'
import useViewport from 'hooks/useWindowSize'
import RenderSwitchComponent from 'components/renderSwitchComponent'
import SideMenuComponent from 'components/settings/SideMenu'

type params = { settings_path?:string }

const KycView = loadable(() => import(/* webpackPrefetch: true */ "components/settings/kycView"), { fallback: <div>Cargando kyc...</div> });
const SecurityView = loadable(() => import(/* webpackPrefetch: true */ "components/settings/securityView"), { fallback: <div>Cargando Security...</div> });
// const ReferralView = loadable(() => import(/* webpackPrefetch: true */ "components/referrals"), { fallback: <div>Cargando Security...</div> });

const STAGE_COMPONENTS = {
    kyc:KycView,
    security:SecurityView,
    // referral:ReferralView
}

const SettingsComponent = () => { 

    let history = useHistory();
    let { settings_path }:params = useParams();
    const { isMovilViewport } = useViewport();
    const { user  } = useSelector(({ modelData }:any) => modelData);
    const identityState = getIdentityState(user?.identity)

    const redirects = () => {
        if(isMovilViewport)return;
        if(!settings_path && !["accepted"].includes(identityState)) history.push("/settings/kyc");
        else if(!settings_path) history.push("/settings/kyc");
    }

    useEffect(() => {
        redirects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings_path])

    return( 
        <SettingsLayout> 
            <TitleSection
                className='sticky'
                titleKey={`${(isMovilViewport && !settings_path) ? "Ajustes" : (isMovilViewport && settings_path) ? "" : "Ajustes  > "}`}
                subTitle={settingsMenu[settings_path as keyof typeof settingsMenu]?.uiName}
            />
            <ContentLayout>
                <SideMenuComponent
                    currentSection={settings_path}
                    isMovilViewport={isMovilViewport}
                    identityState={identityState}
                />
                <RenderSwitchComponent 
                    STAGE_COMPONENTS={STAGE_COMPONENTS}
                    component={settings_path}
                    currentSection={settings_path}
                />
            </ContentLayout>
        </SettingsLayout>
    )
} 

export default SettingsComponent

