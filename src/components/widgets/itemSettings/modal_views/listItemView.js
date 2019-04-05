import React, { Component, Fragment } from 'react'
import IconSwitch from '../../icons/iconSwitch'
import ActiveItem from '../../items/active_item'


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
      item,
      theme,
      iconType
    } = this.props


    const {
      id,
      code,
      name,
      flag
    } = item

    const atributos = {
        icon:code,
        size:40
    }

    // console.log('|||||||| ItemListView icon ////', parseInt(item_active), id)

    return(
      <div
        id={`${id}`}
        className={`ItemlistViewart ${parseInt(item_active) === parseInt(id) ? 'itemActiveListView' : ''} ${theme}`}
        style={{gridTemplateColumns:noIcon ? '1fr' : '60px 1fr'}}
        onClick={this.itemSelect}
        style={{gridTemplateColumns:noIcon ? '1fr 90px': '60px 1fr 90px'}}
        >
        {
          !noIcon &&
          <div className="centerItem" id={`${id}`}>
            {
              iconType === 'svg' ?
               <IconSwitch {...atributos}/>
              :
               <img src={flag} alt="" width="30" height="30"/>
            }
          </div>
        }
            <span id={`${id}`} className={`fuente span_text_itemView ${theme}`}>
              {
                // parseInt(item_active) === parseInt(id) && iconType &&
                (parseInt(item_active) === parseInt(id)) &&
                <img src={flag} alt="" width="25" height="25" style={{display:iconType ? 'block' : 'none'}}/>
              }
              {name}
            </span>

            {/* <ActiveItem Anim2={true} color="green"/> */}
        {
          theme === 'ultimate' &&
          <div className={`optionsLIV`}>
            <div className="controlDespegableLIV">
              <div className={` ${parseInt(item_active) === parseInt(id) ? 'forrillo' : 'sinForri'}`}>
                <div className="contDesp">
                  <IconSwitch
                    icon="arrow_right"
                    size={25}
                    color="#38ef7d"
                  />
                </div>
              </div>
              <div className="contActiveItem">
                <ActiveItem Anim2={true} color="green"/>
              </div>
            </div>
          </div>
        }


      </div>
    )
  }
}

export default ItemListView
