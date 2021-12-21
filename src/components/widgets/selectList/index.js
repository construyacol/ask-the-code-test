import React from 'react'
import DropDownComponent from './dropDownFilter'
import { Container } from './dropDownFilter/styles'


const SelectList = ({ actionHandle, list, selectedItem }) => {

  // @param {Object} list {[key]:{name:ui_name, value:value}} ej: { deposits:{ name:"Depósitos", value:"deposits" } }
  // @param {String} selectedItem 

  return(
    <Container>
      { 
        (list) ?
          <DropDownComponent
            list={list}
            selectedItem={selectedItem}
            actionHandle={actionHandle}
          /> 
          :
          <p>
            Cargando...
          </p>
      }
    </Container>
  )

}




export default SelectList
