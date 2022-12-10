
import { Label, Input } from "components/atoms"
import { OptionInputProps } from 'interfaces/components/atoms/inputProps'

function OptionInput ({ uiName, color, size, ...props }:OptionInputProps) {
    return(
        <Label 
            color={color}
            size={size}
        >
            <Input {...props}/>
            {uiName}
        </Label>
    )
}

export default OptionInput;