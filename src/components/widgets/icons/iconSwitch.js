import React, { Component, Fragment } from 'react'
import './icons.css'

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
  Blockchain
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
      case 'email':
        return <Email {...props} />
      case 'identity':
        return <Person {...props} />
      case 'kyc_basic':
        return <Verify1 {...props} />
      case 'kyc_advance':
        return <Identification {...props} />
      case '2auth':
        return <Security2 {...props} />
      case 'transaction':
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
