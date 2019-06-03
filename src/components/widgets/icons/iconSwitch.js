import React, { Component, Fragment } from 'react'
import './icons.css'
import Coinsenda from './logos/coinsenda'
import BancoBogota from './logos/bancoBogota'
import Bbva from './logos/bbva'

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
  Bitcoin,
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
  Upload,
  ReferralPerson,
  Verified, WithdrawAccount, Referral, Medal, Confirming, Search
 } from './'

 import {
   Davivienda,
   Bancolombia
 } from './logos'


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
    // console.log('|||| IconSwitch  ||||', icon)

    switch (icon) {
      case 'pending':
        return <Search {...props} />
      case 'confirming':
        return <Confirming {...props} />
      case 'accepted':
        return <Medal {...props} />
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
        return <Swap {...props} />
      case 'withdraw':
        return <Send {...props} />
      case 'languaje':
        return <World {...props} />
      case 'currency':
        return <Currency {...props} />
      case 'phone':
        return <Phone {...props} />
      case 'pass':
        return <Finger {...props} />
      case 'accepted':
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
        return <Davivienda {...props} />
      case 'bancolombia':
        return <Bancolombia {...props} />
      case 'banco_de_bogota':
        return <BancoBogota {...props} />
      case 'bbva':
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


      default:
        return <IconDefault {...props} />
    }
  }


  render(){

    const{
      animOn
    } = this.props

    return(
        <div className={`iconSty ${animOn ? 'animOn' : '' }`}>
          <this.switcher {...this.props} />
        </div>
    )
  }

}


export default IconSwitch
