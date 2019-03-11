// import user_source from '../components/api'
import { normalize, schema } from 'normalizr'
import { connect } from 'react-redux'
// const hola = this.props.user
// const paymentMethod = new schema.Entity('payment_methods',{},{processStrategy: (value, parent, key) => ({ ...value, user_id:parent.id})}); //el proccessStrategy es opcional, lo utilice en modo ilustrativo para heredar el id del padre(user) a cada elemento

const do_normalization = (data_source, data_to_normalize)=>{
// Parametro 1: fuente de datos, Parametro 2: Schema de datos a normalizar con la fuente
  const normalized_data = normalize(data_source, data_to_normalize)
  return normalized_data
}

export const normalize_user = async(user) => {

  const balance = new schema.Entity('balances',{})
  const deposit = new schema.Entity('deposits',{})
  const withdraw = new schema.Entity('withdrawals',{})
  const withdraw_account = new schema.Entity('withdraw_accounts',{})
  const withdraw_provider = new schema.Entity('withdraw_providers',{})
  const pair = new schema.Entity('all_pairs',{})
  const swap = new schema.Entity('swaps',{})
  const deposit_prov = new schema.Entity('deposit_providers', {})

  const wallet = new schema.Entity('wallets', {
    dep_prov:[deposit_prov]
  }, {processStrategy:(value, parent, key) => ({...value, userId:parent.id})});

  const normalizedUser = new schema.Entity('user', {
    wallets:[wallet],
    deposit_providers:[deposit_prov],
    deposits:[deposit],
    swaps:[swap],
    withdraw_accounts:[withdraw_account],
    withdraw_providers:[withdraw_provider],
    available_pairs:[pair],
    withdrawals:[withdraw],
    balances:[balance]
  })

  return await do_normalization(user, normalizedUser)

}


export default normalize_user
