import React, {Fragment} from 'react'
import './newAccount.css'
import { InputButton } from '../../widgets/buttons/buttons'
import { InputForm } from '../../widgets/inputs'
import DropDownContainer from '../../widgets/inputs/dropdownContainer'
import {ButtonForms} from '../../widgets/buttons/buttons'
import ItemSelectionContainer from '../../widgets/items/ItemSelectionContainer'
import ItemLayout from '../../widgets/items/itemLayout'
// import bank from '../../../assets/bank.png'
import SimpleLoader from '../../widgets/loaders'
import MethodView from './views/1method'
import { payment_method } from '../../api/ui/api.json'
import BankAccountFlow from './flows/bankAccountFlow'
import RemittanceAccountFlow from './flows/remittanceAccountFlow'
import FinalTicket from './views/finalTicket'

const WithdrawAccountFormLayout = props =>{

  const {
    siguiente,
    account_number,
    account_type,
    bank_name,
    step,
    loader,
    name,
    surname,
    select_withdraw_way,
    withdraw_way,
    ticket,
    finalizar,
    withdraw_flow,
    withdraw_flow_action
   } = props

  // console.log

  return(

    <div className="containerFormWallet">

      {
        step === 1 &&
        <Fragment>

          <MethodView
            title="En esta cuenta deseas"
            subtitle="efectuar los retiros por:"
            items={payment_method}
            select_method={select_withdraw_way}
            item_active={withdraw_way}
            siguiente={siguiente}
            withdraw={true}
          />

        </Fragment>
      }

      {
        (step >= 2 && withdraw_way === 'bankaccount') &&
        <BankAccountFlow
          {...props}
        />
      }

      {
        (step >= 2 && withdraw_way === 'cash') &&
        <RemittanceAccountFlow {...props}/>
      }



      {
        step === 7 &&
        <Fragment>
          {
            !ticket ?
            <SimpleLoader
                label={`Creando Cuenta de retiro`}
              />
              :
            <FinalTicket
                finishAction={finalizar}
                ticket={ticket}
                ticket_type="withdraw_form"
            />
          }
        </Fragment>

      }

    </div>
  )
}

export default WithdrawAccountFormLayout
