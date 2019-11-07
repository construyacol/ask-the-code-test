import React, { useEffect, useState, Fragment  } from 'react'
import ScrollMagic from 'scrollmagic'
import { currencies } from '../../api/ui/implemented_currencies/currencies.json'
import IconSwitch from '../../widgets/icons/iconSwitch'
import ActiveItem from '../../widgets/items/active_item'
import ItemTemplate from '../../widgets/accountList/item_template'
// import Tilt from 'react-tilt'
import '../css/sections.css'


const controller = new ScrollMagic.Controller();


export const CurrencyList = props => {

  const [currencyItem, setCurrency] = useState(currencies[0])

  useEffect(()=>{

    let bitcoin = new ScrollMagic.Scene({
          triggerElement: ".layerStickyTrigger1",
          triggerHook:0.05,
          duration: "100px"
      })
      .addTo(controller);

      bitcoin.on("enter", (event) => {
       setCurrency(currencies[0])
      })

      let ethereum = new ScrollMagic.Scene({
            triggerElement: ".layerStickyTrigger2",
            triggerHook:0.05,
            duration: "100px"
        })
        .addTo(controller);

        ethereum.on("enter", (event) => {
         setCurrency(currencies[1])
        })

      let dash = new ScrollMagic.Scene({
            triggerElement: ".layerStickyTrigger3",
            triggerHook:0.05,
            duration: "100px"
        })
        .addTo(controller);

        dash.on("enter", (event) => {
         setCurrency(currencies[2])
        })

      let litecoin = new ScrollMagic.Scene({
            triggerElement: ".layerStickyTrigger4",
            triggerHook:0.05,
            duration: "100px"
        })
        .addTo(controller);

        litecoin.on("enter", (event) => {
         setCurrency(currencies[3])
        })

        return (()=>{
          controller.removeScene([
            bitcoin,
            ethereum,
            dash,
            litecoin
          ])
        })

  },[])

// console.log('||||| =========> currency', currencyItem)

  return(
    <Fragment>
      {
        props.left ?
        <div className="CurrencyList">
          <h1 className="fuente titleCurrencyList">Cripto activos</h1>
          <div className="currencyListCont">
            {
              currencies.map((currency)=>{
                return (
                  <div key={currency.red} className={`currencyListItem ${currencyItem.red.toLowerCase() === currency.red.toLowerCase() ? 'active' : ''}`} >

                     <IconSwitch
                       icon={currency.red.toLowerCase()}
                       size={30}
                     />

                     <div className="textCurrencyList">
                       <p className="fuente" >{currency.red}</p>
                       <div className={`currencyStatus ${currencyItem.red.toLowerCase() === currency.red.toLowerCase() ? 'active' : ''}`}>
                         {
                           (currency.red.toLowerCase() === 'bitcoin' ||
                            currency.red.toLowerCase() === 'ethereum') ?
                           <p className="fuente implementedCurrency">
                             <i className="fas fa-check"></i>
                             Disponible
                           </p>
                           :
                           <p className="fuente implementedCurrency No">
                             <i className="far fa-clock"></i>
                             Proximamente
                           </p>
                         }
                       </div>
                     </div>

                     <div className={`conteActiveItem ${currencyItem.red.toLowerCase() === currency.red.toLowerCase() ? 'active' : ''} `}>
                       <ActiveItem/>
                     </div>

                   </div>
                )
              })
            }
          </div>
        </div>




        :

        <Fragment>
          {
            window.innerWidth<768 &&
            <h1 className="fuente titleCurrencyList">Cripto activos</h1>
          }

        <div className="CurrencyCardList">

            <div className="cardListBgItem"></div>
            <div className="cardListBgItem2"></div>

               <ItemTemplate
                 currencies={currencies}
                 currency={currencyItem}
               />

        </div>
        </Fragment>
      }
    </Fragment>


  )
}



export default CurrencyList
