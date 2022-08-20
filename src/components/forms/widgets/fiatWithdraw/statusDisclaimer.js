import { useState } from 'react'
import styled from 'styled-components'
// import { useSelector } from "react-redux";
// import { selectWithdrawProvidersByName } from 'selectors'
import useViewport from "hooks/useWindowSize";



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

    console.log('withdrawAccount', withdrawAccount)
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


const Disclaimer = styled.div`

  padding: 7px 15px;
  height:auto;
  min-height:80px;
  border-radius:6px;
  display:none;

  .disclaimer--message_p{
    margin: 10px 0 0;
    height: 50px;
    overflow: hidden;
    position:relative;
    &.disclaimer__open{
        height: auto;
    }
    &.disclaimer--showGradient{
        &::after{
            content:"";
            position:absolute;
            width:100%;
            height: 50px;
            bottom:0;
            left: 0;
            pointer-events:none;
        }
    }
    &.pending,
    &.in_progress{
        &::after{
            background: linear-gradient(0deg, #f5e6ca 0%, transparent 75%);
        }
    }
    &.complete{
        &::after{
            background: linear-gradient(0deg, #e5ede5 0%, transparent 75%);
        }
    }
  }

  p{
    font-size: 13px;
    line-height:17px;
  }

  

  &.pending,
  &.in_progress{
    background:#f5e6ca;
    display:initial;
    .disclaimer--message_p{
      color: #8f5d00;
    }
  }

  &.complete{
    background:#e5ede5;
    display:initial;
    .disclaimer--message_p{
        color: green;
    }
  }

  .verMas__p{
    margin: 12px 0 0;
    line-height: 14px;
    text-align: center;
    cursor: pointer;
    color: var(--title1);
  }


  &.fullDisclaimer{
    padding:20px;
    max-width:calc(700px - 40px);
    align-self:end;
    .disclaimer--message_p{
      font-size: 14px;
      line-height:22px;
    }
  }

`







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