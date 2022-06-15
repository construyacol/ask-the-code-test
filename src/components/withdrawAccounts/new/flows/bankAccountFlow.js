import React, { Component, Fragment } from "react";
import { InputButton } from "../../../widgets/buttons/buttons";
import { InputForm } from "../../../widgets/inputs";
import DropDownContainer from "../../../widgets/inputs/dropdownContainer";
import { ButtonForms } from "../../../widgets/buttons/buttons";
import ItemSelectionContainer from "../../../widgets/items/ItemSelectionContainer";
import ItemLayout from "../../../widgets/items/itemLayout";
// import bank from "../../../../assets/bank.png";
import { getCdnPath } from '../../../../environment'
import SimpleLoader from "../../../widgets/loaders";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../../actions";
import {
  serveBankOrCityList,
  addIndexToRootObject,
  objectToArray,
} from "../../../../utils"; 
// import { doLogout } from '../../../utils'
// import MVList from "../../../widgets/itemSettings/modal_views/listView";
import { createSelector } from "reselect";
import withKeyActions from "../../../withKeyActions";
import DialogWAccount from '../../dialog'

// const dropDawnElements = [
//   {name:'ahorro'},
//   {name:'corriente'},
// ]
//
// const dropDawnElements2 = [
//   {name:'ahorro', id:1},
//   {name:'corriente', id:2},
// ]

class BankAccountFlow extends Component {
  state = {
    banks: null,
    cities: null,
    loader: false,
  }; 

  componentDidMount() {
    this.initComponent();
    this.props.actualizarEstado({
      target: {
        name: "provider_type",
        value: "bank",
      },
    });
  }

  initComponent = async () => {

    const { withdraw_providers_list, withdrawProviders } = this.props;

    this.setState({ loader: true });

    let res = withdraw_providers_list;
    // console.log('withdraw_providers_list', withdraw_providers_list)
    if (!res || (res && !res.length)) {
      return
      // return doLogout('?message=Vuelve a iniciar session');
    }

    const efectyProvider = withdrawProviders?.find(wP => wP?.name === 'efecty');
    let bank_list = res && {...res[0].info_needed.bank_name};

    if(efectyProvider){
      bank_list = {"efecty":{...efectyProvider, ui_name:efectyProvider?.provider.ui_name}, ...bank_list}
    }
    // let city_list = res && res[0].info_needed.city;


    let serve_bank_list = await serveBankOrCityList(bank_list, "bank"); 
    // let serve_city_list = await serveBankOrCityList(city_list, "city");
    // console.log('============================================================== serve_bank_list', serve_bank_list)

    let id_types_object = await addIndexToRootObject(
      res && res[0].info_needed.id_type
    );
    let id_type_list = await objectToArray(id_types_object);

    let account_type_object = await addIndexToRootObject(
      res && res[0].info_needed.account_type
    );
    let account_type_list = await objectToArray(account_type_object);
    // console.log('|||||||||||||||||||||||||| °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°| account_type_list |', account_type_list)
    // debugger
    // console.log(' --- - - - - -- - - - - -  °°°°|||||°°°   : BANK LIST', serve_bank_list)
    // console.log(' --- - - - - -- - - - - -  °°°°|||||°°°   : VIRGIN BANK', bank_list)

    await this.props.actualizarEstado({
      target: { name: "currency", value: res[0].currency },
    });
    // console.log('|||||||||||||||||||||||||||||||||||||||||||serve_bank_list', serve_bank_list)

    this.setState({
      banks: serve_bank_list,
      // cities: serve_city_list,
      id_types: id_type_list, //tipos de documentos disponibles para indicar con el que se abrio la cuenta de retiro
      account_types: account_type_list, //tipos de cuentas bancarias disponibles
      loader: false,
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if(this.props.short_name && this.props.withdraw_providers_list && this.props.withdraw_providers_list[0]){
        const info_needed = {...this.props.withdraw_providers_list && this.props.withdraw_providers_list[0].info_needed}
        const shortName = this.props.short_name
        const accountTypes = info_needed.bank_name[shortName] && info_needed.bank_name[shortName].compatible_account_types.map((accountId)=>{
          return {...info_needed.account_type[accountId], enabled:true}
        })
        console.log('===================================0 accountTypes ',  accountTypes, info_needed)
        if(accountTypes){
          this.setState({
            account_types:accountTypes
          })
        }
        // console.log('accountTypes',  accountTypes)
        // console.log('===================================0 CHANGES ',  info_needed.bank_name)
      }

    }
  }

  update_city = (payload) => {
    // console.log('CITY SELECT',payload)

    let body = {
      target: {
        name: "city",
        value: payload.code,
      },
    };

    this.props.actualizarEstado(body);
  };

  updateIdType = (e) => {
    e.persist && e.persist();
    this.props.actualizarEstado(e)
    let _idType = e?.target?.value
    const idTypeEnabled = this.props?.idTypes && this.props?.idTypes[_idType]
    if(["newIdentity"].includes(idTypeEnabled?.value)){
      let idTypeDialog = document.querySelector("#idTypeDialog")
      console.log(idTypeDialog.showModal())
    }
  }
 
  render() {
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
      actualizarEstado,
      // city,
      final_step_create_account,
      id_type,
      // id_number,
      // user,
      idAccept,
      osDevice
    } = this.props;

    const { banks, loader } = this.state;
    const idTypeEnabled = this.props?.idTypes && this.props?.idTypes[id_type]
    console.log('|||||||||||  enabledValidation  ==>  ',id_type, this.props?.idTypes )

    let enabledValidation = bank_name === 'efecty' ? idTypeEnabled?.enabled : ((account_type && account_number) && idTypeEnabled?.enabled)

    return (
      <Fragment>
        {step === 2 && (
          <div className="nBstep1 fuente">
            <div className="titleNewAccount">
              <img src={`${getCdnPath('assets')}bank.png`} alt="" height="70" />
              <p style={{ fontWeight:'bold' }}>
                Crea una cuenta de retiro
              </p>
            </div>

            <p className="nBtextInit fuente">
               Son las cuentas a las que envías COP desde Coinsenda. Por ejemplo: Tu cuenta bancaria.
            </p>

            <div id="bankChooseButton" className={`${osDevice}`}>
              <ButtonForms
                _id={idAccept}
                type="primary"
                active={true}
                siguiente={siguiente}
              >
                Comencemos
              </ButtonForms>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step1">
            <form onSubmit={handleSubmit} className="NWithdrawAccountFlow">
              <div className="titleAccountFlow">
                <h1 className="DLtitles2 fuente">Elige la entidad de la cuenta que quieres agregar</h1>
              </div>
              {loader ? (
                <SimpleLoader label="Cargando..." />
              ) : (
                <ItemSelectionContainer
                  type="banks"
                  autoFocus={true}
                  items={banks}
                  format="svg"
                  itemSelect={bank_name}
                  actualizarEstado={actualizarEstado}
                  handleSubmit={handleSubmit}
                  update_control_form={update_control_form}
                />
              )}

              <div id="bankChooseButton" className={`${osDevice}`}>
                <InputButton
                  id={idAccept}
                  preventSubmit={true}
                  label="Continuar"
                  type="primary"
                  active={search.length === 1 && bank_name !== ""}
                />
              </div>
            </form>
          </div>
        )}

        {(step === 4 || step === 5) && (
          <div className="step2">
            <div
              id="contMsg"
              className="contMsg"
              style={{
                gridTemplateRows:
                  step === 4 ? "auto 1fr 15vh" : step >= 5 ? "auto 1fr" : "",
              }}
            >
              <div className="nBcontBank">
                <ItemLayout
                  format="svg"
                  actives={true}
                  type="bank"
                  code={short_name}
                  name={bank_name}
                />
              </div>

              {step === 4 && ( 
                <form className="formAccountFlow" onSubmit={async(e) => {
                  await handleSubmit(e)
                  final_step_create_account(e)
                }}>
                  <div className="contForminputsAccount accountSettings_">
                  {
                    bank_name !== 'efecty' &&
                    <>
                      <DropDownContainer
                        placeholder="Tipo de cuenta"
                        elements={this.state.account_types}
                        label="Elige el tipo de cuenta:"
                        actualizarEstado={actualizarEstado}
                        name="account_type"
                        selected={account_type}
                        active={account_type && account_number && idTypeEnabled?.enabled}
                      />

                      <InputForm
                        type="text"
                        label="Escribe el número de tu cuenta"
                        placeholder="Ej: 1123321..."
                        name="account_number"
                        autoFocus={true}
                        actualizarEstado={actualizarEstado}
                        active={account_type && account_number && idTypeEnabled?.enabled}
                        value={account_number}
                        handleKeyPress={handleKeyPress}
                        status={statusInput}
                      />
                    </>
                  }
                    

                    <DropDownContainer
                      placeholder="Documento de identidad"
                      elements={this.props.idTypesList}
                      label="Elige el documento vinculado a tu cuenta de retiro:"
                      actualizarEstado={this.updateIdType}
                      name="id_type"
                      selected={id_type}
                      active={enabledValidation}
                    />
                  </div>

                   
                  <div id="bankChooseButton" className={`contbuttonAccount ${osDevice}`}>
                    <InputButton
                      id={idAccept}
                      preventSubmit={true}
                      label="Continuar"
                      type="primary"
                      active={enabledValidation}
                    />
                  </div>
                </form>
              )}

            </div>
          </div>
        )}
            <DialogWAccount idType={idTypeEnabled}/>
      </Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

const selectWithdrawProviders = createSelector(
  [
    (state) => state.modelData.user.withdrawProviders,
    (state) => state.modelData.withdrawProviders,
  ],
  (_withdrawProviders, withdrawProviders) => {
    const withdraw_providers_list = [];
    _withdrawProviders &&
      _withdrawProviders.map((wp) => {
        if (withdrawProviders[wp].provider_type !== "bank") {
          return false;
        }
        return withdraw_providers_list.push(withdrawProviders[wp]);
      });
    return withdraw_providers_list;
  }
);

function mapStateToProps(state, props) {

  const { user } = state.modelData;
  const { osDevice } = state.ui
  let idTypesList = []
  if(props?.idTypes){
    idTypesList = Object.keys(props?.idTypes).map(idTypeKey => {
      return props?.idTypes[idTypeKey]
    })
    console.log('idTypesList', idTypesList)
  }


  return {
    withdraw_providers_list: selectWithdrawProviders(state),
    user: user,
    current: state.form.current,
    osDevice,
    idTypesList
  };
  
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withKeyActions(BankAccountFlow));
