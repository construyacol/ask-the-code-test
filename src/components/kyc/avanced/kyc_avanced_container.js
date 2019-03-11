import React, { Component } from 'react'
import KycAvancedLayout from './kyc_avanced_layout'
import { readFile } from '../../../services'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { toast, cssTransition } from 'react-toastify';

class KycAvancedContainer extends Component{


  state = {
    front:"./docs/front.png",
    back:"./docs/back.png",
    selfie:"./docs/selfie.png",
    dashboard:window.innerWidth>768 ? true : false,
    fileloader:false,
    prevState:this.props.step,
    animation:false,
    onBoarding:window.innerWidth>768 ? false : true,
    topOnBoarding:0,
    imageSrc:null
  }

  goFileLoader = async e =>{


    if (e.target.files && e.target.files.length > 0) {
      this.props.action.Loader(true)
      const imageDataUrl = await readFile(e.target.files[0])
      this.props.action.Loader(false)

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

      this.updateLocalImg(urlImg)

      toast(`¡Imagen guardada !`, {
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

  updateLocalImg = img =>{

    const name = this.props.step == 1 ? 'newfront' : this.props.step == 2 ? 'newback' : 'newselfie'

    this.props.action.UpdatePicKyc({[name]:img})
    this.setState({
      [name]:img
    })


    if(this.props.step<4){
      const step = {
        target:{
          title:this.props.step + 1
        }
      }


      setTimeout(()=>{
        this.stepChange(step)
      },700)
    }

    // console.log('METETE ESTA MASAMORRA!!!!!', this.state.state)
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


    stepChange = async(step) =>{
      // manejo esta estructura ya que el estep tambien se podrá alterar al dar click en los elementos ./kycDashboardLayout.js=>.imgDashStep
      const currentStep = step.target.title
      const prevStep = this.props.step
      await this.props.action.IncreaseStep('kyc_avanced')

      // console.log(`DEBUGEANDO ANDO::::::-----____----- CURRENT: ${currentStep} -- PREVSTEP: ${prevStep}`)

      if(currentStep == prevStep){return false}

      await this.setState({
        animation:false
      })




      if(currentStep != 3 && prevStep != 3){

        setTimeout(()=>{this.setState({animation:true})},1)

        return setTimeout(()=>{
           this.setState({
            prevState:currentStep
          })
        },500)
      }

      return this.setState({
        prevState:currentStep
      })
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
        {...this.state}
        {...this.props}
      />
    )
  }

}

function mapStateToProps(state, props){
  return{
    loader:state.isLoading.loader,
    step:state.form.form_kyc_avanced.step,
    newback:state.form.form_kyc_avanced.newback,
    newfront:state.form.form_kyc_avanced.newfront,
    newselfie:state.form.form_kyc_avanced.newselfie,
  }
}


function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}



export default connect(mapStateToProps, mapDispatchToProps) (KycAvancedContainer)
