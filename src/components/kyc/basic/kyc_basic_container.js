import React, { Component } from "react";
import moment from "moment";
import KycBasicLayout from "./kycBasicLayout";
import { kyc } from "../../api/ui/api.json";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../actions";
import { objectToArray, capitalizeString } from "../../../utils";
import {
  matchItem,
  serveKycData,
  converToInitState,
  extractSelectList,
  FormatCountryList,
} from "../../../utils";
// import SimpleLoader from '../../widgets/loaders'
import ItemListKycBasic from "./itemList";
import withCoinsendaServices from "../../withCoinsendaServices";
import KycSkeleton from './skeleton'

const modelFormData = kyc.kyc_basic.natural;

// nuevo metodo para ejecutar animaciones complejas, para esto debemos crear un objeto con propiedades booleanas que haga las veces de diversos disparadores de metodos donde vayan activando y desactivando (true/false) de forma sincrona distintos eventos en el DOM (añadir/quitar => clases || styles)...
//
// ej: stack:{
//    anim1:true,
//    anim2:false,
//    anim3:true
// }
//
// method = (sub_section) => {
//    await dom_animation_dispatch({stack:{...state.stack, anim1:true}}, 300)    //dom_animation_dispatch({state}, {time to ejecution})
// }
//
// dom_animation_dispatch = (state, time) => {
//    new Promise(resolve, err) =>{
//      setTimeOut(async()=>{
// 	     await this.setState({state})
//        resolve(true)
//     	}, time)
//    }
// }

class KycBasicContainer extends Component {
  state = {
    select_values:{}
  };

  async componentDidMount() {
    await this.init_component();
    // if(this.props.current === 'kyc_basic'){
    this.props.history.push(`?form=personal_names`);
    // }
    document.onkeydown = (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.handleSubmit(event);
      }
    };
  }

  componentWillUnmount() {
    document.onkeydown = false;
  }

  componentDidUpdate(prevProps, nextState) {
    // inserto las siguientes rutas para poder hacer seguimiento al funnel desde hotjar
    if (prevProps.step === this.props.step) {
      return;
    }
    // console.log('||||||||||||||||||||||||||||||| componentDidUpdate KYC BASIC ===> ', prevProps.step, this.props.step, this.props)
    //
    // alert()
    let route;
    //
    if (this.props.step === 1) {
      route = `?form=personal_names`;
    }

    if (this.props.step === 2) {
      route = `?form=personal_surnames`;
    }

    if (this.props.step === 3) {
      route = `?form=personal_birthday`;
    }

    if (this.props.step === 4) {
      route = `?form=personal_phone`;
    }

    if (this.props.step === 5) {
      route = `?form=personal_address`;
    }

    if (this.props.step === 6) {
      route = `?form=personal_residence_city`;
    }

    if (this.props.step === 7) {
      route = `?form=personal_country`;
    }

    if (this.props.step === 8) {
      route = `?form=personal_type_id`;
    }

    if (this.props.step === 9) {
      route = `?form=personal_number_id`;
    }

    if (this.props.step === 10) {
      route = `?form=personal_nacionality`;
    }

    if (this.props.step === 11) {
      route = `?form=personal_success`;
    }
    this.props.history.push(route);

    if (this.props.step === 10 && this.state.data_state.id_type && (this.state.data_state.id_type[0].code === "cedula_ciudadania" ||
        this.state.data_state.id_type[0].code === "cedula_extranjeria")
    ) {
      const updateState = async () => {
        await this.setState({
          data_state: {
            ...this.state.data_state,
            nationality: this.state.data_state.country,
          },
        });
        this.siguiente();
      };
      updateState();
      // from:  personal_type_id
    }
  }

  // init_component = async() =>{
  //   await this.props.action.CurrentForm('kyc_basic')
  //   // let alturita = document.getElementById('expandibleKycPanel').clientHeight
  // }

  init_component = async () => {
    await this.props.action.CurrentForm("kyc_basic");
    // Debemos desarrollar una pantalla que aparezca en primer instancia pidiento el tipo de persona (legal/natural)
    // validamos si el (user.verification_level === 'level_0' && user.person_type === null) seteamos un estado para mostrar la pantalla donde pedimos el person_type, ej:this.setState({person_type})
    // de momento solo aceptaremos personas naturales por lo tanto viene seteado por defecto en (user.person_type:'natural')
    const { form_kyc_basic_state } = this.props;
    // console.log(form_kyc_basic_state, modelFormData)
    let verification_state = await this.props.coinsendaServices.getVerificationState();

    if (!verification_state || verification_state === "rejected") {
      // if(user.verification_level !== 'level_0'){
      this.props.action.isAppLoading(true);
      const { user } = this.props;
      let countryvalidators = await this.props.coinsendaServices.countryValidators();

      let kyc_data_basic = await serveKycData(
        countryvalidators.res.levels.level_1.personal[user.person_type]
      );
      let init_state = await converToInitState(
        countryvalidators.res.levels.level_1.personal[user.person_type]
      );
      let get_country_list = await this.props.coinsendaServices.getCountryList();
      let select_list = await extractSelectList(
        kyc_data_basic,
        countryvalidators.res.levels.level_1.personal[user.person_type]
      );
      // console.log('|||||||||__________select_list',kyc_data_basic ,select_list)
      select_list.country = await FormatCountryList(
        select_list.country,
        get_country_list
      );
      select_list.countries = get_country_list;
      await this.setState({ kyc_data_basic, select_list });

      let country_default = await this.matchList({
        value: "colombia",
        name: "country_prefix",
      });

      let new_init_state = {
        ...init_state,
        country_prefix: "",
        ...form_kyc_basic_state.data_state,
      };
      // console.log('||||||_______ new_init_state', new_init_state)

      if (!new_init_state.country_prefix) {
        new_init_state.country_prefix = country_default;
      }
      if (!new_init_state.country) {
        new_init_state.country = country_default;
      }
      // console.log('|||||new_init_state', new_init_state)

      // new_init_state.country_prefix = country_default
      // name_section === 'phone' ? this.matchList({value:'colombia', name:'country_prefix'}) :
      // let name_section = kyc_data_basic[this.props.step-1].name
      // console.log('this.props!!!!!!!', this.props, 'kyc_data_basic', kyc_data_basic)
      // console.log('this.props!!!!!!!', new_init_state)
      // let current_item = kyc_data_basic[this.props.step - 1];
      let current_item = kyc_data_basic[0];
      await this.setState({
        data_state: new_init_state,
        message: current_item.message,
        active: false,
        colorMessage: "#50667a",
        ui_type: current_item.ui_type,
        open_sect: false,
        show_hide_section: false,
        current_item: current_item.name,
      });

      // console.log('||||||||||||||||||||||| this.state:', this.state)
      this.props.action.isAppLoading(false);
    }
  };

  // const body = {
  //   target:{
  //     name:,
  //     value:
  //   }
  // }

  update = async ({ target }) => {
    target.preventDefault && target.preventDefault();
    target.persist && target.persist();
    // console.log('|||||||||||||||| update func : ', target.value)
    const { name, value } = target;
    const { ui_type } = this.state;

    // Check strings
    if (
      name === modelFormData.name.name ||
      name === modelFormData.surname.name
    ) {
      if (value && !/(^[ñÑáÁéÉíÍóÓúÚA]?|^\b)(?!.*?\s{2})[ñÑáÁéÉíÍóÓúÚA-Za-z ]{1,25}(\s?)$/g.test(value)) return;}

    if (name === modelFormData.phone.name) {
      if (value && !/^[0-9]{1,14}$/g.test(value)) return;
    }

    if (name === modelFormData.address.name) {
      if (value && value.length > 150) return;
    }

    if (name === modelFormData.city) {
      if (value && value.length > 100) return;
    }

    if (name === modelFormData.id_number.name) {
      const idType = this.state.data_state.id_type[0].code;
      if (idType === "pasaporte") {
        if (value && !/^[a-zA-Z0-9]{1,20}$/g.test(value)) return;
      } else {
        if (value && !/^[0-9]{1,12}$/g.test(value)) return;
      }
    }
    // Check strings end

    if (name === "country_prefix" || name === "country" || ui_type === "select") {
      let select_value = await this.matchList(target)
      if(select_value){
        console.log('||||||||||||||| Update Function: ', select_value, this.state.data_state)
        this.setState({
          data_state: {
            ...this.state.data_state,
            [name]: select_value
          }
        });
        return setTimeout(() => {
          this.setState({ open_sect: false });
        }, 300);
      }
    }

    await this.setState({
      data_state: {
        ...this.state.data_state,
        [name]: value ? capitalizeString(value) : "",
      },
    });
    // if(new_value){
    // this.props.action.UpdateForm('kyc_basic', this.state)
    // }
    this.validateActive();
  };

  matchList = async ({ value, name }) => {
    if (!value) {
      this.setState({ current_search: null });
    }
    // const {  } = this.props
    const { select_list } = this.state;
    let res = await matchItem(
      select_list[
        name === "country_prefix" || name === "nationality" ? "countries" : name
      ],
      { primary: value },
      "code"
    );
    // console.log('||||||matchList', value, name, res)
    if (!res) {
      return false;
    }
    if (res.length < 50) {
      this.setState({ current_search: res });
    }
    if (res.length === 1) {
      return res;
    }

    // console.log('||||||matchList', value, name, current_item, select_list)
  };

  validateActive = async () => {
    let arre = await objectToArray(this.state.data_state);
    const { step } = this.props;
    if (arre[step - 1]) {
      return this.setState({
        active: true,
      });
    }
    return this.unAvailableActive();
  };

  unAvailableActive = () => {
    return this.setState({
      active: false,
    });
  };

  siguiente = async () => {
    const { kyc_data_basic } = this.state;
    // console.log('NEXT KYC', this.props.step, kyc_data_basic.length, this.state)
    if (this.props.step <= kyc_data_basic.length) {
      await this.props.action.UpdateForm("kyc_basic", this.state);
      await this.props.action.IncreaseStep("kyc_basic");

      if (this.props.step > kyc_data_basic.length) {
        return this.props.validate_personal_kyc("personal");
      }

      this._onFocus()

      return this.validateActive();
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    let arre = await objectToArray(this.state.data_state);
    const { step } = this.props;
    const value = arre[step - 1];
    const { current_item, data_state } = this.state;

    if (!String(value).trim()) {
      return this.setState({
        message: "No se permiten valores vacíos",
        colorMessage: "#ff1100",
      });
    }

    // check birthday
    if (current_item === modelFormData.birthday.name && value) {
      const birthday = moment(value, "DD/MM/YYYY");
      const isValidBirthDay = birthday.isBefore(moment().subtract(18, "years"));
      if (!isValidBirthDay) {
        return this.setState({
          message: "El registro solo es válido para personas mayores de edad",
          colorMessage: "#ff1100",
        });
      }
    }

    // console.log('handleSubmit', arre[(step-1)], this.state)
    if (current_item === "phone" && !data_state.country_prefix) {
      return false;
    }
    if (value) {
      return this.siguiente();
    }
    return this.setState({
      message: this.errMessage(step),
      colorMessage: "#ff1100",
    });
  };

  errMessage = (step) => {
    const { kyc_data_basic } = this.state;
    return kyc_data_basic[step - 1].errmessage;
  };

  receivedProps = async (nextProps) => {
    if (
      !this.state.kyc_data_basic ||
      !this.state.kyc_data_basic[nextProps.step - 1]
    ) {
      return false;
    }
    if (nextProps.step > this.state.kyc_data_basic.length) {
      return false;
    }
    let name_section = this.state.kyc_data_basic[nextProps.step - 1].name;
    let current_search =
      (await name_section) === "phone"
        ? this.state.data_state["country_prefix"]
        : name_section === "country"
        ? this.state.data_state[name_section]
        : null;
    await this.setState({
      message: `${
        this.state.open_sect
          ? ""
          : this.state.kyc_data_basic[nextProps.step - 1].message
      }`,
      colorMessage: "#50667a",
      ui_type: this.state.kyc_data_basic[nextProps.step - 1].ui_type,
      current_item: name_section,
      current_search: current_search ? current_search : null,
    });
    // console.log('||||||||| receivedProps - S T A T E', current_search_list, this.state)
    this.validateActive();
  };

  toggleSection = () => {
    this.setState({
      message: `${
        !this.state.open_sect
          ? ""
          : this.state.kyc_data_basic[this.props.step - 1].message
      }`,
      open_sect: !this.state.open_sect,
      show_hide_section: !this.state.show_hide_section,
    });
  };

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', nextProps, this.props)

    if (nextProps.step !== this.props.step) {
      this.setState({
        open_sect: false,
        show_hide_section: false,
      });
    }
    this.receivedProps(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props === nextProps && this.state === nextState) {
      return false;
    }
    return true;
  }

  _onFocus = () => {
    // Cerramos la sección de la listas al enfocarnos en el input phone
    const { open_sect, ui_type, kyc_data_basic } = this.state;
    const { step } = this.props;
    const selectHasNotValue = Array.isArray(this.state.data_state[kyc_data_basic[step - 1].name])

    if (ui_type === "select" && !selectHasNotValue) {
      setTimeout(() => {
        this.setState({ show_hide_section: true });
      }, 300);
      return this.setState({
        message: `${!open_sect ? "" : kyc_data_basic[step - 1].message}`,
        open_sect: true,
      });
    }
  };

  // handle_search_result = async(e) =>{
  //   // console.log('|||||||| - - - SEARCH RESULT --', e)
  //   await this.setState({search_result:e})
  //   this.update_list(e)
  // }

  clean_search_result = async () => {
    // await this.setState({search_result:null})
    const { ui_type, data_state, current_item } = this.state;
    let new_current_item;
    if (current_item === "phone") {
      new_current_item = "country_prefix";
    }

    await this.setState({
      data_state: {
        ...data_state,
        [new_current_item ? new_current_item : current_item]: null,
      },
      current_search: null,
    });

    if (ui_type === "select") {
      this.setState({ open_sect: true, show_hide_section: true });
    }
  };

  select_item = async (item) => {
    const { current_item } = this.state;

    let body = {
      target: {
        name: current_item,
        value: item.code,
      },
    };

    if (current_item === "phone") {
      body.target.name = "country_prefix";
    }

    await this.update(body);
    // alert()
    // setTimeout(() => {
    //   this.setState({ open_sect: false });
    // }, 100);
  };

  render() {
    // console.log('P R O P S - -   K Y C', this.state)
    // console.log('|||E S T A D O - -   K Y C', this.state)
    let {
      open_sect,
      data_state,
      ui_type,
      current_item,
      current_search,
      kyc_data_basic,
      show_hide_section,
    } = this.state;
    const { step } = this.props;
    // console.log('|||E S T A D O - -   K Y C', this.props.select_list)
    // console.log('F I N D B A R     K Y C', ui_type, kyc_data_basic[step-1].name, data_state, data_state[kyc_data_basic[step-1].name])
    // console.log('|||current_search', current_search && current_search.length, current_search )
    open_sect = open_sect && ui_type !== "text";

    // console.log('|||||||||||||||||||||||||||||| expandibleKycPanel ', open_sect, ui_type)

    return (
      <>
        {
          // this.props.loader || !kyc_data_basic || !step ?
          this.props.loader ||
          !kyc_data_basic ||
          !step ||
          this.props.step > this.state.kyc_data_basic.length ? (
            // <SimpleLoader/>
            <KycSkeleton/>
          ) : (
            <div className="KycLayout">
              <p className="fuente KycTitle KycTitless">Verificación Básica</p>
              <KycBasicLayout
                update={this.update}
                handleSubmit={this.handleSubmit}
                kyc={kyc_data_basic}
                step={this.props.step}
                state={{ ...this.state, open_sect }}
                toggleSection={this.toggleSection}
                _onFocus={this._onFocus}
                search_results={
                  ui_type === "phone"
                    ? data_state.country_prefix
                      ? data_state.country_prefix
                      : null
                    : ui_type === "select"
                    ? data_state[kyc_data_basic[step - 1].name]
                      ? data_state[kyc_data_basic[step - 1].name]
                      : null
                    : null
                }
                clean_search_result={this.clean_search_result}
              />
              <div id="expandibleKycPanel" className="expandibleKycPanel" style={{height: open_sect ? "65vh" : "0", opacity: open_sect ? "1" : "0"}}>

                {show_hide_section && (
                  <div className={`contexpandibleKycPanel ${open_sect ? "openSec" : ""}`}>
                    {current_search && (
                      <div className="contCountryList">
                        {current_search.map((item) => {
                          return (
                            <ItemListKycBasic
                              key={item.id}
                              item={item}
                              select_item={this.select_item}
                              active={
                                current_search &&
                                current_search.length === 1 &&
                                true
                              }
                            />
                          );
                        })}
                      </div>
                    )}

                    {(ui_type === "select" || ui_type === "phone") &&
                      !current_search && (
                        <div className="contCountryList">
                          { this.state.select_list[current_item === "phone" || current_item === "nationality" ? "countries" : current_item].map((item) => {
                            return (
                              <ItemListKycBasic
                                key={item.id}
                                item={item}
                                select_item={this.select_item}
                                suffixText={
                                  this.state.current_item === "id_type" &&
                                  (item.code === "cedula_ciudadania" ||
                                    item.code === "cedula_extranjeria")
                                    ? this.state.data_state.country &&
                                      this.state.data_state.country[0].code
                                    : null
                                }
                              />
                            );
                          })}
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          )
        }
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.modelData;

  return {
    ...state.form.form_kyc_basic,
    current: state.form.current,
    form_kyc_basic_state: state.form.form_kyc_basic,
    user: user,
    loader: state.isLoading.loader,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCoinsendaServices(KycBasicContainer));
