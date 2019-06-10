import React, { Fragment } from 'react'
import { coins } from '../../api/ui/api.json'
import ItemLayout from '../items/itemLayout'
import Slider from './slide'
import ChartCoin from '../chartCoin/chartCoin.js'
import PropTypes from 'prop-types'


const QuoteLayout = props => {

  const { user_collection, buy, sell, movil, switchItem } = props
  const { select_currency } = props
  const { localCurrency } = props.pairs
  const { buy_price, sell_price } = props
  const { currency } = props.pairs.currentPair.primary_currency
  const { buy_pair } = props.pairs.currentPair
  let iter = 0

  // console.log('S T A T E - - - Q U O T E - - - - L A Y O U T - - - C O N T A I N E R:::', props)

  return(
    <Fragment>
    {
      localCurrency &&
      <section className="QuoteLayout">

        <ChartCoin/>

        <div className="QuoteLayoutContainer">

            <div className={`${movil ? 'movilPrices' : 'desktopPrices'} prices`}>
              <div className="movilSwitch" style={{display:movil ? 'grid' : 'none'}}>
                  <p className={`itemSwitch ${buy ? 'active' : 'inactive' }`} onClick={switchItem} id="buy">Te compramos a:</p>
                  <p className={`itemSwitch ${sell ? 'active' : 'inactive' }`} onClick={switchItem} id="sell">Te vendemos a:</p>
              </div>

              <div className="buy" style={{display: (buy || !movil) ? 'grid' : 'none'}}>
                <p className="fuente" style={{display: movil ? 'none' : 'initial'}}>Te compramos a:</p>
                    <h1 className="fuente2 Qprice">${sell_price} <span className="fuente">{localCurrency.toUpperCase()} <i className="Qventa fas fa-angle-double-up" style={{display: movil ? 'initial' : 'none'}} ></i></span></h1>
              </div>

              <div className="sell" style={{display: (sell || !movil) ? 'grid' : 'none'}}>
                <p className="fuente" style={{display: movil ? 'none' : 'initial'}}>Te vendemos a:</p>
                    <h1 className="fuente2 Qprice">${buy_price} <span className="fuente">{localCurrency.toUpperCase()} <i className="Qventa fas fa-angle-double-down" style={{display: movil ? 'initial' : 'none'}} ></i></span></h1>
              </div>
            </div>

            <div className={`coinList ${user_collection ? ((user_collection.length>1 && window.innerWidth>768) ? 'user_collection': '') : ''}`}>
                {
                  (user_collection) ?


                       window.innerWidth>768 ?
                            user_collection.map(item=>{
                                iter++
                                if(iter>3){return false}
                              return (
                                <Fragment key={item.id}>
                                  <ItemLayout actives={currency === item.name && true } {...item} actualizarEstado={select_currency} />
                                </Fragment>
                              )
                            })
                        :
                        <Slider currency={currency} items={user_collection} select_currency={select_currency} />


                     :
                     (buy_pair === `BTC/${localCurrency.toUpperCase()}`) ?
                        <ItemLayout actives={true} {...coins[0]} key={coins[0].id} />
                     :
                        <h1>{buy_pair}</h1>
                }
            </div>
        </div>
      </section>
    }

    </Fragment>
  )
}

QuoteLayout.propTypes = {
  buy:PropTypes.bool,
  buy_price:PropTypes.string,
  loader:PropTypes.bool,
  movil:PropTypes.bool,
  pairs:PropTypes.object,
  select_currency:PropTypes.func,
  sell:PropTypes.bool,
  sell_price:PropTypes.string,
  switchItem:PropTypes.func,
  user_collection:PropTypes.array
}

// PropTypes

export default QuoteLayout
