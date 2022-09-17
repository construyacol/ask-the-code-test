import TitleSection from 'components/widgets/titleSectionComponent'
import { SettingsLayout } from 'components/widgets/layoutStyles'
// import IconSwitch from 'components/widgets/icons/iconSwitch'
import { 
    ContentLayout, 
} from 'components/settings/styles'

// import { useEffect } from 'react';
// import { useHistory, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";

import loadable from "@loadable/component";
// import { getIdentityState } from 'utils'
// import useViewport from 'hooks/useWindowSize'
import RenderSwitchComponent from 'components/renderSwitchComponent'

// import { settingsMenu } from 'api/ui/menuItems'
// import SideMenuComponent from 'components/settings/SideMenu'

// type params = { rewards_path?:string }

// const KycView = loadable(() => import(/* webpackPrefetch: true */ "components/settings/kycView"), { fallback: <div>Cargando kyc...</div> });
// const SecurityView = loadable(() => import(/* webpackPrefetch: true */ "components/settings/securityView"), { fallback: <div>Cargando Security...</div> });
const ReferralView = loadable(() => import(/* webpackPrefetch: true */ "components/referrals"), { fallback: <div>Cargando Security...</div> });

const STAGE_COMPONENTS = {
    // kyc:KycView,
    // security:SecurityView,
    referral:ReferralView
}

const SettingsComponent = () => { 

    // let history = useHistory();
    // let { rewards_path }:params = useParams();
    // const { isMovilViewport } = useViewport();
    // const { user  } = useSelector(({ modelData }:any) => modelData);
    // const identityState = getIdentityState(user?.identity)
    // const SECONDARY_PATH = rewards_path
    const SECONDARY_PATH = "referral"

    // const redirects = () => {
    //     history.push("/rewards/referral")
    // }

    // useEffect(() => {
    //     redirects()
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [SECONDARY_PATH])

    return( 
        <SettingsLayout> 
            <TitleSection
                className='sticky main'
                titleKey={`Referidos`}
                // titleKey={`${(isMovilViewport && !SECONDARY_PATH) ? "Ajustes" : (isMovilViewport && SECONDARY_PATH) ? "" : "Ajustes  > "}`}
                // subTitle={settingsMenu[SECONDARY_PATH as keyof typeof settingsMenu]?.uiName}
            />
            <ContentLayout className="one-column">
                {/* <SideMenuComponent
                    currentSection={SECONDARY_PATH}
                    isMovilViewport={isMovilViewport}
                    identityState={identityState}
                    BASE_URL="rewards"
                /> */}
                <RenderSwitchComponent 
                    STAGE_COMPONENTS={STAGE_COMPONENTS}
                    component={SECONDARY_PATH}
                    currentSection={SECONDARY_PATH}
                />
            </ContentLayout>
        </SettingsLayout>
    )
} 

export default SettingsComponent

