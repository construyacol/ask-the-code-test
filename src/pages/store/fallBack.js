import { FallBackContainer, FallBackLayout } from './styles'
import { P } from 'core/components/atoms'
import shopImg from 'assets/tempIcons/shop.gif'

export default function BitRefillFallBack(){

    return(
        <FallBackLayout>
            <FallBackContainer>
                <P >Estamos cargando la tienda...</P>
                <img alt="Tienda" src={shopImg} width="80px" ></img>
                <P className="poweredBy__p bold">Powered by Bitrefill</P>
            </FallBackContainer>
        </FallBackLayout>
    )

}