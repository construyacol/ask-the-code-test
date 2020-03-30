import React, { Component, Fragment } from 'react'
import IconSwitch from '../../widgets/icons/iconSwitch'
import { ButtonForms } from '../../widgets/buttons/buttons.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { readFile, objectToArray, addIndexToRootObject, converToInitState } from '../../../services'
import images from '../../../assets/pictures.png'
import pdf from '../../../assets/pdf.png'
import SimpleLoader from '../../widgets/loaders'
import SuccessComponentScreen from '../../widgets/success_screen/success_screen'
import { img_compressor } from '../../../services'


const ACCEPT_FILE_TYPE = [
  "image/jpeg",
  "image/png",
  ".pdf"
]
class KycFinancialComponent extends Component {


  state = {
    current_name:null,
    current_value:null,
    data_state:{},
    imageSrc:null,
    open_sect:null,
    kyc_financial_list:[],
    widthBar:"0%",      //estos estados estan hardcodeados y aún no se trabajan
    availableCta:false,  //estos estados estan hardcodeados y aún no se trabajan
  }

  componentDidMount(){
    this.init_component()
  }

  init_component = async() => {
    this.props.action.isAppLoading(true)
    const { user, step } = this.props
    let countryvalidators = await this.props.action.countryvalidators()
    if(!countryvalidators){return false}
    const { financial } = countryvalidators.res.levels.level_2
    let financial_data = financial[user.person_type]
    // let financial_data = {
    //   rut:{
    //     id:1,
    //     ui_name:'RUT',
    //     value:'rut'
    //   },
    //   compro:{
    //     id:2,
    //     ui_name:'COMPRO',
    //     value:'compro'
    //   }
    // }
    let kyc_financial_data = await addIndexToRootObject(financial_data)
    let kyc_data_state = await converToInitState(kyc_financial_data)
    let kyc_financial = await objectToArray(kyc_financial_data, true)
    // console.log('|||||||| countryvalidators', kyc_financial, `kyc_financial_data`, kyc_data_state)
    // console.log('|||||||| countryvalidators', financial_data)

    // falta declarar el length del estado, para crear la barra de carga referente a cantidad de archivos a cargar


    await this.setState({
      current_name:kyc_financial[step-1].ui_name,
      current_value:kyc_financial[step-1].value,
      data_state:kyc_data_state,
      kyc_financial_list:kyc_financial
    })
    this.props.action.isAppLoading(false)

    // console.log('|||||||| countryvalidators', kyc_financial[step-1], `step: ${step}`, this.state, kyc_financial)
  }




  goFileLoader = async e =>{
    if (e.target.files && e.target.files.length > 0) {
      // console.log('|||||||| goFileLoader before', e.target.files)
      //
      // const imageDataUrl = await readFile(e.target.files[0])
      // this.props.action.isAppLoading(false)
      let payload = {
        name:e.target.files[0].name,
        type:e.target.files[0].type,
      }
      const file = await img_compressor(e.target.files[0])
      const imageDataUrl = await readFile(file)
      payload.base64 = imageDataUrl
      // console.log('|||||||| goFileLoader payload', payload, this.state)


      await this.setState({
        data_state:{
          ...this.state.data_state,
          [this.state.current_value]:payload
        },
        widthBar:"100%", //esto toca trabajarlo en componentes futuros, de momento queda hardcodeado
        availableCta:true
      })

      // console.log('|||||||| goFileLoader payload', payload, this.state)

    }
  }


  send_files = async() =>{

    const { data_state } = this.state

    this.props.action.isAppLoading(true)
    let info = {}
    await Object.keys(data_state).forEach((indice) => {
      info = {
        ...info,
        [indice]:data_state[indice].base64
      }
    })


    this.props.validate_financial_kyc(info, this.setState)



  }



  finish = () =>{
    this.props.action.ToggleModal(false)
  }















  render(){

    const { current_name, data_state, kyc_financial_list, widthBar, availableCta } = this.state
    const { loader, financial_success } = this.props

    // console.log('||||| KycFinancialComponent ', this.state)

    const atributos = {
      icon:"kyc_financial",
      color:"#0066AA",
      size:50
    }

    return(
      <Fragment>
      {
        !financial_success ?

        <div className="KycFinancialComponent">
        <IconSwitch {...atributos} />
        <p className="fuente" >Completa la verificación financiera para operar con cantidades superiores a $7.000 dolares al mes.</p>
        <div className="panelImgFinancial">
          {
            loader &&
            <div className="loaderFinancial"><div className="loaderFinancial_cont"><SimpleLoader label="Cargando..."/></div></div>
          }

          <div className="FinancialUploadImg" style={{width:'calc(100% - 40px)'}}>
            <div className="KycprogressBar financial loader">
              <div className="kycPropgressed" style={{width:widthBar}}></div>
            </div>
            <div className="loaderImgComponent" style={{opacity:availableCta ? '.4' : '1'}}>
              <input type="file" id="uploadIMGF" accept={ACCEPT_FILE_TYPE.join()} onChange={this.goFileLoader} />
              <div className="payloadFinancial">
                <IconSwitch icon="upload" size={70} color="#3e87d9" />
                <div className="fuente textFinancial">
                  Toca para cargar el archivo .JPG/.PNG/.PDF de tu {current_name}
                </div>
              </div>
            </div>
          </div>
          <div className="FinancialUploaded" style={{width:'250px'}}>

            {
              kyc_financial_list.length>0 &&

              kyc_financial_list.map(item=>{
                return (<div key={item.id} className="item_loaded" style={{opacity: !data_state[item.value] ? '0.4' : '1'}}>
                        <div className="contIconS">
                          {
                            data_state[item.value] ?
                             <IconSwitch icon='success' size={100} color="white" />
                            :
                            <IconSwitch icon='upload' size={70} color="white" />
                          }
                        </div>
                        <div>
                          <p className="item_loaded_text fuente">{item.ui_name}</p>
                          <p className="item_loaded_text fileName fuente2">{data_state[item.value] ? data_state[item.value].name : '...'}</p>
                        </div>
                        {
                          data_state[item.value] &&
                          <img src={(data_state[item.value].type === 'image/jpeg' || data_state[item.value].type === 'image/png' ) ? images : pdf } alt="" width="30px"/>
                        }
                      </div>)
              })
            }


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
                    active={availableCta}
                    type="primary"
                    siguiente={this.send_files}
                  >¡Enviar!</ButtonForms>
            </div>
        </div>
      </div>

        :

        // <div>Sucess</div>
        <SuccessComponentScreen {...this.props}
          name={this.props.user.name}
          confetti={true}
          cta_secondary={false}
          title="!Lo haz hecho muy bien!, tus documentos han sido enviados exitosamente, los analizaremos y te pondremos al tanto de novedades lo mas pronto posible."
          classes="long_msg"
          cta_primary_text="Finalizar"
          siguiente={this.finish}
          user_name={this.props.user.name}
        />

}
    </Fragment>
    // {/* <SuccessComponentScreen {...props}/> */}

    )
  }
}


function mapStateToProps(state, props){
  // console.log('|||| mapStateToProps', state.form.form_kyc_financial)
  const { user, user_id} = state.modelData
  const { step } = state.form.form_kyc_financial

  return{
      step:step,
      loader:state.isLoading.loader,
      user:user
  }
}

function mapDispatchToProps(dispatch){
  return {
    action: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(KycFinancialComponent)
