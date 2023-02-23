import { useState } from 'react'
// import styled from 'styled-components'
// import { useSelector } from "react-redux";
// import { selectWithdrawProvidersByName } from 'selectors'
import useViewport from "hooks/useWindowSize";
import { Disclaimer } from '../sharedStyles'


const StatusDisclaimer = ({ withdrawAccount, className, withdrawProviders }) => {

    const { state } = withdrawAccount
    const { isMovilViewport } = useViewport();
    const [ viewMore, setViewMore ] = useState(isMovilViewport ? false : true)
    // const [ withdrawProviders ] = useSelector((state) => selectWithdrawProvidersByName(state));
    const isAvalaibleSameProvider = withdrawProviders[withdrawAccount?.bank_name?.value]
  
    const withdrawTimeMessage = isAvalaibleSameProvider ? 
    'Tu dinero tardará apróximadamente entre 60 y 180 minutos en verse reflejado en tu cuenta bancaria una vez que el retiro sea aceptado.' : 
    'Tu dinero tardará hasta el siguiente día bancario hábil en verse reflejado en tu cuenta bancaria una vez que el retiro sea aceptado, debido a que es una transacción ACH. '
    const inProgress = `El proceso de inscripción de tu cuenta ${withdrawAccount?.bank_name?.ui_name} tomará apróximadamente 2 horas en horario bancario hábil, cuando tu cuenta esté inscrita ${withdrawTimeMessage}`
    const complete = ["efecty_network"].includes(withdrawAccount?.provider_type, withdrawAccount) ? 
    'Los retiros realizados en horario hábil, podrán reclamarse  3 horas después en cualquier punto Efecty habilitado del país, los que sean realizados por fuera de este horario, podrán reclamarse al siguiente día hábil después de las 10:00 AM.' :
    withdrawTimeMessage

    const MESSAGES = {
        pending:inProgress,
        in_progress:inProgress,
        complete
    }

    // console.log('withdrawAccount', withdrawAccount)
    // disclaimer--message_p element => scrollHeigth

    return(
      <Disclaimer className={`${state} ${className}`}>
        {
          MESSAGES[state] &&
          <p className={`fuente disclaimer--message_p ${state} ${viewMore ? 'disclaimer__open' : ''} ${(state !== 'complete' && !viewMore) ? 'disclaimer--showGradient' : 'disclaimer__open'} `}>{MESSAGES[state]}</p>
        }
        {
            (state !== 'complete' && isMovilViewport) &&
                <p className='fuente2 verMas__p' onClick={() => setViewMore(prevState => !prevState)}>{viewMore ? 'Ver menos' : 'Ver más...'} </p>
        }
      </Disclaimer>
    )
}
  


export default StatusDisclaimer









// const selectWithdrawAccount = createSelector(
//   (state) => state.modelData.withdrawProviders,
//   (_, withdrawAccount) => withdrawAccount,
//   (withdrawProviders, withdrawAccount) => {
//     if(!withdrawAccount)return ;
//     console.log('withdrawProviders', withdrawProviders)
//     console.log('withdrawAccount ===> ', withdrawAccount)
//     // debugger
//     // if(!withdrawProviders)return ; 
//     // const withdrawProvider = withdrawProviders[withdrawProvId]
//     // return [ withdrawProvider ];
//   }
// );