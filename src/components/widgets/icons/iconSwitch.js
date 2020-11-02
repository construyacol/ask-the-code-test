import React, { Component } from 'react'
import loadable from '@loadable/component'
import Usa from '../../../assets/svg/usa.svg'
import './icons.css'

// import { BancaMia } from './logos/bancamia'
// import { BancoGnb } from './logos/banco_gnb'
// import { Scotia } from './logos/scotia_bank'

const getExportByName = componentName => exportObject => ({ default: exportObject[componentName] });

const Email = loadable(() => import('./').then(getExportByName('Email')))
const IconDefault = loadable(() => import('./').then(getExportByName('IconDefault')))
const Person = loadable(() => import('./').then(getExportByName('Person')))
const Verify1 = loadable(() => import('./').then(getExportByName('Verify1')))
const Identification = loadable(() => import('./').then(getExportByName('Identification')))
const Security2 = loadable(() => import('./').then(getExportByName('Security2')))
const Swap = loadable(() => import('./').then(getExportByName('Swap')))
const Send = loadable(() => import('./').then(getExportByName('Send')))
const World = loadable(() => import('./').then(getExportByName('World')))
const Bitcoin2 = loadable(() => import('./').then(getExportByName('Bitcoin2')))
const Phone = loadable(() => import('./').then(getExportByName('Phone')))
const Currency = loadable(() => import('./').then(getExportByName('Currency')))
const Finger = loadable(() => import('./').then(getExportByName('Finger')))
const Success = loadable(() => import('./').then(getExportByName('Success')))
const Cop = loadable(() => import('./').then(getExportByName('Cop')))
const Deposit = loadable(() => import('./').then(getExportByName('Deposit')))
const DepositCrypto = loadable(() => import('./').then(getExportByName('DepositCrypto')))
const Withdraw2 = loadable(() => import('./').then(getExportByName('Withdraw2')))
const Root = loadable(() => import('./').then(getExportByName('Root')))
const Add = loadable(() => import('./').then(getExportByName('Add')))
const ArrowRight = loadable(() => import('./').then(getExportByName('ArrowRight')))
const Percentage = loadable(() => import('./').then(getExportByName('Percentage')))
const Tag = loadable(() => import('./').then(getExportByName('Tag')))
const Activity = loadable(() => import('./').then(getExportByName('Activity')))
const Wallet = loadable(() => import('./').then(getExportByName('Wallet')))
const Maintence = loadable(() => import('./').then(getExportByName('Maintence')))
const Good = loadable(() => import('./').then(getExportByName('Good')))
const Blockchain = loadable(() => import('./').then(getExportByName('Blockchain')))
const Peru = loadable(() => import('./').then(getExportByName('Peru')))
const Errors = loadable(() => import('./').then(getExportByName('Errors')))
const Financial = loadable(() => import('./').then(getExportByName('Financial')))
const Touch = loadable(() => import('./').then(getExportByName('Touch')))
const Upload = loadable(() => import('./').then(getExportByName('Upload')))
const EtherAccount = loadable(() => import('./').then(getExportByName('EtherAccount')))
const ReferralPerson = loadable(() => import('./').then(getExportByName('ReferralPerson')))
const Team = loadable(() => import('./').then(getExportByName('Team')))
const Comillas = loadable(() => import('./').then(getExportByName('Comillas')))
const Account = loadable(() => import('./').then(getExportByName('Account')))
const Cardano = loadable(() => import('./').then(getExportByName('Cardano')))
const Ux = loadable(() => import('./').then(getExportByName('Ux')))
const Dash = loadable(() => import('./').then(getExportByName('Dash')))
const Litecoin = loadable(() => import('./').then(getExportByName('Litecoin')))
const Youtube = loadable(() => import('./').then(getExportByName('Youtube')))
const Twitter = loadable(() => import('./').then(getExportByName('Twitter')))
const Whatsapp = loadable(() => import('./').then(getExportByName('Whatsapp')))
const Telegram = loadable(() => import('./').then(getExportByName('Telegram')))
const Zammad = loadable(() => import('./').then(getExportByName('Zammad')))
const Verified = loadable(() => import('./').then(getExportByName('Verified')))
const WithdrawAccount = loadable(() => import('./').then(getExportByName('WithdrawAccount')))
const Medal = loadable(() => import('./').then(getExportByName('Medal')))
const Confirming = loadable(() => import('./').then(getExportByName('Confirming')))
const Accepeted = loadable(() => import('./').then(getExportByName('Accepeted')))
const SwapCamera = loadable(() => import('./').then(getExportByName('SwapCamera')))
const Handshake = loadable(() => import('./').then(getExportByName('Handshake')))
const Search = loadable(() => import('./').then(getExportByName('Search')))
const Ethereum = loadable(() => import('./').then(getExportByName('Ethereum')))
const HoursAtention = loadable(() => import('./').then(getExportByName('HoursAtention')))
const AboutYou = loadable(() => import('./').then(getExportByName('AboutYou')))
const PaymenthMethod = loadable(() => import('./').then(getExportByName('PaymenthMethod')))
const DollarSymbol = loadable(() => import('./').then(getExportByName('DollarSymbol')))
const LogOut = loadable(() => import('./').then(getExportByName('LogOut')))
const NewAccount = loadable(() => import('./').then(getExportByName('NewAccount')))
const QRCode = loadable(() => import('./').then(getExportByName('QRCode')))
const AuthFactor = loadable(() => import('./').then(getExportByName('AuthFactor')))
const Ecuador = loadable(() => import('./flags').then(getExportByName('Ecuador')))
const Chile = loadable(() => import('./flags').then(getExportByName('Chile')))
const Argentina = loadable(() => import('./flags').then(getExportByName('Argentina')))
const BankAgrario = loadable(() => import('./logos/banco_agrario'))
const BancajaSocial = loadable(() => import('./logos/bancaja_social'))
const BankColpatria = loadable(() => import('./logos/banco_colpatria'))
const BancoFalabella = loadable(() => import('./logos/banco_falabella'))
const BancoFinandina = loadable(() => import('./logos/banco_finandina'))
const BankItau = loadable(() => import('./logos/banco_itau'))
const BancOccidente = loadable(() => import('./logos/banco_occidente'))
const BankPichincha = loadable(() => import('./logos/banco_pichincha'))
const BancoSantander = loadable(() => import('./logos/banco_santander'))
const Bancoomeva = loadable(() => import('./logos/bancoomeva'))
const Nequi = loadable(() => import('./logos/nequi'))
const AvVillas = loadable(() => import('./logos/banco_av_villas'))
const CitiBank = loadable(() => import('./logos/banco_citibank'))
const CompartirBank = loadable(() => import('./logos/banco_compartir'))
const CoopCentral = loadable(() => import('./logos/banco_coopcentral'))
const Corpbanca = loadable(() => import('./logos/banco_corpbanca'))
const GnbBank = loadable(() => import('./logos/banco_sudameris'))
const MultiBank = loadable(() => import('./logos/banco_multibank'))
const PopularBank = loadable(() => import('./logos/banco_popular'))
const BankProcredit = loadable(() => import('./logos/banco_procredit'))
const Davivienda = loadable(() => import('./logos').then(getExportByName('Davivienda')))
const Bancolombia = loadable(() => import('./logos').then(getExportByName('Bancolombia')))
const Coinsenda = loadable(() => import('./logos/coinsenda'))
const BancoBogota = loadable(() => import('./logos/bancoBogota'))
const Bbva = loadable(() => import('./logos/bbva'))

class IconSwitch extends Component {
  switcher = props => {
    const { icon } = props
    // console.log('||||||||||||||| props ICON SWICH::', props)
    switch (icon) {
      case 'newAccount':
        return <NewAccount {...props} />
      case 'twofa':
        return <AuthFactor {...props} />
      case 'qr':
        return <QRCode {...props} />
      case 'usd':
        return <img src={Usa} alt="" width={`${props.size}px`} height={`${props.size}px`} />
      case 'logout':
        return <LogOut {...props} />
      case 'ethereum':
        return <Ethereum {...props} />
      case 'cardano':
        return <Cardano {...props} />
      case 'ethereum_account':
        return <EtherAccount {...props} />
      case 'argentina':
        return <Argentina {...props} />
      case 'chile':
        return <Chile {...props} />
      case 'ecuador':
        return <Ecuador {...props} />
      case 'telegram':
        return <Telegram {...props} />
      case 'zammad':
        return <Zammad {...props} />
      case 'whatsapp':
        return <Whatsapp {...props} />
      case 'twitter':
        return <Twitter {...props} />
      case 'litecoin':
        return <Litecoin {...props} />
      case 'youtube':
        return <Youtube {...props} />
      case 'dash':
        return <Dash {...props} />
      case 'ux':
        return <Ux {...props} />
      case 'account':
        return <Account {...props} />
      case 'comillas':
        return <Comillas {...props} />
      case 'team':
        return <Team {...props} />
      case 'atumedida':
        return <PaymenthMethod {...props} />
      case 'aboutYou':
        return <AboutYou {...props} />
      case 'atentionHours':
        return <HoursAtention {...props} />
      case 'pending':
        return <Search {...props} />
      case 'confirmed':
        return <Confirming {...props} />
      case 'accepted':
        return <Medal {...props} />
      case 'accepted2':
        return <Accepeted {...props} />
      case 'email':
        return <Email {...props} />
      case 'coinsenda':
        return <Coinsenda {...props} />
      case 'withdraw_account':
        return <WithdrawAccount {...props} />
      case 'verified':
        return <Verified {...props} />
      case 'upload':
        return <Upload {...props} />
      case 'touch':
        return <Touch {...props} />
      case 'kyc_financial':
        return <Financial {...props} />
      case 'canceled':
      case 'rejected':
      case 'error':
        return <Errors {...props} />
      case 'identity':
        return <Person {...props} />
      case 'kyc_basic':
        return <Verify1 {...props} />
      case 'kyc_advanced':
        return <Identification {...props} />
      case '2auth':
      case 'security':
        return <Security2 {...props} />
      case 'referral':
        return <Handshake {...props} />
      case 'referralPerson':
        return <ReferralPerson {...props} />
      case 'swap':
      case 'transactional':
      case 'transaction':
        return <Swap {...props} />
      case 'withdraw':
      case 'withdraws':
      case 'withdraw_accounts':
        return <Send {...props} />
      case 'languaje':
        return <World {...props} />
      case 'currency':
        return <Currency {...props} />
      case 'phone':
        return <Phone {...props} />
      case 'pass':
        return <Finger {...props} />
      case 'success':
        return <Success {...props} />
      case 'bitcoin':
      case 'bitcoin_testnet':
        return <Bitcoin2 {...props} />
      case 'cop':
      case 'colombia':
        return <Cop {...props} />
      case 'peru':
        return <Peru {...props} />
      case 'deposit':
      case 'deposits':
        return <Deposit {...props} />
      case 'deposit_crypto':
        return <DepositCrypto {...props} />
      case 'withdraw2':
        return <Withdraw2 {...props} />
      case 'root':
        return <Root {...props} />
      case 'add_account':
        return <Add {...props} />
      case 'davivienda':
      case 'banco_davivienda':
        return <Davivienda {...props} />
      case 'bancolombia':
      case 'banco_bancolombia':
        return <Bancolombia {...props} />
      case 'banco_de_bogota':
        return <BancoBogota {...props} />
      case 'bbva':
      case 'banco_bbva':
        return <Bbva {...props} />
      case 'arrow_right':
        return <ArrowRight {...props} />
      case 'preferential':
        return <Percentage {...props} />
      case 'tag':
        return <Tag {...props} />
      case 'activity':
        return <Activity {...props} />
      case 'wallets':
      case 'wallet':
        return <Wallet {...props} />
      case 'maintence':
        return <Maintence {...props} />
      case 'verify':
        return <Good {...props} />
      case 'blockchain':
        return <Blockchain {...props} />
      case 'banco_agrario':
        return <BankAgrario {...props} />
      case 'banco_caja_social':
        return <BancajaSocial {...props} />
      case 'banco_colpatria':
        return <BankColpatria {...props} />
      case 'banco_falabella':
        return <BancoFalabella {...props} />
      case 'banco_finandina':
        return <BancoFinandina {...props} />
      case 'banco_itau_corpbanca':
        return <BankItau {...props} />
      case 'banco_de_occidente':
        return <BancOccidente {...props} />
      case 'banco_pichincha':
        return <BankPichincha {...props} />
      case 'banco_santander':
        return <BancoSantander {...props} />
      case 'banco_bancoomeva':
        return <Bancoomeva {...props} />
      case 'banco_nequi':
        return <Nequi {...props} />
      case 'banco_av_villas':
        return <AvVillas {...props} />
      case 'bank':
        return <DollarSymbol {...props} />
      case 'banco_citibank':
        return <CitiBank {...props} />
      case 'banco_compartir':
        return <CompartirBank {...props} />
      case 'banco_coopcentral':
        return <CoopCentral {...props} />
      case 'banco_corpbanca':
        return <Corpbanca {...props} />
      case 'banco_sudameris':
        return <GnbBank {...props} />
      case 'banco_multibank':
        return <MultiBank {...props} />
      case 'banco_popular':
        return <PopularBank {...props} />
      case 'banco_procredit':
        return <BankProcredit {...props} />
      case 'banco_financiera_juriscoop':
      case 'banco_cootrafa_cooperativa_financiera':
      case 'banco_cooperativa_financiera_antioquia':
      case 'banco_confiar_cooperativa_financiera':
      case 'banco_coltefinanciera':
        return <Account {...props} />
      case 'swap-camera':
        return <SwapCamera {...props} />
      default:
        return <IconDefault {...props} />
    }
  }

  render() {

    const {
      animOn,
      className,
      withoutwrapper = false
    } = this.props

    if (withoutwrapper) {
      const props = {...this.props}
      props.withoutwrapper = ""
      return (
        <>
          {React.createElement(this.switcher, props)}
        </>
      )
    }

    return (
      <div className={`iconSty ${animOn ? 'animOn' : ''} ${className}`}>
        {React.createElement(this.switcher, this.props)}
      </div>
    )
  }

}


export default IconSwitch
