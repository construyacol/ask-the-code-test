
import ControlButton from "components/widgets/buttons/controlButton";
import useKeyActionAsClick from "hooks/useKeyActionAsClick";
import { useCoinsendaServices } from "services/useCoinsendaServices";
import { DepositForm } from './styles'
import IconSwitch from "../../../widgets/icons/iconSwitch";
import { useWalletInfo } from 'hooks/useWalletInfo'

const AddDepositProviderCripto = () => {

  const { currentWallet } = useWalletInfo();
  const [
    coinsendaServices,
    {
      isLoading: { loader },
    },
    { isAppLoading },
    dispatch,
  ] = useCoinsendaServices();

  const idForMainButton = useKeyActionAsClick(true, "main-button-deposit", 13, true);
  const movil_viewport = window.innerWidth < 768;

  const atributos = {
    icon: "deposit_crypto",
    size: movil_viewport ? 80 : 100,
    color: "var(--paragraph_color)",
  };

  const createDepositProvider = async (e) => {
    e.preventDefault();
    dispatch(isAppLoading(true));
    await coinsendaServices.createAndInsertDepositProvider(currentWallet);
    dispatch(isAppLoading(false));
  };

  return (
    <DepositForm className="depositView">
      <div className="contIcontSwitch">
        <IconSwitch {...atributos} />
      </div>

      <p className="fuente">
        Esta Billetera aún no tiene dirección de depósito, creala ahora e inicia
        operaciones con esta cuenta.
      </p>

      <div className="contButtons deposit">
        <ControlButton
          id={idForMainButton}
          handleAction={createDepositProvider}
          loader={loader}
          formValidate
          label="Crear dirección de depósito"
        />
      </div>
    </DepositForm>
  );
};

  export default AddDepositProviderCripto