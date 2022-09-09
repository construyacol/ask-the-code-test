import { SettingsLayout } from 'components/widgets/layoutStyles'
import TitleSection from 'components/widgets/titleSectionComponent'
import { 
    ContentLayout, 
    SecurityLayout
} from './styles'
import { SettingsMenuComponent } from './'
import { SettingElementSkeleton } from './settingElement' 


const SettingSkeleton = () => {

    const loaderList = new Array(2).fill({});

    return(
        <SettingsLayout>
            <TitleSection skeleton/>
            <ContentLayout>
                <SettingsMenuComponent
                    skeleton
                />
                <SecurityLayout>
                    {
                        loaderList.map((_, key) => {
                            return <SettingElementSkeleton/>
                        })
                    }
                </SecurityLayout>
            </ContentLayout>
        </SettingsLayout>
    )
}


export default SettingSkeleton