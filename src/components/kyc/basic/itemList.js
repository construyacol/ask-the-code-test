import React, { Component } from 'react'
import Environtment from '../../../environment'
const { CountryUrl } = Environtment

class ItemListKycBasic extends Component {


  itemSelection = () => {
    const { item } = this.props
    this.props.select_item(item)
  }

  render(){

    const { item, active, suffixText } = this.props

    const {
      name,
      flag
     } = item

    // console.log('ItemListKycBasic', item)

    return(
      <div className={`ItemListKycBasic ${active ? 'active' : ''}`} onClick={this.itemSelection}>
        <p className="fuente">
          {
            flag &&
            <img src={`${CountryUrl}${flag}`} alt="" width={30}/>
          }
          {name}
          {suffixText && ` | ( ${suffixText} )`}
        </p>
      </div>
    )

}

}

export default ItemListKycBasic
