import React, { Component } from 'react'
import './icons.css'
import Coinsenda from './logos/coinsenda'
import BancoBogota from './logos/bancoBogota'
import Bbva from './logos/bbva'
import Usa from '../../../assets/svg/usa.svg'

import {
  Email,
  IconDefault,
  Person,
  Verify1,
  Identification,
  Security2,
  Swap,
  Send,
  World,
  Bitcoin2,
  Phone,
  Currency,
  Finger,
  Success,
  Cop,
  Deposit,
  DepositCrypto,
  Withdraw2,
  Root,
  Add,
  ArrowRight,
  Percentage,
  Tag,
  Activity,
  Wallet,
  Maintence,
  Good,
  Blockchain,
  Peru,
  Errors,
  Financial,
  Touch,
  Upload, EtherAccount,
  ReferralPerson, Team, Comillas, Account, Ux, Dash, Litecoin, Youtube, Twitter, Whatsapp, Telegram, Zammad,
  Verified, WithdrawAccount, Referral, Medal, Confirming, Search, Ethereum, HoursAtention, AboutYou, PaymenthMethod, DollarSymbol, LogOut,
  QRCode,
  AuthFactor,
  Accepeted
 } from './'

 import {
   Davivienda,
   Bancolombia
 } from './logos'


 import { BankAgrario } from './logos/banco_agrario'
 import { BancajaSocial } from './logos/bancaja_social'
 // import { BancaMia } from './logos/bancamia'
 import { BankColpatria } from './logos/banco_colpatria'
 import { BancoFalabella } from './logos/banco_falabella'
 import { BancoFinandina } from './logos/banco_finandina'
 // import { BancoGnb } from './logos/banco_gnb'
 import { BankItau } from './logos/banco_itau'
 import { BancOccidente } from './logos/banco_occidente'
 import { BankPichincha } from './logos/banco_pichincha'
 import { BancoSantander } from './logos/banco_santander'
 import { Bancoomeva } from './logos/bancoomeva'
 import { Nequi } from './logos/nequi'
 // import { Scotia } from './logos/scotia_bank'
 import { AvVillas } from './logos/banco_av_villas'
 import { CitiBank } from './logos/banco_citibank'
 import { CompartirBank } from './logos/banco_compartir'
 import { CoopCentral } from './logos/banco_coopcentral'
 import { Corpbanca } from './logos/banco_corpbanca'
 import { GnbBank } from './logos/banco_sudameris'
 import { MultiBank } from './logos/banco_multibank'
 import { PopularBank } from './logos/banco_popular'
 import { BankProcredit } from './logos/banco_procredit'




 import {
   Ecuador,
   Chile,
   Argentina
 } from './flags'


// banco_de_bogota

 // const atributos ={
 //   icon:name,
 //   size:40,
 //   color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`,
 //   viewBox:{`${viewBox ? viewBox : '0 0 512 512' }`},
 //   clases:"marginLef"
 //   colorStroke:"red"
 // }

class IconSwitch extends Component {

  switcher = props => {
    const { icon } = props
    // console.log('||||||||||||||| props ICON SWICH::', props)
    switch (icon) {
      case 'twofa':
        return <AuthFactor {...props} />
      case 'qr':
        return <QRCode {...props} />
      case 'usd':
        return <img src={Usa} alt="" width={`${props.size}px`} height={`${props.size}px`}/>
      case 'logout':
        return <LogOut {...props} />
      case 'ethereum':
        return <Ethereum {...props} />
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
        return <Accepeted {...props}/>
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
        return <Referral {...props} />
      case 'referralPerson':
        return <ReferralPerson {...props} />
      case 'swap':
      case 'transactional':
      case 'transaction':
        return <Swap {...props} />
      case 'withdraw':
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

      default:
        return <IconDefault {...props} />
    }
  }


  render(){

    const{
      animOn,
      className
    } = this.props

    return(
        <div className={`iconSty ${animOn ? 'animOn' : '' } ${className}`}>
          <this.switcher {...this.props} />
        </div>
    )
  }

}


export default IconSwitch
