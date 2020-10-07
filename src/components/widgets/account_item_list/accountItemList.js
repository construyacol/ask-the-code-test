import React, { useEffect, useState } from 'react'
import IconSwitch from '../icons/iconSwitch'
import ActiveItem from '../items/active_item'
import LimitTermometer from '../limitTermometer/limitTermometer'
import { number_format, mensaje } from '../../../utils'

import './account_item.css'
import { InputKeyActionHandler } from '../accountList/styles'
import { useItemsInteractions } from '../../../hooks/useNavigationKeyActions'

function AccountItemList(props) {
  const [amountCharge,] = useState(0)
  const [preferencialAcc, setPreferencialAcc] = useState(null)

  useEffect(() => {
    init()
  }, [props])

  const init = () => {
    const {
      preferential_accounts,
      account
    } = props

    if (!preferential_accounts) { return false }

    let matches = preferential_accounts.find(pa => { return pa === account.id })
    setPreferencialAcc(matches)
  }

  const createOrder = () => {
    const {
      account,
      amount
    } = props

    const {
      provider_max_amount
    } = account

    let limit = (amount * 100) / provider_max_amount
    let limit_supered = ((amount * 100) / provider_max_amount) > 100
    let state_data = {
      withdraw_provider: account.withdraw_provider,
      withdraw_account: account.id
    }

    props.new_withdraw_order(state_data, limit, limit_supered)
  }

  const showRequireActionMessage = () => {
    return mensaje('Fondos insuficientes', 'error')
  }
  
  const {
    account,
    addElement,
    action,
    amount
  } = props

  const handleClick = action ? action : createOrder
  const [isSelected] = useItemsInteractions(props, { suprKeyAction: () => false, enterKeyAction: handleClick }, false)

  let currency_type = props.account && props.account.currency_type

  const atributos = {
    icon: addElement ? 'add_account' : (account && account.bank_name.value),
    size: 50,
    color: "gray"
    // color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`,
    // viewBox:{`${viewBox ? viewBox : '0 0 512 512' }`},
    // clases:"marginLef"
  }

  let preferential_account = !addElement ? (preferencialAcc === account.id ? 'preferential' : false) : false

  let withdraw_amount = parseFloat(amount)
  let withdraw_min_amount

  if (account && (account.cost && account.provider_min_amount)) {
    withdraw_min_amount = parseFloat(account.cost) + parseFloat(account.provider_min_amount)
  }

  let need_more_amount = withdraw_amount < withdraw_min_amount ? 'need_more' : withdraw_amount >= withdraw_min_amount && 'satisfy'

  return (
    <div
      onClick={need_more_amount === 'need_more' ? showRequireActionMessage : handleClick}
      className={`AccountItemList ${isSelected && 'item-selected'} ${preferential_account} ${addElement ? 'addElement' : 'noAddElement'} ${need_more_amount}`} >
      <div className={`backgroundAccount ${need_more_amount}`}>
      <InputKeyActionHandler name="itemFromList" autoComplete="off" id={props.focusedId} />
      </div>

      <div className={`limitComp ${need_more_amount}`} style={{ display: addElement ? 'none' : 'block' }}>
        <LimitTermometer
          amount={amountCharge}
          max_amount={7}
          limit={addElement ? null : account.percent}
          orders={addElement ? null : account.orders}
        />
      </div>

      <div className="contLogoAIL">
        <div className={`logoAIL ${addElement ? 'addElement' : 'noAddElement'} ${need_more_amount}`}>
          <div className={`backLogoAil ${currency_type} ${need_more_amount}`}></div>
          <IconSwitch
            {...atributos}
          />
        </div>
      </div>

      {
        !addElement ?
          <>
            <div className="infoAIL">
              <div className={`infoAILItem ${preferential_account} ${need_more_amount}`}>
                {
                  preferential_account &&
                  <IconSwitch icon={preferential_account && preferential_account}
                    size={18}
                  // color="#38ef7d"
                  />
                }
                <p className={`infoAILItem name ${preferential_account} ${need_more_amount}`}>
                  {account.bank_name.ui_name}
                  {account.cost ? <span className={`costStyle fuente2  ${need_more_amount}`}>| ~${number_format(account.cost)}</span> : ''
                  }
                </p>
              </div>

              <p className={`infoAILItem account_type ${need_more_amount}`}>
                {
                  need_more_amount === 'need_more' ?
                    'Fondos insuficientes' :
                    account.account_type.ui_name
                }
              </p>

              <div className="AILAnumber">
                <IconSwitch
                  icon="root"
                  size={16}
                  color="#5999f1"
                />
                <span className={`infoAILItem account_number fuente2 ${need_more_amount}`}>
                  {
                    need_more_amount === 'need_more' ?
                      `Cantidad minima: $${number_format(withdraw_min_amount)}` :
                      `No.: ${account.account_number.value}`
                  }
                </span>
              </div>
            </div>

            <div className={`optionsALI ${preferencialAcc} ${need_more_amount}`}>
              {/* <p style={{color:account.inscribed ? 'green' : 'red'}}>{account.inscribed ? 'Inscrita' : 'NoInscrita'}</p> */}
              {/* <p style={{color:account.visible ? 'green' : 'red'}}>{account.visible ? 'Visible' : 'InVisible'}</p> */}
              {/* <p>{account.limit ? 'Limite Alcanzado' : 'soportado'} {account.provider_max_amount}</p> */}

              <div className="controlDespegable">
                <div className={`forroDesp ${need_more_amount}`}>
                  <div className="contDesp">
                    <IconSwitch
                      icon="arrow_right"
                      size={25}
                      color={`${need_more_amount === 'need_more' ? '#d42215' : '#38ef7d'}`}
                    />
                  </div>
                </div>
                <div className="contActiveItem">
                  <ActiveItem Anim2={true} color={`${need_more_amount === 'need_more' ? 'red' : 'green'}`} />
                </div>
              </div>
            </div>
          </>
          :
          <>
            <p className="AILadd fuente">Añadir nueva cuenta de retiro</p>
            <div className="poisonEve">
              <IconSwitch
                icon="withdraw2"
                size={60}
                color="gray"
              />
            </div>
          </>
      }
    </div>
  )

}

export default AccountItemList
