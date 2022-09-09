import { FiCheckCircle } from "react-icons/fi";
import { 
    BenefitsContainer,
    ItemBenefit,
} from './styles'


const BenefitsComponent = () => {
    const IconVerified = FiCheckCircle;
    return(
        <BenefitsContainer>
            <h4 className="fuente">
                Beneficios actuales
            </h4>
            <ul>
                <ItemBenefit>
                    <IconVerified
                        size={18}
                        color="var(--green_color)"
                    />
                    <p className="fuente">Operaciones superiores a 40 millones</p>
                </ItemBenefit>
                <ItemBenefit>
                    <IconVerified
                        size={18}
                        color="var(--green_color)"
                    />
                    <p className="fuente">Operaciones superiores a 40 millones</p>
                </ItemBenefit>
            </ul>

        </BenefitsContainer>
    )
}

export default BenefitsComponent