import React, { Component } from 'react'
import KycAvancedLayout from './kyc_avanced_layout'
import { readFile } from '../../../services'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { toast, cssTransition } from 'react-toastify';

class KycAvancedContainer extends Component{

  state = {
    kyc_success:false,
    front:this.props.user.id_type === 'pasaporte' ? "./docs/front_passport.png" : "./docs/front.png",
    back:"./docs/back.png",
    selfie:this.props.user.id_type === 'pasaporte' ? "./docs/selfie_passport.png" : "./docs/selfie.png",
    newfront:this.props.user.id_type === 'pasaporte' ? "./docs/front_passport.png" : "./docs/front.png",
    newback:"./docs/back.png",
    newselfie:this.props.user.id_type === 'pasaporte' ? "./docs/selfie_passport.png" : "./docs/selfie.png",
    id_type:this.props.user.id_type,
    dashboard:window.innerWidth>768 ? true : false,
    fileloader:false,
    prevState:this.props.step,
    animation:false,
    animation2:false,
    onBoarding:window.innerWidth>768 ? false : true,
    topOnBoarding:0,
    imageSrc:null,
    base64:{...this.props.base64}
  }

  componentWillReceiveProps(nextProps){
    const { reset, step } = nextProps
    if(reset){
      this.setState({
          animation:false,
          animation2:false,
          prevState:1
        })
    }
    if(step === 2){
      setTimeout(()=>{this.setState({animation:true})},1)
      setTimeout(()=>{this.setState({animation2:true})},300)
    }
    if(nextProps.user !== this.props.user){
      this.setState({
        front:nextProps.user.id_type === 'pasaporte' ? "./docs/front_passport.png" : "./docs/front.png",
        selfie:nextProps.user.id_type === 'pasaporte' ? "./docs/selfie_passport.png" : "./docs/selfie.png",
        newfront:nextProps.user.id_type === 'pasaporte' ? "./docs/front_passport.png" : "./docs/front.png",
        newselfie:nextProps.user.id_type === 'pasaporte' ? "./docs/selfie_passport.png" : "./docs/selfie.png",
        id_type:nextProps.user.id_type
      })
    }
    // console.log('||||| ----- componentWillReceiveProps', nextProps)
  }


  componentDidMount(){
    this.props.action.IncreaseStep('kyc_basic', 1)
    // console.log('||||||| componentDidMount', this.state )
  }



  goFileLoader = async e =>{
    if (e.target.files && e.target.files.length > 0) {
      console.log('|||||||| goFileLoader', e.target.files)
      this.props.action.Loader(true)
      const imageDataUrl = await readFile(e.target.files[0])
      this.props.action.Loader(false)
      console.log('|||||||| goFileLoader url', imageDataUrl)
      this.setState({
        imageSrc: imageDataUrl,
        fileloader: !this.state.fileloader
      })
    }
  }

  subirImg = (img) =>{
    this.props.action.Loader(true)

    const{
      urlImg,
      base64
    } = img
// simulamos llamado del endpoint para guardar imagen
    setTimeout(()=>{
      this.props.action.Loader(false)
      this.setState({
        fileloader: !this.state.fileloader
      })

      this.updateLocalImg(urlImg, base64)

      toast(`¡Imagen Cargada !`, {
        position: window.innerWidth>768 ? toast.POSITION.BOTTOM_RIGHT : toast.POSITION.TOP_CENTER,
         pauseOnFocusLoss: false,
         draggablePercent: 60,
         className: "DCfondo",
         bodyClassName: "DCTtext",
         progressClassName: 'DCProgress',
         autoClose: 3000
      });
    }, 2000)

  }

  updateLocalImg = async(img, base64) =>{

    const name = this.props.step == 1 ? 'newfront' : this.props.step == 2 ? 'newback' : 'newselfie'
    // this.props.action.UpdatePicKyc({[name]:img})
    await this.setState({
      [name]:img,
      base64:{
        ...this.state.base64,
        [name]:base64
      }
    })

    await this.props.action.UpdateForm('kyc_avanced', this.state)

    if(this.props.step<=3){
      return setTimeout(()=>{
        this.stepChange()
      },700)
    }

  }



    cancelarSubidaImg = () =>{
      this.setState({
        fileloader: false
      })
    }



  continuar = () =>{
    this.setState({
      topOnBoarding:-100
    })
  }


    stepChange = async() =>{
      // manejo esta estructura ya que el estep tambien se podrá alterar al dar click en los elementos ./kycDashboardLayout.js=>.imgDashStep
      // const currentStep = step.target.title
      if(this.props.user.id_type === 'pasaporte' && this.props.step === 1){
        this.setState({prevState:3})
        return this.props.action.IncreaseStep('kyc_avanced', 3)
      }

      const prevStep = this.props.step
      await this.props.action.IncreaseStep('kyc_avanced')
      const currentStep = this.props.step

      // console.log(`DEBUGEANDO ANDO::::::-----____----- CURRENT: ${currentStep} -- PREVSTEP: ${prevStep}`)

      if(currentStep == prevStep){return false}
      await this.setState({
        animation:false
      })

      // console.log(`|||||| KYC CONTAINER Steps current ${currentStep} , prev ${prevStep}`, this.props)
      // if(currentStep != 3 && prevStep != 3){

      // Ejecutamos este if para aplicar la animacion de la cedula
      if(currentStep < 3){
        setTimeout(()=>{this.setState({animation:true})},1)
        setTimeout(()=>{this.setState({animation2:true})},300)
        return setTimeout(()=>{
           this.setState({
            prevState:currentStep
          })
        },500)
      }

      this.setState({
       prevState:currentStep
     })


      // Si todo sale bien, Finalizamos y enviamos la información para validar en el back
      // console.log('||||||||| currentStep', currentStep)
      const { base64 } = this.state
      const {
        newfront,
        newback,
        newselfie
      } = base64


      if(newfront && newback && newselfie || newfront && newselfie && this.props.user.id_type === 'pasaporte'){
       let finish_kyc_advanced = await this.props.validate_identity_kyc(this.state)
       if(finish_kyc_advanced){
         return this.setState({kyc_success:true})
       }
      }

    }




    finish = () =>{
      this.props.action.ToggleModal()
    }

    componentWillMount(){
      this.props.action.CurrentForm('kyc_advance')
    }

  render(){
    // console.log('FIGAROOOO FIGAROOOO FIGAROOOOOO::::', this.state)
    return(
      <KycAvancedLayout
        stepChange={this.stepChange}
        goFileLoader={this.goFileLoader}
        continuar={this.continuar}
        subirImg={this.subirImg}
        cancelarSubidaImg={this.cancelarSubidaImg}
        finish={this.finish}
        {...this.state}
        {...this.props}
      />
    )
  }

}

function mapStateToProps(state, props){
  const { user, user_id } = state.model_data
  return{
    loader:state.isLoading.loader,
    step:state.form.form_kyc_avanced.step,
    base64:state.form.form_kyc_avanced.base64,
    user:user[user_id]
  }
}


function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}



export default connect(mapStateToProps, mapDispatchToProps) (KycAvancedContainer)
