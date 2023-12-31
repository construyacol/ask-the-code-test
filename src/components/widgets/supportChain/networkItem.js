import { NetworkItemCont } from './styles'  
import IconSwitch from 'components/widgets/icons/iconSwitch'
import { P, SPAN } from 'core/components/atoms'
import { parseSymbolCurrency } from 'core/config/currencies';


const NetworkItem = ({ networkData }) => {
    const { user_friendly, provider_type, uiName, icon } =  networkData
    const providerType = parseSymbolCurrency(provider_type)
    return(
        <NetworkItemCont>
            <IconSwitch
                icon={icon || provider_type}
                size={17}
                color="var(--primary)"
            />
            <P>
                {uiName || providerType}
                <SPAN className="number">
                    ({user_friendly?.token_protocol || user_friendly?.network})
                </SPAN>
            </P>
        </NetworkItemCont>
    )
}

export default NetworkItem

