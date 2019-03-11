import React, { Component, Fragment } from 'react'
import IconSwitch from '../../icons/iconSwitch'

class ItemListView extends Component{



itemSelect = () => {
  const{
    item
  } = this.props
  
  this.props.item_selection(item)
}

  render(){

    const {
      noIcon,
      item_active,
      item
    } = this.props

    const {
      id,
      code,
      name,
    } = item

    const atributos = {
        icon:code,
        size:40
    }

    // console.log('|||||||| ItemListView icon ////', parseInt(item_active), id)

    return(
      <div id={`${id}`} className={`ItemlistViewart ${parseInt(item_active) === parseInt(id) ? 'itemActiveListView' : ''}`} style={{gridTemplateColumns:noIcon ? '1fr' : '60px 1fr' }} onClick={this.itemSelect}>
        {
          !noIcon &&
          <div className="centerItem" id={`${id}`}>
            <IconSwitch {...atributos}/>
          </div>
        }
            <span id={`${id}`}>{name}</span>
      </div>
    )

  }

}

export default ItemListView
