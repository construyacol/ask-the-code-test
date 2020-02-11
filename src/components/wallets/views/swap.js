import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../../widgets/loaders'
import LoaderTrade from '../../widgets/loaders/loaderTrade'
import { InputFormCoin, ReadReceiveCoin } from '../../widgets/inputs'
import { ButtonForms } from '../../widgets/buttons/buttons'
import { matchItem, mensaje } from '../../../services'
import convertCurrencies, { formatToCurrency } from '../../../services/convert_currency'
// import {  } from '../../../services/convert_currency'

class SwapView extends Component{

  state = {
    value:"",
    address:null,
    active:false,
    pair_id:null,
    total_value:null
  }

  componentDidMount(){
    this.init_state()
  }

  init_state = async() => {
    // await this.props.initial(this.props.match.params.path, this.props.match.params.account_id)
    this.getOtherPairs(true)
    const { current_wallet, local_currency, current_pair } = this.props
    this.props.action.get_pair_default(current_wallet, local_currency, current_pair)
    // console.log('||||||||||||||||||||||| CURRENT BY init_state', res)
  }

  actualizarEstado_coin = (e) =>{
    let value = e.target.value
    let { available } = this.props
    // console.log('___________________valor tecleado:', value)
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

  // getTotalValue = total_value =>{
  //   if(!total_value){return false}
  //   this.setState(total_value)
  // }

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


  finish_swap = async() =>{

    const {
      value,
    } = this.state

    const{
      current_wallet,
      current_pair
    } = this.props

    this.props.action.Loader(true)
    await this.props.action.get_swaps(current_wallet.id)
    // await this.props.action.current_section_params({currentFilter:'swaps'})

    const { pair_id } = current_pair
    // let total_value = await this.get_total_value(value)
    let new_swap = await this.props.action.add_new_swap(current_wallet.id, pair_id, value)
    // console.log('!!!!!____________________________________________add_new_swap', new_swap)
    if(!new_swap){
      return this.handleError('No se ha podio hacer el cambio')
    }

  }


  get_total_value = async value =>{

    const {
      current_wallet,
      current_pair
    } = this.props

    // console.log('||||||||||||| current_pair ==> ', current_pair)
    const { pair_id } = current_pair
    let total_value = await convertCurrencies(current_wallet.currency, value, pair_id)
    if(!total_value){return false}

    this.setState({value})
    return total_value.want_to_spend
  }


  // extract_currencies = async(currency) => {
  //
  //     const {
  //       current_pair,
  //       all_pairs
  //     } = this.props
  //
  //     const { primary_currency } = all_pairs[current_pair.pair_id]
  //     const { secondary_currency } = all_pairs[current_pair.pair_id]
  //
  //     // console.log('Comparison ==> ', currency, primary_currency)
  //     if(currency === primary_currency.currency){
  //       return secondary_currency
  //     }else{
  //       return primary_currency
  //     }
  //
  // }

  //
  // componentDidUpdate(prevProps){
  //   // console.log('NO CONDITIONAL', this.props)
  //   if(prevProps.all_pairs !== this.props.all_pairs){
  //     const { value } = this.state
  //     console.log('componentDidUpdate', value, this.props)
  //     this.actualizarEstado_coin({target:{value}})
  //
  //
  //
  //     // this.setState()
  //   }
  //
  //
  // }

  // updateSwapCurrentPair = async props => {
  //   this.get_total_value(this.props.available)
  // }

  init_swap = async() => {
    await this.swap()
    this.props.action.ConfirmationModalToggle()
  }


  swap = async() =>{

    const {
      value
    } = this.state

    const {
      current_wallet,
      current_pair
    } = this.props

    let query =`{"where":{"id":"${current_pair.pair_id}"}}`
    await this.props.action.update_current_pair(query)

    const { secondary_coin, pair_id } = current_pair
    const spent_currency_amount = await formatToCurrency(value, current_wallet.currency, true)
    const total_value = await this.get_total_value(value)
    this.setState({total_value})

    // const bought_currency = await this.extract_currencies(current_wallet.currency.currency)
    // const bought_currency_amount = await formatToCurrency(total_value, bought_currency, true)
    // console.log('Spent currency ==> ', current_wallet.currency)
    // console.log('Bought currency ==> ', bought_currency_amount, total_value)

    this.props.action.ConfirmationModalPayload({
      title:"Confirmando Intercambio",
      txtPrimary:"Confirmar Intercambio",
      txtSecondary:"Cancelar",
      payload:'aa',
      action:(this.finish_swap),
      img:"swap",
      type:"swap",
      from:current_wallet.currency.currency,
      to:secondary_coin,
      handleSwap:this.swap,
      spent:spent_currency_amount,
      bought:total_value,
      pair_id
    })
  }

  getOtherPairs = async(initial) => {

    const { current_wallet, currency_pairs } = this.props

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

  const { current_wallet, short_name, loader, current_pair, available } = this.props
  const { value, active, total_value } = this.state
  const { secondary_coin, secondary_value } = current_pair
  let movil_viewport = window.innerWidth < 768

  // console.log('|||||||||| VALUE STATAE', typeof(available), current_pair)
  // console.log('|||||||||| swap ', total_value)


  return(
    <Fragment>
    {
      !current_wallet ?
      <SimpleLoader
        label="Consultando Billetera"
      />
        :
        <section className={`SwapView itemWalletView ${movil_viewport ? 'movil' : ''}`}>

          {
            loader &&
            <LoaderTrade
              label="Procesando tu cambio"
            />
          }

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
                // getTotalValue={this.getTotalValue}
                coin={short_name}
                secondary_value={secondary_value}
                get_total_value={this.get_total_value}
                primary_value={value}
                // primary_value={1000000}
                secondary_coin={secondary_coin}
                solo_lectura={true}
                quote_type="primary"
                account_type={current_wallet.currency_type}
                loader={loader}
                getOtherPairs={this.getOtherPairs}
                total_value={total_value}
              />
            </div>

            <div className="WSection3">
              <ButtonForms
                active={active && secondary_coin && available>0 && value > 0}
                // active={(value>0 && value<=current_wallet.available) ? true : false}
                clases="cenVert"
                ancho="200px"
                type="primary"
                siguiente={this.init_swap}
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
  const { pairs_for_account } = state.ui.current_section.params
  const { user, user_id,  wallets, all_pairs, balances } = state.model_data
  const { params } = props.match
  const current_wallet = wallets[params.account_id]
  // console.log('Que carajo pasa con el convertidor', pairs_for_account)

  let current_pair = {
    pair_id:(current_wallet && pairs_for_account[current_wallet.id]) && pairs_for_account[current_wallet.id].current_pair.pair_id,
    secondary_coin:current_wallet && pairs_for_account[current_wallet.id] && pairs_for_account[current_wallet.id].current_pair.currency,
    secondary_value:current_wallet && pairs_for_account[current_wallet.id] && pairs_for_account[current_wallet.id].current_pair.currency_value
  }




  // console.log('||||||||||||||||||||||| CURRENT BY STATETOPROPS', current_wallet, pairs_for_account)

  return{
    loader:state.isLoading.loader,
    user:user[user_id],
    wallets,
    all_pairs,
    swaps:state.model_data.swaps,
    current_wallet,
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
