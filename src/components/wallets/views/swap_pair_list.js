import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import SimpleLoader from '../../widgets/loaders'
import ItemLayout from '../../widgets/items/itemLayout'
import convertCurrencies from '../../../services/convert_currency'
import OtherModalLayoutPairs from '../../widgets/modal/otherModalLayoutPairs'

export class PairList extends Component {

  state = {
    all_pairs:this.props.all_pairs,
    loadermsg:"Cargando Pares"
  }

  close_modal = () => {
  this.props.action.other_modal_toggle()
  }

  componentWillReceiveProps(props){
    const { all_pairs } = props
    if(!all_pairs){return false}

    this.setState({
      all_pairs:all_pairs
    })
  }



  select_quote = async(name, code, type_currency, pair_id) =>{
    // console.log(name, code, type_currency, pair_id);

    const { current_wallet } = this.props
    this.props.action.Loader(true)
    this.setState({
      loadermsg:"Ajustando nave nodriza..."
    })

    // const { data } = await this.props.action.currency_calculator_exported(current_wallet.currency.currency, 1, pair_id)
    const data = await convertCurrencies(current_wallet.currency, '1', pair_id)

    this.props.action.Loader(false)
    this.props.action.other_modal_toggle()

    if(data){
      const { to_spend_currency, pair_id } = data
      await this.props.action.pairs_for_account(current_wallet.id, {
          current_pair:{
            pair_id:pair_id,
            currency:to_spend_currency.currency,
            currency_value:data.want_to_spend
          }
      })
    }


    // this.props.

    // this.props.action.current_section_params(
    //   {
    //     current_pair:{
    //       currency:to_spend_currency.currency,
    //       currency_value:data.want_to_spend
    //     }
    //   }
    // )
  }

  render(){
    const {
      current_wallet,
      current_pair,
      loader
     } = this.props

     const {
       all_pairs,
       loadermsg
     } = this.state


    return(

      <OtherModalLayoutPairs
        title={`Convertir ${current_wallet.currency.currency} a:`}
        close_modal={this.close_modal}
        >

        <Fragment>
          <div className="PairListFind"></div>

          <div className="PairListItems">
              {
                (all_pairs && !loader) ?
                   all_pairs.map(pair=>{
                     return <ItemLayout actives={pair.type_currency==='fiat' ? (pair.code === current_pair.currency) : pair.name === current_pair.currency} actualizarEstado={this.select_quote} {...pair} key={pair.id} />
                   })
                :
                <div className="swapLoaderCont">
                  <SimpleLoader
                    label={loadermsg}
                  />
                </div>
              }
          </div>
        </Fragment>

      </OtherModalLayoutPairs>

    )
  }
}



function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

function mapStateToProps(state, props){

  const { wallets } = state.modelData
  const { params } = props.match
  const current_wallet = wallets[params.account_id]
  const { id, currency } = current_wallet
  // console.log('||||||| PAIR SWAP LIST DATA ==> ', props, current_wallet)

  return{
    current_wallet,
    short_name:state.ui.current_section.params.short_name,
    all_pairs:state.ui.current_section.params.pairs_for_account[currency.currency] && state.ui.current_section.params.pairs_for_account[currency.currency].all_pairs,
    current_pair:state.ui.current_section.params.pairs_for_account[id] && state.ui.current_section.params.pairs_for_account[id].current_pair,
    loader:state.isLoading.loader
  }
}
export default connect(mapStateToProps, mapDispatchToProps) (PairList)
