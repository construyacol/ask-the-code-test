import React, { Component, Fragment } from 'react'
import IconSwitch from '../../widgets/icons/iconSwitch'
import { ButtonForms } from '../../widgets/buttons/buttons.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { readFile, objectToArray, add_index_to_root_object, converToInitState } from '../../../services'

class KycFinancialComponent extends Component {


  state = {current_name:null}

  componentDidMount(){
    this.init_component()
  }

  init_component = async() => {
    const { user, step } = this.props
    let countryvalidators = await this.props.action.countryvalidators()
    if(!countryvalidators){return false}
    const { financial } = countryvalidators.res.levels.level_2
    let financial_data = financial[user.person_type]
    let kyc_financial_data = await add_index_to_root_object(financial_data)
    let kyc_data_state = await converToInitState(kyc_financial_data)
    let kyc_financial = await objectToArray(kyc_financial_data)
    // console.log('|||||||| countryvalidators', kyc_financial, `kyc_financial_data`, kyc_data_state)
    // falta declarar el length del estado, para crear la barra de carga referente a cantidad de archivos a cargar
    await this.setState({
      current_name:kyc_financial[step-1].ui_name,
      current_value:kyc_financial[step-1].value,
      data_state:kyc_data_state
    })

    console.log('|||||||| countryvalidators', kyc_financial[step-1], `step: ${step}`, this.state)

  }






  goFileLoader = async e =>{
    if (e.target.files && e.target.files.length > 0) {
      console.log('|||||||| goFileLoader before', e.target.files)
      // this.props.action.Loader(true)
      const imageDataUrl = await readFile(e.target.files[0])
      // this.props.action.Loader(false)
      console.log('|||||||| goFileLoader url after', imageDataUrl)
      this.setState({
        imageSrc: imageDataUrl,
        // fileloader: !this.state.fileloader
      })
    }
  }

  render(){

    // console.log('||||| KycFinancialComponent ', this.props)
    const { current_name } = this.state

    const atributos = {
      icon:"kyc_financial",
      color:"#0066AA",
      size:50
    }

    return(
      <div className="KycFinancialComponent">
        <IconSwitch {...atributos} />
        <p className="fuente" >Completa la verificación financiera para operar con cantidades superiores a $7.000 dolares al mes.</p>
        <div className="panelImgFinancial">
          <div className="FinancialUploadImg" style={{width:'calc(100% - 24px)'}}>
            <div className="loaderImgComponent">
              <input type="file" id="uploadIMGF" onChange={this.goFileLoader} />
              <div className="payloadFinancial">
                <IconSwitch icon="upload" size={70} color="#3e87d9" />
                <div className="fuente textFinancial">
                  <IconSwitch icon="touch" size={30} color="#3e87d9" />
                  Toca para cargar el archivo JPG/PDF de tu {current_name}
                </div>
              </div>
            </div>
          </div>
          <div className="FinancialUploaded">
          </div>
        </div>
        <div className="Kyccontrols">
            <div className="Kcontrols">
              {/* {
                window.innerWidth>350 &&
                <ButtonForms
                  active={true}
                  type="secundary"
                  // siguiente={exit}
                >{window.innerWidth>768 ? 'Lo haré despues': 'No' }</ButtonForms>
              } */}
                  <ButtonForms
                    active={true}
                    type="primary"
                    // siguiente={siguiente}
                  >Subir comprobante</ButtonForms>
            </div>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state, props){
  // console.log('|||| mapStateToProps', state.form.form_kyc_financial)
  const { user, user_id} = state.model_data
  const { step } = state.form.form_kyc_financial

  return{
      step:step,
      loader:state.isLoading.loader,
      user:user[user_id]
  }
}

function mapDispatchToProps(dispatch){
  return {
    action: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(KycFinancialComponent)
