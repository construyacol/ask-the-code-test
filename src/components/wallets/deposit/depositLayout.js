import React, { Fragment } from 'react'
// import ItemSelectionContainer from '../../widgets/items/ItemSelectionContainer'
import { coins, payment_method } from '../../api/ui/api.json'
import ItemLayout from '../../widgets/items/itemLayout'
import { InputDepositForm } from '../../widgets/inputs'
import { SimpleLoader } from '../../widgets/loaders'
import { ButtonForms } from '../../widgets/buttons/buttons'
import { TransferFlow, CashFlow } from './flows'
import ItemWallet from '../../widgets/accountList/items'
import MethodView from '../../withdrawAccounts/new/views/1method'
import ViewAmountComponent from '../views/viewAmount'


const DepositLayout = (props) => {

  const {
     siguiente,
     type,
     currency,
     amount,
     deposit_way,
     deposit_service,
     service_mode,
     step,
     handleSubmit,
     buttonActive,
     select_currency,
     itemActive,
     short_currency_name,
     type_currency,
     primerDeposito,
     loader,
     updateAmountOnState,
     select_deposit_way,
     actualizarEstado,
     update_control_form,
     update_service_mode,
     create_deposit_order,
     finalizar,
     short_bank_name,
     update_local_state,
     handleKeyPress,
     statusInput,
     services,
     wallets_list,
     history,
     deposit,
     msgLoader,
     minAmount,
     coins,
     deposit_providers
  } = props


  const atributos ={
    icon:type_currency === 'fiat' ? short_currency_name : currency,
    size:80,
    // color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`,
  }

  return(
    <section className="DepositLayout">
    {
      (!short_currency_name && step === 1) &&
        <div className="DLstep">
            <p className="fuente DLtitle" >¿En que moneda deseas hacer el deposito?</p>

            <div className="ItemSelectionContainer2 ItemSelectionContainerMovil">
              <div className="containerItems">
                {
                  coins?
                  coins.map(item=>{
                    return <ItemLayout actualizarEstado={select_currency} actives={itemActive === item.name && true } {...item} key={item.id}/>
                  })
                  :
                  <div className="LoaderIt" ><SimpleLoader label="Obteniendo Activos"/></div>
                }
              </div>
            </div>
        <ButtonForms type="primary" active={buttonActive} siguiente={primerDeposito}>Continuar</ButtonForms>
      </div>
    }

    {
      (type_currency === 'crypto' && step === 1) &&
      // step === 1 &&
            <Fragment>
            {
              loader &&
                <SimpleLoader
                  label={msgLoader}
                />
            }
            </Fragment>
    }

    {
      // step === 1 && wallets_list.length>0 &&
      (type_currency === 'crypto' && step === 1 && wallets_list.length>0) &&
        <section className="DLwallet_list_container">
           <p className="DLtitle2">Elige la cuenta {currency} en la que deseas depositar:</p>
            <div className="DLwallet_list">
              {
                wallets_list.map(wallet=>{
                  return <ItemWallet
                    key={wallet.id}
                    deposit={deposit}
                    deposit_providers={deposit_providers}
                    // delete_wallet={this.delete_wallet_confirmation}
                    wallet={wallet}
                    walletDetail={deposit}
                    // history={this.props.history}
                   />
                })
              }
            </div>
        </section>
    }

    {
      (type_currency === 'fiat' && step === 1) &&
      <Fragment>
        {
          loader ?
          <SimpleLoader
            label="Accediendo a la cuenta"
          />
          :
          <ViewAmountComponent
            currency={currency}
            amount={amount}
            updateAmountOnState={updateAmountOnState}
            operation_type="deposit"
            handleSubmit={siguiente}
            />
        }
      </Fragment>
    }

    {
      (type_currency === 'fiat' && step === 2) &&

      <MethodView
        title="Utilizando la siguiente"
        subtitle="forma de pago"
        items={payment_method}
        select_method={select_deposit_way}
        item_active={deposit_way}
        siguiente={siguiente}
      />

    }

{/* ---------------------------------------------------------FLUJO TRANSFERENCIA BANCARIA.-------------------------------------------------------------------- */}

  {
        deposit_way === "bankaccount" &&
        // <p>HIJO DE PUTA</p>
        <TransferFlow
          {...props}
        />
  }


    {/* ---------------------------------------------------------FLUJO TARJETA DEBITO.-------------------------------------------------------------------- */}

    {
      (step === 3 && deposit_way === "debit") &&
        <div className="DLstep">
          <p>DEBITO PSE</p>
        </div>
    }

    {/* ---------------------------------------------------------FLUJO DINERO EN EFECTIVO.-------------------------------------------------------------------- */}


    {
          deposit_way === "cash" &&
          <CashFlow
            {...props}
          />
    }




    </section>
  )
}


export default DepositLayout
