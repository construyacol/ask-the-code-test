import React, { Fragment, Component } from 'react'
import { Link } from 'react-router-dom'
// import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import CopyContainer from '../../widgets/copy/copyContainer'
import SimpleLoader from '../../widgets/loaders'
import QRCode from 'qrcode'
import { ButtonForms } from '../../widgets/buttons/buttons'
import IconSwitch from '../../widgets/icons/iconSwitch'
import UnverifiedComponent from '../../widgets/unverified_user/unverifiedComponent'


class DepositView extends Component{

  state = {
    qr:null,
    address:null,
    fiat_currency:false,
    verified:false
  }

    componentDidMount(){
      this.init_config()
    }

  init_config = async() =>{

      let verified = await this.props.action.user_verification_status('level_1')
      await this.setState({verified})

      await this.props.initial(this.props.match.params.path, this.props.match.params.id)
      const { current_wallet, local_currency, current_pair } = this.props
      if(!current_wallet){return this.props.action.section_view_to('initial')} //Este caso ocurre cuando la url apunta al detalle de la cuenta pero si el estado de verificación del usuario es rejected o pending redireccióna a /security
      // if(!current_pair){this.props.action.get_pair_default(current_wallet, local_currency, current_pair)}
      if(current_wallet.currency_type === 'fiat'){this.setState({fiat_currency: true})}
      if(current_wallet && current_wallet.dep_prov.length<1 || !current_wallet || !current_wallet.deposit_provider){return false}
      let address = this.props.current_wallet.deposit_provider.provider.account.account_id
      const { account_id } = address
      let qr = await QRCode.toDataURL(account_id)
      this.setState({
        qr:qr,
        address:account_id
      })
  }





  fiat_deposit = async() =>{
      await this.props.action.FiatDeposit(this.props.local_currency || 'usd')
      this.props.action.ToggleModal()
  }

  get_deposit_provider = () => {
    alert('Servicio para asignar deposit provider (Dirección de deposito)')
  }


render(){

  const { current_wallet } = this.props
  const { qr, address, fiat_currency, verified } = this.state
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
        <img id="qrDesposit" className="itemFuera" src={qr} />
        <p className="fuente title dirDep">Dirección de deposito:</p>
        <div className="fuente address">
          <CopyContainer
            valueToCopy={address}
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

        <div className="contButtons">
            <ButtonForms
              type="primary"
              active={true}
              siguiente={this.get_deposit_provider}
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
  const { current_wallet } = state.ui.current_section.params
  const { user, user_id } = state.model_data
// console.log('DESDE DEPOSITOSSSS ', state.ui.current_section.params.short_name)
  return{
    active_trade_operation:state.ui.current_section.params.active_trade_operation,
    user:user[user_id],
    current_wallet:state.ui.current_section.params.current_wallet,
    // local_currency:state.model_data.pairs.localCurrency,
    local_currency:state.ui.current_section.params.short_name,
    current_pair:!current_wallet ? null : (state.ui.current_section.params.pairs_for_account[current_wallet.id] && state.ui.current_section.params.pairs_for_account[current_wallet.id].current_pair)

  }
}

export default connect(mapStateToProps, mapDispatchToProps) (DepositView)
// export default withRouter(DepositView)
