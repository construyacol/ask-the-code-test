import { FiCheckCircle } from "react-icons/fi";
import { 
    BenefitsContainer,
    ItemBenefit,
} from './styles'

type props = {
    user:object
}

const BenefitsComponent = ({ user }:props) => {
    
    const IconVerified = FiCheckCircle;
    return(
        <BenefitsContainer>
            <h4 className="fuente">
                Beneficios actuales
                <span className="fuente2">[Nivel 1]</span>
            </h4>
            <ul>
                <ItemBenefit>
                    <IconVerified
                        size={18}
                        color="var(--green_color)"
                    />
                    <p className="fuente">Depósitos e intercambios habilitados</p>
                </ItemBenefit>
                <ItemBenefit>
                    <IconVerified
                        size={18}
                        color="var(--green_color)"
                    />
                    <p className="fuente">Operaciones de hasta 49 millones por mes</p>
                </ItemBenefit>
            </ul>

        </BenefitsContainer>
    )
}

export default BenefitsComponent