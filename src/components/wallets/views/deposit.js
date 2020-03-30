import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import CopyContainer from '../../widgets/copy/copyContainer'
import SimpleLoader from '../../widgets/loaders'
import QRCode from 'qrcode'
import { ButtonForms } from '../../widgets/buttons/buttons'
import IconSwitch from '../../widgets/icons/iconSwitch'
import UnverifiedComponent from '../../widgets/unverified_user/unverifiedComponent'
import { SentryCaptureException } from '../../../services'


class DepositView extends Component{

  state = {
    qr:null,
    address:null,
    fiat_currency:false,
    verified:false,
    validating_msg:null,
    validating_address:false
  }

    componentDidMount(){
      // console.log('|||||||||||||||||||||| ======= DEPOSIT VIEW ', this.props)
      this.init_config()
    }

  init_config = async() =>{

      let verified = await this.props.action.user_verification_status('level_1')
      await this.setState({verified})

      // await this.props.initial(this.props.match.params.path, this.props.match.params.account_id)
      const { current_wallet, deposit_providers } = this.props

      if(!current_wallet){return this.props.action.section_view_to('initial')} //Este caso ocurre cuando la url apunta al detalle de la cuenta pero si el estado de verificación del usuario es rejected o pending redireccióna a /security

      // if(!current_pair){this.props.action.get_pair_default(current_wallet, local_currency, current_pair)}
      if(current_wallet.currency_type === 'fiat'){return this.setState({fiat_currency: true})}
      if((current_wallet && current_wallet.dep_prov.length<1) || !deposit_providers ){return false}
      let dep_prov = deposit_providers[current_wallet.dep_prov[0]]
      if(!dep_prov || !dep_prov.account.account_id.account_id){return false}
      // console.log('DESDE DEPOSITOSSSS ', dep_prov)
      // let address = current_wallet.deposit_provider.account.account_id
      const { account } = dep_prov
      let qr = await QRCode.toDataURL(account.account_id.account_id)
      this.setState({
        qr:qr,
        address:account.account_id.account_id,
        validating_address:true
      })
      const validateAddress = await this.props.action.validate_address(account.account_id.account_id)
      // const validateAddress = await this.props.action.validate_address('asd')
      if(!validateAddress){
        // sentry call emit error
        SentryCaptureException('ADDRESS posiblemente vulnerada, review /wallets/views/deposit')
        return this.setState({address:null,
        validating_msg:'Dirección invalida, por favor contacte con soporte...'})
      }
      this.setState({
        validating_address:false
      })
      // console.log('DESDE validateAddress ', validateAddress)
  }

  componentDidUpdate(prevProps){
    if(prevProps.current_wallet !== this.props.current_wallet){
      this.init_config()
    }
  }





  fiat_deposit = async() =>{
    // console.log('|||||||||||||| FIAT DEPOSIT', this.props.local_currency)
      await this.props.action.FiatDeposit(this.props.local_currency || 'usd')
      this.props.action.ToggleModal()
  }


  create_deposit_provider = async() => {
    // 5dce0483a389244fa63bf6a7
    this.props.action.Loader(true)
    const { current_wallet } = this.props
    let dep_prov_id = await this.props.action.create_deposit_provider(current_wallet.id, current_wallet.country)
    // let dep_prov_id = 23232323
    if(!dep_prov_id){
      this.props.action.Loader(false)
      return false
    }

    let deposit_providers = await this.props.action.get_deposit_providers(this.props.user)

    let update_wallet = {
      [current_wallet.id]:{...current_wallet, dep_prov:[dep_prov_id], deposit_provider:deposit_providers[dep_prov_id]}
    }

    await this.props.action.update_item_state(update_wallet, 'wallets')

    this.props.action.current_section_params({
      current_wallet:update_wallet[current_wallet.id]
    })
    this.props.action.Loader(false)

    // console.log('|||||||||||||| ====================================> Deposit_provider ID', dep_prov_id, deposit_providers[dep_prov_id], deposit_providers)

  }


render(){

  const { current_wallet, loader } = this.props
  const { qr, address, fiat_currency, verified, validating_address, validating_msg } = this.state
  let movil_viewport = window.innerWidth < 768

  const atributos ={
    icon: fiat_currency ? 'deposit' : 'deposit_crypto',
    size:movil_viewport ? 80 : 100,
    // color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`,
    color:'#989898'
  }



  return(
    <Fragment>
    {
      !verified ?
      <UnverifiedComponent/>
      :
      !current_wallet ?
      <SimpleLoader
        label="Consultando Billetera"
      />
    :
      qr ?
      <section className="contAddress">
        <p id="soloAd2" className="fuente title soloAd2">Importante:</p>
        <p className="fuente soloAd">Envía solo {current_wallet.currency.currency} a esta Billetera. El envío de cualquier otra moneda a esta dirección puede resultar en la pérdida de su depósito. </p>

        <div className="qrContainer">
              <QrProtector active={validating_address} invalid={validating_msg}/>
          <img id="qrDesposit" className="itemFuera" src={qr} alt="" />
        </div>
        <p className="fuente title dirDep">Dirección de deposito:</p>
        <div className="fuente address">
          <CopyContainer
            valueToCopy={validating_msg ? 'Dirección invalida, contacta con soporte' : validating_address ? 'XXXXXX- Verificando dirección -XXXXXX' : address}
            color="black"
          />
        </div>
      </section>
      :
      fiat_currency ?

      <section className={`DepositView itemWalletView ${movil_viewport ? 'movil' : ''}`}>

        <div className="contIcontSwitch">
          <IconSwitch {...atributos}/>
        </div>

          <div className="contIcontSwitchCont">
            {
              this.props.active_trade_operation ?
              <p className="fuente active_trade_operation">Operación de intercambio en proceso, una vez finalice podrás hacer depositos.</p>
              :
              <p className="fuente">La mejor manera de iniciar operaciones en coinsenda es realizando un deposito.</p>
            }
          </div>

        <div className="contButtons">
            <ButtonForms
              type="primary"
              active={this.props.active_trade_operation ? false : true}
              siguiente={this.fiat_deposit}
            >
              Realizar un deposito
            </ButtonForms>
        </div>
      </section>
      :
      <section className={`DepositView itemWalletView ${movil_viewport ? 'movil' : ''}`}>

        <div className="contIcontSwitch">
          <IconSwitch {...atributos}/>
        </div>

          <p className="fuente">Esta Billetera aún no tiene dirección de deposito, creala ahora e inicia operaciones con esta cuenta.</p>

        <div className="contButtons deposit">
          {
            loader &&
            <div className="deposit_loader">
              <SimpleLoader/>
            </div>
          }
            <ButtonForms
              type="primary"
              active={!loader}
              siguiente={this.create_deposit_provider}
            >
              Crear dirección de deposito
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
  const { user, user_id, wallets, deposit_providers } = state.modelData
  const { loader } = state.isLoading
  const { params } = props.match
  const current_wallet = wallets[params.account_id]

  // console.log('DESDE DEPOSITOSSSS ', state.modelData.pairs)

  return{
    active_trade_operation:state.ui.current_section.params.active_trade_operation,
    user:user,
    current_wallet,
    loader,
    local_currency:state.modelData.pairs.localCurrency,
    deposit_providers,
    // local_currency:state.ui.current_section.params.short_name,
    current_pair:!current_wallet ? null : (state.ui.current_section.params.pairsForAccount[current_wallet.id] && state.ui.current_section.params.pairsForAccount[current_wallet.id].current_pair)

  }
}

export default connect(mapStateToProps, mapDispatchToProps) (DepositView)
// export default withRouter(DepositView)



const QrProtector = ({ active, invalid }) => (
  <div className={`qrProtector ${active ? 'active' : ''} ${invalid ? 'error' : ''}`}>
    <IconSwitch
      icon="qr"
      size={35}
      color="black"
    />
  </div>
)
