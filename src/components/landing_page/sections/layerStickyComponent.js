import React  from 'react'
import '../css/sections.css'

const LayerStickyComponent = props => {

  let items = []
  // let item_height
  //La altura total del componente es de 150vh, de los 50vh, 15 se guardan de margen para que los elementos queden en posición sticky y así poder iniciar los disparadores, nos queda una diferencia de 35 vh que se dividirá entre la cantidad de elementos configurables
  if(props.config && props.config.trigger_items){
    const { trigger_items } = props.config
    // item_height = 40 / trigger_items
    items = Array.from(Array(trigger_items), (x, index) => index + 1)
  }

  return(
    <div className="LayerStickyComponent" style={{height:`${props.config.height}vh`}}>

      {
        items.length > 1 &&
        <div className="layerTriggers">
          {
            items.map(item => {
              return <div key={item} className={`${props.config.random_class}${item} layerStickyTrigger ${props.scene}`} style={{height:`100px`}}></div>
            })
          }
        </div>
      }

      <div className={`sticyLeft layerPanel ${props.component}`}>
        {props.left}
      </div>

      <div className={`sticyRigth layerPanel ${props.component}`}>
        {props.rigth}
      </div>

    </div>
  )

}

export default LayerStickyComponent
