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
import { serveBankOrCityList, add_index_to_root_object, objectToArray } from '../../../../services'
import MVList from '../../../widgets/itemSettings/modal_views/listView'

// const dropDawnElements = [
//   {name:'ahorro'},
//   {name:'corriente'},
// ]
//
// const dropDawnElements2 = [
//   {name:'ahorro', id:1},
//   {name:'corriente', id:2},
// ]



class BankAccountFlow extends Component{

  async componentDidMount(){

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

    let id_types_object = await add_index_to_root_object(res && res[0].info_needed.id_type)
    let id_type_list = await objectToArray(id_types_object)

    let account_type_object = await add_index_to_root_object(res && res[0].info_needed.account_type)
    let account_type_list = await objectToArray(account_type_object)
    // console.log('|||||||||||||||||||||||||| °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°| withdraw_providers_list |', res[0])
    // console.log(' --- - - - - -- - - - - -  °°°°|||||°°°   : BANK LIST', serve_bank_list)
    // console.log(' --- - - - - -- - - - - -  °°°°|||||°°°   : VIRGIN BANK', bank_list)

    await this.props.actualizarEstado({target:{name:'currency', value:res[0].currency}})

    this.setState({
      banks:serve_bank_list,
      cities:serve_city_list,
      id_types:id_type_list, //tipos de documentos disponibles para indicar con el que se abrio la cuenta de retiro
      account_types:account_type_list, //tipos de cuentas bancarias disponibles
      loader:false
    })

  }


componentDidUpdate(prevProps){

  if(prevProps !== this.props){
    // console.log('|||||_________________user? ', this.props.user.id_type, this.props.id_type)
  }

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
      final_step_create_account,
      id_type,
      id_number
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
              <p className="nBtextInit fuente"> Al añadir una cuenta bancaria para realizar tus retiros de pesos colombianos <strong>(COP)</strong>  por primera vez, tarda en promedio <strong>2 horas habiles</strong> a partir de su inscripción, para que esta sea aprobada por la entidad bancaria, una vez tu cuenta haya sido aprobada, tus retiros serán casi inmediatos</p>

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
                  className="NWithdrawAccountFlow"
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
                      format="svg"
                      itemSelect={bank_name}
                      actualizarEstado={actualizarEstado}
                      handleSubmit={handleSubmit}
                      update_control_form={update_control_form}
                    />
                }

                <div id="bankChooseButton">
                  <InputButton label="Continuar" type="primary" active={search.length===1}/>
                </div>

              </form>
            </div>
          }

          {
            (step === 4 || step === 5 || step === 6) &&
            <div className="step2">
              <div id="contMsg" className="contMsg" style={{
                  gridTemplateRows:step === 4 ? 'auto 1fr 15vh' :
                  step >= 5 ? 'auto 1fr' : ''
              }}>

                <div className="nBcontBank">
                  <ItemLayout format="svg" actives={true} type="bank" code={short_name} name={bank_name}/>
                </div>
                {
                  step === 4 &&
                  <Fragment>

                    <form
                      className="formAccountFlow grid-disable"
                      onSubmit={handleSubmit}
                      >
                        <div className="contInfoIdType">
                          <p className="nBtextInit fuente">Es de vital importancia que esta cuenta <strong>{bank_name}</strong> sea de tu propiedad <strong>{name}</strong>, de lo contrario se invalidarán las transacciones y es posible que tus fondos queden congelados hasta nuevo aviso.</p>
                          <div className="contForminputsAccount">

                            <DropDownContainer
                              placeholder="ej. Cedula de ciudadanía, Pasaporte etc"
                              name='id_type'
                              elements={this.state.id_types}
                              label="Elige el tipo de documento con el cual abriste la cuenta bancaria:"
                              actualizarEstado={actualizarEstado}
                              active={(this.props.id_type && this.props.user.id_type === this.props.id_type) || (id_type && id_number)}
                            />

                            {
                              this.props.id_type && (this.props.user.id_type !== this.props.id_type) &&
                              <InputForm
                                type="text"
                                label="Escribe el numero de documento de identidad"
                                placeholder="Ej. 1123321..."
                                name="id_number"
                                actualizarEstado={actualizarEstado}
                                active={id_type && id_number}
                                value={account_number}
                                handleKeyPress={handleKeyPress}
                                status = {statusInput}
                              />
                            }



                        </div>
                        </div>

                      <div id="bankChooseButton" className="contbuttonAccount">
                        <InputButton label="Continuar" type="primary"
                          active={(this.props.id_type && this.props.user.id_type === this.props.id_type) || (id_type && id_number)}
                        />
                      </div>
                    </form>

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
                          placeholder="ej. Cuenta Corriente"
                          elements={this.state.account_types}
                          label="Elige el tipo de cuenta:"
                          actualizarEstado={actualizarEstado}
                          name='account_type'
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
                    className="formAccountFlow city"
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
  const { user, user_id, withdraw_providers  } = state.modelData

  let withdraw_providers_list = []
  user[user_id].withdraw_providers.map((wp)=>{
    if(withdraw_providers[wp].provider_type !== 'bank'){return false}
    return withdraw_providers_list.push(withdraw_providers[wp])
  })

  // console.log('---------------------------SIRVIENDO PROVEEDORES', withdraw_providers_list)


  return{
    withdraw_providers_list:withdraw_providers_list,
    user:user[user_id]
  }

}

export default connect(mapStateToProps, mapDispatchToProps) (BankAccountFlow)
