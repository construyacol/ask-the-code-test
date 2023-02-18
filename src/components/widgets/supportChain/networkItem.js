import { NetworkItemCont } from './styles'  
import IconSwitch from 'components/widgets/icons/iconSwitch'
import { P, SPAN } from 'core/components/atoms'


const NetworkItem = ({ networkData }) => {
    const { user_friendly, provider_type } =  networkData
    return(
        <NetworkItemCont>
            <IconSwitch
                icon={provider_type}
                size={16}
            />
            <P>
                {provider_type}
                <SPAN className="number">
                    ({user_friendly?.token_protocol || user_friendly?.network})
                </SPAN>
            </P>
        </NetworkItemCont>
    )
}

export default NetworkItem