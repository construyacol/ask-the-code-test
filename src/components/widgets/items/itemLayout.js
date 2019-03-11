import React, { Component } from 'react'

class ItemLayout extends Component {

      chambea = () => {

        const {
          name,
          code,
          currency_type,
          pair_id,
          id
        } = this.props

         this.props.actualizarEstado(name, code, currency_type, pair_id)
      }

  render(){

  const { type, actives, name, code, placeholder } = this.props

  return(
    <div className={type==='payment_method'?'ILtuvieja':''}>
        <div className={`item ${actives ? 'itemSelection': ''}`} onClick={(!actives) ? this.chambea : null}>
           {/* // <div className={`item ${actives ? 'itemSelection': ''}`} onClick={this.chambea}> */}

            {
              (type === "coins" || type === "payment_method" || type === "service_mode") ?


                   actives ?
                     <div title={name} id={code}>
                       {
                         type === 'bank' &&
                         <img className="itemSobre activaos"  src={require(`./assets/bank/${code}.png`)} alt="" width="60"/>
                       }
                       <img className="itemSobre activaos"  src={require(`./assets/${type}/${code}2.png`)} alt="" width="60"/>
                     </div>
                     :
                     <div title={name} id={code}>
                       <img className="itemFuera" src={require(`./assets/${type}/${code}.png`)} width="60" alt="" id={code} title={name} />
                       <img className="itemSobre"  src={require(`./assets/${type}/${code}2.png`)} width="60" alt="" id={code} title={name} />
                     </div>
                :
               <img className={`banquis ${actives ? 'itemVisible': ''}`} src={require(`./assets/${type}/${code}.png`)} alt="" id={code} title={name} width="85"/>
            }
             <p title={name}>{name}</p>
          </div>
          {
            placeholder &&
            <div className="dimeloPuti">
              {
                placeholder.map(item=>{
                  return <p className="ILplaceholder fuente" key={item.id}>{item.name}</p>
                })
              }
            </div>
          }
      </div>
  )

}
}

export default ItemLayout
