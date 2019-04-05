import React, { Component, Fragment } from 'react'
import { countries } from '../../../api/ui/settingList/country.json'
import { currencies } from '../../../api/ui/settingList/currencies.json'
import ItemListView from './listItemView'
import { InputForm } from '../../inputs'
import { matchItem } from '../../../../services'
import './listView.css'

import './viewSettings.css'

// @Params
// list => Lista de items que alimenta el componente Obj={name, code}
// noIcon => Define si se mostrarán iconos en la lista
// iconType => Definimos el formato de la imagen que vendrá en el modelo => img || svg
// type => Recibe como parametro "country" || "currencies" que son las listas precargadas en el componente
// noFindbar => true/false define si el componente trae buscador o no
// theme => Tema visual del componente (classic) || (ultimate) || (ultimate_classic)
// external_findbar => define si el componente adapta un buscador externo
// external_findbar_data => Datos que recibe el componente, de la fuente externa (componente padre)
// export_result => función para exportar el resultado de una busqueda al componente padre, utilizado solo cuando hay un external_findbar

class MVList extends Component {


  state = {
    select_id:null,
    current_item:null,
    current_list:this.props.list ? this.props.list : this.props.type === 'country' ? countries : currencies,
    search:[]
  }

  componentWillReceiveProps(nextProps){
  }





    componentDidMount(){
      if(this.props.current_item){
        this.findCurrentItem(this.props.current_item)
      }
    }

  findCurrentItem = async itemReview =>{
    let result = await matchItem(this.state.current_list, {primary:itemReview}, 'code')
    if(!result){return false}
    let item = result[0]
    this.setState({
      select_id:item.id,
      current_item:item
    })
    // this.props.actualizarEstado(item)
  }


  item_selection = async(item) =>{
    // console.log('||||item_selection', item)
    const{
      id,
      code
    } = item
    this.setState({
      select_id:id,
      current_item:item
    })

    // this.props.actualizarEstado(item)

    if(this.props.external_findbar){
      // console.log('item selection with external findbar')
      let body = {target:{name:"", value:code}}
      await this.update(body)
    }

  }


  update = async({target}) =>{

    const {value} = target
    const {current_list} = this.state

    let result = await matchItem(current_list, {primary:value.toLowerCase()}, 'name', true)
    if(!result || result && result.length>1 || result.length === 0){
      this.unSelection()
    }
    if(result && result.length>0){
        if(result.length === 1){
          this.visiblePosition(result[0], current_list)
          if(this.props.external_findbar){
            this.props.export_result(result[0])
          }
        }
        return this.setState({
          select_id:result.length === 1 ? result[0].id : this.state.select_id,
          search:result
        })
    }
  }


  unSelection = () => {
    let body = {
      target:{
        name:this.props.name_item,
        value:""
      }
    }
    this.setState({
      select_id:null,
      current_item:null
    })
    // this.props.actualizarEstado(body)
  }


  visiblePosition = (result, current_list) =>{
    let new_array = []
    new_array.push(result)
    current_list.map((item)=>{
      if(item.id === result.id){return false}
      new_array.push(item)
    })
    this.setState({
      current_list:new_array,
      current_item:result
    })

    if(!this.props.external_findbar){
      this.item_selection(result)
    }
  }


  render(){

    const {
      type,
      list,
      noIcon,
      noFindbar,
      theme,
      iconType
    } = this.props

    const {
      select_id,
      current_list,
      search,
      current_item
    } = this.state

    // console.log('||||||||| - -- - - ', current_list)
    // let current_list = list ? list : type === 'country' ? countries : currencies

    return(
      <section className={`contListItemMV ${theme}`} style={{paddingTop:noFindbar ? '10px' : '60px'}}>
        <div className={`findbar ${theme}`} style={{display:noFindbar ? 'none' : 'grid' }}>
          <InputForm
            type="text"
            // name="account_name"
            actualizarEstado={this.update}
            // active={search.length==1 && account_name}
            placeholder={current_item ? current_item.name : "Ej. Cali, Medellin, Bogotá" }
          />
        </div>
        {
          search.length>0 ?

          search.map(item=>{
            return(
              <ItemListView
                key={item.id}
                noIcon={noIcon}
                item_selection={this.item_selection}
                item_active={select_id}
                item={item}
                theme={theme}
                iconType={iconType}
              />
            )
          })

          :

          current_list.map(item=>{
            return(
              <ItemListView
                key={item.id}
                noIcon={noIcon}
                item_selection={this.item_selection}
                item_active={select_id}
                item={item}
                theme={theme}
                iconType={iconType}
              />
            )
          })
        }
      </section>
    )
  }

}

export default MVList
