import React, { Fragment } from 'react'
import IconSwitch from '../icons/iconSwitch'
import backcard from '../../../assets/wallet_coins/back.png'
import './item_wallet.css'



const ItemTemplate = props => {


    // console.log('||||||||| ============> ItemTemplate', props.currencies.length)


    return(
      <Fragment>
        <div className={`ItemTemplate contWalleins animate`}>

                <div
                  id="ItemWallet"
                  className={`  ItemWallet2 ${props.currency.red.toLowerCase()} cryptoWallet`}
                  >

                    <img src={backcard} id="backCard" alt="" width="100%" height="100%"/>
                    <div className="contIconsTem" style={{height:`${props.currencies.length ? props.currencies.length : '1'}00%`, top:`-${(props.currency.id-1)}00%`}} >
                        {
                          props.currencies.map(currency => {
                            return(
                                  <div className={`iconBank2Cont ${props.currency.red === currency.red ? 'ON' : ''}`} key={currency.id}>
                                    <IconSwitch icon={currency.red.toLowerCase()} size={160}/>
                                  </div>
                            )
                          })
                        }
                    </div>

                  <h1 className="IWText titu fuente tobe_continue"> Mi cartera {props.currency.red} </h1>

                    <p className="IWText fuente IWcurrencyText tobe_continue">
                      {props.currency.red}
                    </p>

                    <p className="IWText fuente IWcurrencyText tobe_continue">
                      {props.currency.status}
                    </p>

                </div>
              </div>
        </Fragment>
    )

}


export default ItemTemplate
