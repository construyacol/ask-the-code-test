import MaskedInput from "react-text-mask";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
const autoCorrectedDatePipe = createAutoCorrectedDatePipe("dd/mm/yyyy", {
  minYear:1900,
  maxYear:new Date().getFullYear() - 18
});

const MaskDateComponent = (props) => {

    return(
        <MaskedInput
            mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/,]}
            placeholder="Día / Mes / año"
            id="birthdayMaskedInput"
            guide={true}
            autoFocus={true}
            pipe={autoCorrectedDatePipe}
            {...props}
            type="tel"
        />
    )

}

export default MaskDateComponent