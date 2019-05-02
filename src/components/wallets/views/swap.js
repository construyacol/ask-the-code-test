import React, { Fragment, Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../../widgets/loaders'
import { InputForm, InputFormCoin, ReadReceiveCoin } from '../../widgets/inputs'
import { ButtonForms } from '../../widgets/buttons/buttons'
import { matchItem, number_format, mensaje } from '../../../services'
import convertCurrencies from '../../../services/convert_currency'

import { BigNumber } from "bignumber.js"

class SwapView extends Component{

  state = {
    value:"",
    address:null,
    loader:false,
    active:false,
    pair_id:null,
    total_value:null
  }

  componentDidMount(){
    this.init_state()
  }



  init_state = async() => {
    await this.props.initial(this.props.match.params.path, this.props.match.params.id)
    this.getOtherPairs(true)
    const { current_wallet, local_currency, current_pair } = this.props
    this.props.action.get_pair_default(current_wallet, local_currency, current_pair)
    // console.log('||||||||||||||||||||||| CURRENT BY init_state', res)
  }

  actualizarEstado_coin = (e) =>{

    let value = e.target.value
    let { available } = this.props

    this.setState({
      value:value,
      active: ((parseFloat(value) <= parseFloat(available))) ? true : false
    })
  }

  actualizarEstado = (e) =>{
    this.setState({
      address:e.target.value
    })
  }

  getTotalValue = total_value =>{
    if(!total_value){return false}
    this.setState(total_value)
  }

  getMaxAvailable = e =>{
    let value = e.target.id
    let { available } = this.props

    this.setState({
      value:value,
      active:parseFloat(value) <= parseFloat(available) ? true : false
    })
  }



  handleError = msg =>{
    mensaje(msg, 'error')
  }




  finish_swap = async(p) =>{

    this.props.action.Loader(true)
    await this.props.action.get_swap_list(this.props.user, this.props.wallets, this.props.all_pairs)
    await this.props.action.current_section_params({currentFilter:'swaps'})

    const {
      value,
    } = this.state

    const{
      current_wallet,
      swaps,
      user,
      current_pair
    } = this.props

    const { secondary_coin, pair_id } = current_pair
    let total_value = await this.get_total_value(value)

    // console.log
    let new_swap = await this.props.action.add_new_swap(current_wallet.id, pair_id, value)
    this.props.action.Loader(false)

    if(!new_swap){
      return this.handleError('No se ha podio hacer el cambio')
    }

    const {
      swap_info,
      unique_id
    } = new_swap

    let add_swap = {
      account_id: swap_info.account_from_id,
      account_to: "",
      action_price: "",
      amount: total_value.toString(),
      amount_neto: "",
      bought: total_value.toString(),
      comment: "",
      currency: current_wallet.currency,
      currency_bought: secondary_coin,
      currency_type: current_wallet.currency_type,
      deposit_cost: "",
      deposit_provider_id: "",
      expiration_date:new Date(),
      id:unique_id,
      unique_id:unique_id,
      spent: swap_info.want_to_spend,
      state: "pending",
      type_order: "swap"
    }

    await this.props.action.add_order_to('swaps', swaps, user, add_swap)

    await this.props.action.add_new_transaction_animation()

    this.props.history.push(`/wallets/activity/${current_wallet.id}`)

  }


  get_total_value = async value =>{
    const {
      current_wallet,
      current_pair
    } = this.props
    const { pair_id } = current_pair
    // console.log('|||||||||  current_pair', current_pair)
    let total_value = await convertCurrencies(current_wallet.currency, value, pair_id)
    // console.log('|||||||||  total_value', total_value)
    if(!total_value){return false}
    return total_value.want_to_spend
  }


  swap = async() =>{

    const {
      value
    } = this.state

    const {
      current_wallet,
      current_pair
    } = this.props

    const { secondary_coin, secondary_value, pair_id } = current_pair

    let total_value = await this.get_total_value(value)


    this.props.action.ConfirmationModalToggle()
    this.props.action.ConfirmationModalPayload({
      title:"Esto es importante, estas a punto de...",
      description:`Gastar la cantidad de ${value} ${current_wallet.currency.currency} para adquirir ${total_value} ${secondary_coin}`,
      txtPrimary:"Confirmar Intercambio",
      txtSecondary:"Cancelar",
      payload:'aa',
      action:(this.finish_swap),
      img:"swap",
      type:"swap",
      from:current_wallet.currency.currency,
      to:secondary_coin,
      spent:value,
      bought:total_value
    })
  }

  getOtherPairs = async(initial) => {

    const { local_pairs, current_wallet, short_name, local_currency, currency_pairs } = this.props

    let currency = current_wallet && current_wallet.currency.currency
    let all_pairs = []

    // !initial && this.props.action.ConfirmationModalToggle()
    !initial && this.props.action.other_modal_toggle()

    if(currency_pairs){return false}

    let pairs = await this.props.action.get_pair_from(currency, null, true)
    if(pairs){all_pairs = [...pairs]}
    let pairs2 = await this.props.action.get_pair_from(null, currency, true)
    if(pairs2){all_pairs = [...all_pairs, ...pairs2]}
    // if(all_pairs.length<1){return (!initial && this.props.action.ConfirmationModalToggle())}
    if(all_pairs.length<1){return (!initial && this.props.action.other_modal_toggle())}
    let pairs_result = await this.createListPairs(all_pairs, currency)
    return this.props.action.pairs_for_account(current_wallet.currency.currency, {all_pairs:pairs_result}, 'currency')
  }

  createListPairs = async(all_pairs, currency) =>{

    const { currencies } = this.props

    if(!currencies){return false}

    let result = []

    for (var i = 0; i < all_pairs.length; i++) {

      let name

      if(all_pairs[i].primary_currency.currency === currency){
        name = all_pairs[i].secondary_currency.currency
      }
      if(all_pairs[i].secondary_currency.currency === currency){
        name = all_pairs[i].primary_currency.currency
      }

      if(!name){return false}

      let match = await matchItem(currencies, {primary:name}, 'view')

      if(!match){return false}

        result.push({
          ...match,
          pair_id:all_pairs[i].id
        })

    }

    return result
  }








render(){

  const { current_wallet, short_name, global_loader, current_pair, available } = this.props
  const { value, address, loader, active } = this.state
  const { secondary_coin, secondary_value, pair_id } = current_pair
  let movil_viewport = window.innerWidth < 768

  // console.log('|||||||||| SALDO DISPLONIBLE', typeof(available), current_pair)

  return(
    <Fragment>
    {
      !current_wallet ?
      <SimpleLoader
        label="Consultando Billetera"
      />
      :
        global_loader ?
        <SimpleLoader
          label="Procesando"
        />
        :
        <section className={`SwapView itemWalletView ${movil_viewport ? 'movil' : ''}`}>
            <div className="WSection1">
              <p className="fuente title soloAd3">Pago con:</p>
              <InputFormCoin
                active={active && secondary_coin && available>0 && value > 0}
                // active={(value>0 && value<=current_wallet.available) ? true : false}
                clase={true} //retiro los estilos que vienen por defecto
                placeholder="Escribe la cantidad"
                getMaxAvailable={this.getMaxAvailable}
                coin={short_name}
                saldoDisponible={available}
                name="name"
                value={value}
                actualizarEstado={this.actualizarEstado_coin}
                // imgs={btc}
              />
            </div>

            {
              !movil_viewport &&
              <div className="middleSection">
                <i className="fas fa-retweet"></i>
              </div>
            }


            <div className="WSection1">
              <p className="fuente title soloAd3">Recibo:</p>

              <ReadReceiveCoin
                active={active && secondary_coin && available>0 && value > 0}
                clase={true} //retiro los estilos que vienen por defecto
                placeholder="Total a recibir"
                getMaxAvailable={this.getMaxAvailable}
                getTotalValue={this.getTotalValue}
                coin={short_name}
                secondary_value={secondary_value}
                get_total_value={this.get_total_value}
                primary_value={value}
                secondary_coin={secondary_coin}
                solo_lectura={true}
                quote_type="primary"
                account_type={current_wallet.currency_type}
                loader={global_loader}
                getOtherPairs={this.getOtherPairs}
              />
            </div>

            <div className="WSection3">
              <ButtonForms
                active={active && secondary_coin && available>0 && value > 0}
                // active={(value>0 && value<=current_wallet.available) ? true : false}
                clases="cenVert"
                ancho="200px"
                type="primary"
                siguiente={this.swap}
              >
                  Cambiar
              </ButtonForms>
            </div>

          </section>
    }
    </Fragment>
  )
}
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

function mapStateToProps(state, props){
  const { current_wallet, pairs_for_account } = state.ui.current_section.params
  const { user, user_id,  wallets, all_pairs, balances } = state.model_data

  let current_pair = {
    pair_id:current_wallet && pairs_for_account[current_wallet.id] && pairs_for_account[current_wallet.id].current_pair.pair_id,
    secondary_coin:current_wallet && pairs_for_account[current_wallet.id] && pairs_for_account[current_wallet.id].current_pair.currency,
    secondary_value:current_wallet && pairs_for_account[current_wallet.id] && pairs_for_account[current_wallet.id].current_pair.currency_value
  }

  // console.log('||||||||||||||||||||||| CURRENT BY STATETOPROPS', current_pair)

  return{
    global_loader:state.isLoading.loader,
    user:user[user_id],
    wallets,
    all_pairs,
    swaps:state.model_data.swaps,
    current_wallet:current_wallet,
    short_name:state.ui.current_section.params.short_name,
    local_pairs:state.model_data.pairs.collections || null,
    quote_type:state.ui.current_section.params.quote_type,
    local_currency:state.model_data.pairs.localCurrency,
    currencies:state.model_data.currencies,
    currency_pairs:!current_wallet ? null : (pairs_for_account[current_wallet.currency.currency] && pairs_for_account[current_wallet.currency.currency].all_pairs),
    // current_pair:current_wallet && pairs_for_account[current_wallet.id] && pairs_for_account[current_wallet.id].current_pair
    current_pair:current_pair,
    available:balances && balances[current_wallet && current_wallet.id] && balances[current_wallet.id].available
  }
}
export default connect(mapStateToProps, mapDispatchToProps) (SwapView)
// export default withRouter(DepositView)
