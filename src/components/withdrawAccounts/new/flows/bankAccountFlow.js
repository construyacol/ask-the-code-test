import React, { Component, Fragment } from 'react'
import { InputButton } from '../../../widgets/buttons/buttons'
import { InputForm } from '../../../widgets/inputs'
import DropDownContainer from '../../../widgets/inputs/dropdownContainer'
import {ButtonForms} from '../../../widgets/buttons/buttons'
import ItemSelectionContainer from '../../../widgets/items/ItemSelectionContainer'
import ItemLayout from '../../../widgets/items/itemLayout'
import bank from '../../../../assets/bank.png'
import SimpleLoader from '../../../widgets/loaders'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../../actions'
import { serveBankOrCityList } from '../../../../services'
import MVList from '../../../widgets/itemSettings/modal_views/listView'

const dropDawnElements = [
  {name:'ahorro', id:1},
  {name:'corriente', id:2},
]


class BankAccountFlow extends Component{

  componentDidMount(){

    this.initComponent()
    this.props.actualizarEstado({
      target:{
        name:"provider_type",
        value:"bank"
      }
    })
  }

  state={
    banks:null,
    cities:null,
    loader:false
  }


  initComponent = async() =>{

    const {
      user,
      // provider_type
      withdraw_providers_list
    } = this.props

    this.setState({loader:true})

    // let res = await this.props.action.get_withdraw_providers(false ,`{"where": {"country": "${user.country}", "enabled":true, "provider_type":"bank"}}`)
    let res = withdraw_providers_list
    if(!res){return false}
    let bank_list = res && res[0].info_needed.bank_name
    let city_list = res && res[0].info_needed.city


    let serve_bank_list = await serveBankOrCityList(bank_list, 'bank')
    let serve_city_list = await serveBankOrCityList(city_list, 'city')
    // console.log(' --- - - - - -- - - - - -  °°°°|||||°°°   : BANK LIST', serve_bank_list)
    // console.log(' --- - - - - -- - - - - -  °°°°|||||°°°   : VIRGIN BANK', bank_list)

    this.setState({
      banks:serve_bank_list,
      cities:serve_city_list,
      loader:false
    })

  }


  update_city = payload =>{

    // console.log('CITY SELECT',payload)

    let body = {
      target:{
        name:"city",
        value:payload.code
      }
    }

    this.props.actualizarEstado(body)

  }


  render(){

    const {
      statusInput,
      handleKeyPress,
      short_name,
      siguiente,
      update_control_form,
      handleSubmit,
      account_number,
      account_type,
      bank_name,
      step,
      search,
      name,
      actualizarEstado,
      city,
      final_step_create_account
    } = this.props

    const {
      banks,
      cities,
      loader
    } = this.state

    // console.log('|||||| Modelito cities::', cities)

      return(
        <Fragment>
          {
            step === 2 &&
            <div className="nBstep1 fuente">
              <div className="titleNewAccount">
                <img src={bank} alt="" height="70"/>
                <p>Genial <strong>{name}</strong></p>
              </div>
              <p className="nBtextInit"> Al añadir una cuenta bancaria para realizar tus retiros de pesos colombianos <strong>(COP)</strong>  por primera vez, tarda en promedio <strong>2 horas habiles</strong> a partir de su inscripción, para que esta sea aprobada por la entidad bancaria, una vez tu cuenta haya sido aprobada, tus retiros serán casi inmediatos</p>

              <div id="bankChooseButton">
                <ButtonForms type="primary" active={true} siguiente={siguiente}>OK, comencemos</ButtonForms>
              </div>

            </div>
          }

          {
            step === 3 &&
            <div className="step1">
              <form
                  onSubmit={handleSubmit}
                >

                <div className="titleAccountFlow">
                  <h1 className="DLtitles2">Elige la entidad bancaria</h1>
                  <p className="fuente DLstitles">asociada a la cuenta:</p>
                </div>
                {
                  loader ?
                  <SimpleLoader label="Cargando..."/>
                  :
                  <ItemSelectionContainer
                      type="banks"
                      items={banks}
                      itemSelect={bank_name}
                      actualizarEstado={actualizarEstado}
                      handleSubmit={handleSubmit}
                      update_control_form={update_control_form}
                    />
                }

                <div id="bankChooseButton">
                  <InputButton label="Continuar" type="primary" active={search.length==1}/>
                </div>

              </form>
            </div>
          }

          {
            (step === 4 || step === 5 || step === 6) &&
            <div className="step2">
              <div className="contMsg" style={{
                  gridTemplateRows:step === 4 ? 'auto 1fr 15vh' :
                  step >= 5 ? 'auto 1fr' : ''
              }}>

                <div className="nBcontBank">
                  <ItemLayout actives={true} type="bank" code={short_name} name={bank_name}/>
                </div>
                {
                  step === 4 &&
                  <Fragment>
                    <p className="nBtextInit">Es de vital importancia que esta cuenta <strong>{bank_name}</strong> sea de tu propiedad <strong>{name}</strong>, de lo contrario se invalidarán las transacciones y es posible que tus fondos queden congelados hasta nuevo aviso.</p>

                    <div id="bankChooseButton" className="contbuttonAccount">
                      <ButtonForms type="primary" active={true} siguiente={siguiente}>Entiendo, es mi cuenta</ButtonForms>
                    </div>

                  </Fragment>
                }

                {
                  step === 5 &&
                  <form
                    className="formAccountFlow"
                    onSubmit={handleSubmit}
                    >
                      <div className="contForminputsAccount">

                        <DropDownContainer
                          elements={dropDawnElements}
                          label="Elige el tipo de cuenta:"
                          actualizarEstado={actualizarEstado}
                          active={account_type && account_number}
                        />

                      <InputForm
                        type="number"
                        label="Escribe el numero de cuenta"
                        placeholder="Ej. 1123321..."
                        name="account_number"
                        actualizarEstado={actualizarEstado}
                        active={account_type && account_number}
                        value={account_number}
                        handleKeyPress={handleKeyPress}
                        status = {statusInput}
                      />

                    </div>
                    <div id="bankChooseButton" className="contbuttonAccount">
                      <InputButton label="Continuar" type="primary" active={account_type && account_number}/>
                    </div>

                  </form>
                }

                {
                  step === 6 &&
                  <form
                    className="formAccountFlow"
                    onSubmit={final_step_create_account}
                    >
                      <div className="contListCities">
                        <p className="fuente labelText">¿desde que ciudad abriste esta cuenta bancaria?</p>
                        <MVList
                          list={cities}
                          noIcon={true}
                          theme="classic"
                          actualizarEstado={this.update_city}
                          current_item={city}
                          name_item="city"
                        />
                      </div>
                      <div className="momContbuttonAccount">
                        <div id="bankChooseButton" className="contbuttonAccount">
                          <InputButton label="Crear cuenta" type="primary" active={city}/>
                        </div>
                      </div>

                  </form>
                }
              </div>
            </div>
          }
        </Fragment>
      )
  }

}

function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}
function mapStateToProps(state, props){
  // console.log(' --- - - - - -- - - - - -  °°°°|||||°°°   : mapStateToProps withdraw PROVIDERS', state)
  const { user, user_id, withdraw_providers  } = state.model_data

  let withdraw_providers_list = user[user_id].withdraw_providers.map((wp)=>{
    return withdraw_providers[wp]
  })

  return{
    withdraw_providers_list:withdraw_providers_list,
    user:user[user_id]
  }

}

export default connect(mapStateToProps, mapDispatchToProps) (BankAccountFlow)
