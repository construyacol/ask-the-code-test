import React, { Component } from 'react'
import ItemLayout from './itemLayout'
import InputForm from '../inputs'
import { ItemSelected } from '../buttons/buttons'
import { connect } from 'react-redux'
import { banks, remittance } from '../../api/ui/api.json'
import actions from '../../../actions'
import { bindActionCreators } from 'redux'
import SimpleLoader from '../loaders'
import withCoinsendaServices from '../../withCoinsendaServices'

import './items.css'

class ItemSelectionContainer extends Component {

  state = {
    placeholder: this.props.type === "coins" ? "ej: Bitcoin" : "ej: Bancolombia",
    selected: this.props.selected,
    coincidencia: "",
    items: this.props.items
    // items: this.props.type === "coins" ? coins : banks
  }

  componentDidMount() {
    const {
      items
    } = this.state
    if (items) { return false }
    this.load_items(this.props.type)
  }

  load_items = async (items_type) => {
    let items
    if (items_type === 'coins') {
      items = this.props.coins ? this.props.coins : await this.props.coinsendaServices.fetchAllCurrencies()
    }
    if (items_type === 'banks') {
      items = banks
    }
    if (items_type === 'remittance') {
      items = remittance
    }

    // remittance
    this.setState({
      items: items
    })
  }

  actualizar = async (event) => {

    const value = event.target.value
    // console.log('ACTUALIZANDO ESTADOOOOOOO - - - -- - - -- - ', value)
    await this.buscarItemStore(value)
    let coincidencia = { name: "", code: "" }

    //si tenemos una coincidencia con el valor buscado, extraemos el nombre de la coincidencia y actualizamos el estado del formulario
    if (this.props.search.length < 2) {
      this.state.items.filter((item) => {
        let query = value.toLowerCase()
        if (item.name.toLowerCase().includes(query)) {
          this.setState({
            selected: true,
            coincidencia: item.name.toLowerCase()
          })
          return coincidencia = item
        }
        return false
      })
    }

    const { current } = this.props
    const estado = {
      target: {
        name: current === "wallets" ? "currency" : current === "bank" ? "bank_name" : "deposit_service",
        value: coincidencia.name.toLowerCase(),
        short_name: coincidencia.code.toLowerCase()
      }
    }

    this.props.actualizarEstado(estado)
    // console.log('esta es la coincidencia', coincidencia)
    // console.log('VALOR BOOLEANO COINCIDENCIA', !coincidencia ? false : true)
  }


  buscarItemStore = async (item_name, isEqual) => {
    // console.log('buscarItemStore',item_name, this.props.current, this.state.items)
    await this.props.action.Search(item_name, this.props.current, this.state.items, isEqual)
    this.props.update_control_form(item_name)
  }

  seleccionarItem = (name, short_name) => {
    this.setState({
      coincidencia: name,
      selected: true
    })
    const { current } = this.props

    const estado = {
      target: {
        name: current === "wallets" ? "currency" : (current === "bank" || current === "withdraw") ? "bank_name" : "deposit_service",
        value: name,
        short_name: short_name
      }
    }

    this.buscarItemStore(name, true)
    this.props.actualizarEstado(estado)

  }


  close = () => {
    if(this.props.clearItem){
      this.props.clearItem()
    }
    this.setState({
      selected: false,
      placeholder: this.props.type === "coins" ? "ej: Bitcoin" : "ej: Bancolombia"
    })
    return this.buscarItemStore("")
  }




  render() {
    const { search, buttonActive, itemSelect, label } = this.props
    const { items } = this.state

    // console.log('this.state.selected  ', this.state, search)
    return (
      <section className="ItemSelectionContainers" id="itemSelect">

        {
          this.state.selected ?

            <ItemSelected
              close={this.close}
              label={label}
              active={itemSelect || search.length}
              value={itemSelect || (search.length && search[0].currency)}
            >
              {this.state.coincidencia || itemSelect || search.length && search[0].currency}
            </ItemSelected>

            :

            <InputForm
              type="text"
              autoFocus={this.props.autoFocus}
              label={label}
              placeholder={this.state.placeholder}
              name="currency"
              actualizarEstado={this.actualizar}
              active={buttonActive}
            />
        }

        <div className="ItemSelectionContainer">
          {
            !this.state.items ?
              <SimpleLoader />
              :
              <div className="containerItems">
                {
                  // si tenemos una busqueda renderize a partir de la busqueda
                  search.length > 0 ?
                    search.length < 2 ?
                      // validamos si dentro de la busqueda hay una sola coincidencia, si la hay actualizamos el estado y la autoseleccionamos
                      search.map(item => {
                        return <ItemLayout actualizarEstado={this.seleccionarItem} actives={true} {...item} key={item.id} format={this.props.format} />
                      })
                      :
                      //Si hay mas de 1 coincidencia, solo mostramos los items inactivos resultantes de la busqueda
                      search.map(item => {
                        return <ItemLayout actualizarEstado={this.seleccionarItem} {...item} key={item.id} format={this.props.format} />
                      })
                    :
                    // sino tenemos busqueda renderice todos los items
                    items.map(item => {
                      return <ItemLayout actualizarEstado={this.seleccionarItem} {...item} key={item.id} format={this.props.format} />
                      // return <ItemLayout actualizarEstado={this.handleClick} {...item} key={item.id}/>
                    })
                }
              </div>
          }
        </div>
      </section>
    )
  }
}


function mapStateToProps(state, props) {

  // console.log('R E N D E R I Z A N D O', state, state.form.current)

  const {
    form_control_deposit,
    form_deposit,
    current,
    search_coin,
    search_bank,
    form_wallet,
    form_bank,
    form_control_wallet,
    form_control_bank,
    search_deposit
  } = state.form

  const {
    currencies
  } = state.modelData

  return {
    search: current === 'wallets' ? search_coin : (current === 'bank' || current === 'withdraw') ? search_bank : search_deposit,
    form: current === 'wallets' ? form_wallet : (current === 'bank' || current === 'withdraw') ? form_bank : form_deposit,
    buttonActive: current === 'wallets' ? form_control_wallet : (current === 'bank' || current === 'withdraw') ? form_control_bank : form_control_deposit,
    selected: current === 'wallets' ? (search_coin.length === 1 ? true : false) : (current === 'bank' || current === 'withdraw') ? (search_bank.length === 1 ? true : false) : (search_deposit.length === 1 ? true : false),
    current: current,
    coins: currencies
  }

}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withCoinsendaServices(ItemSelectionContainer))
