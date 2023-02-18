import {
    ALFilterSect,
    ALfiltros,
    ALif2Item
} from './styles'
import SelectList from '../selectList' 
import { P } from 'core/components/atoms'
import loadable from "@loadable/component";

const IconSwitch = loadable(() => import("components/widgets/icons/iconSwitch"));

const DropDownList = ({ 
    refEl, 
    className, 
    handleAction = () => null, 
    options, 
    defaultOption, 
    title, 
    MainIcon 
}) => (
    <ALFilterSect ref={refEl} className={`${className}`}>
        <ALfiltros className="ALfiltros fuente">
            <ALif2Item>
                {
                    MainIcon &&
                    typeof MainIcon === 'function' ?
                        <MainIcon size={16} color="red" />
                        :
                        <IconSwitch
                            icon={MainIcon}
                            size={16}
                            color="var(--paragraph_color)"
                        />
                }
                <P className="fuente">{title}</P>
            </ALif2Item>
            <SelectList
                actionHandle={handleAction}
                list={options}
                selectedItem={defaultOption}
            />
        </ALfiltros>
    </ALFilterSect>
)

export default DropDownList