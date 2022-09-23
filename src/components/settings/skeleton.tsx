import { SettingsLayout } from 'components/widgets/layoutStyles'
import TitleSection from 'components/widgets/titleSectionComponent'
import { 
    ContentLayout, 
    SecurityLayout
} from 'components/settings/styles'
import SideMenuComponent from 'components/settings/SideMenu'
import { SettingElementSkeleton } from 'components/settings/settingElement' 


const SettingSkeleton = () => {

    const loaderList = new Array(2).fill({});

    return(
        <SettingsLayout>
            <TitleSection skeleton/>
            <ContentLayout>
                <SideMenuComponent
                    skeleton
                />
                <SecurityLayout>
                    {
                        loaderList.map((_, key) => {
                            return <SettingElementSkeleton key={key}/>
                        })
                    }
                </SecurityLayout>
            </ContentLayout>
        </SettingsLayout>
    )
}


export default SettingSkeleton