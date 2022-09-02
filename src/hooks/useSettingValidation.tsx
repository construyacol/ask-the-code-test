import { useSelector } from "react-redux";
import { useActions } from "hooks/useActions";


export const useSettingValidation = () => {

    const { user } = useSelector((state:any) => state?.modelData);

    const email = ():boolean => {
        return true
    }

    const twofa = ():boolean => {
        if(user?.security_center?.transactionSecurity["2fa"]?.enabled) return true;
        return false
    }

    const identity = ():boolean => {
        // if(user?.security_center?.transactionSecurity["2fa"]?.enabled) return true;
        return false
    }

    return {
        email,
        twofa,
        identity
    }

}


export const useSettingsActions = () => {

    const { user } = useSelector((state:any) => state?.modelData);
    const actions = useActions();

    const twofa = async() => {

        if(user?.security_center?.transactionSecurity["2fa"]?.enabled){
            await actions.current_section_params({
                settings: {
                  title: "Deshabilitando segundo factor",
                  description: `Desactivarás la segunda capa de seguridad en todos los servicios activos.`,
                  txtPrimary: "Desactivar",
                  txtSecondary: "Cancelar",
                  authenticator: user.security_center?.authenticator,
                  code: "2auth",
                //   other_state,
                },
              });
              return actions.toggleOtherModal();
        }

        const Element = await import(`components/widgets/twoFactorActivate/2fa`)
        const TwoFactorActivate = Element.default
        // eslint-disable-next-line react/jsx-pascal-case
        actions.renderModal(() => <TwoFactorActivate/>)
    }

    return {
        twofa 
    }

}
