import InputForm from "../../../widgets/inputs/inputForm";
import {
  ListContainer,
  Option,
  Title
} from './styles'



const WalletSkeleton = props => {

  return(
      <>
          <Title className="fuente skeleton">Crea una billetera</Title>
          <InputForm skeleton />
          <ListContainer className="skeleton">
              <Option/>
              <Option/>
        </ListContainer>
      </>
  )

}

export default WalletSkeleton
