import React, { useEffect, useState } from 'react'
import KycAvancedLayout from './kyc_avanced_layout'
import { readFile } from '../../../utils'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { img_compressor } from '../../../utils'
import usePrevious from '../../hooks/usePreviousValue'
import { useToastMesssage } from '../../../hooks/useToastMessage'

const KycAvancedContainer = (props) => {
  const [state, _setState] = useState({
    kyc_success: false,
    front: props.user.id_type === 'pasaporte' ? "./docs/front_passport.png" : "./docs/front.png",
    back: "./docs/back.png",
    selfie: props.user.id_type === 'pasaporte' ? "./docs/selfie_passport.png" : "./docs/selfie.png",
    newfront: props.user.id_type === 'pasaporte' ? "./docs/front_passport.png" : "./docs/front.png",
    newback: "./docs/back.png",
    newselfie: props.user.id_type === 'pasaporte' ? "./docs/selfie_passport.png" : "./docs/selfie.png",
    id_type: props.user.id_type,
    dashboard: window.innerWidth > 768 ? true : false,
    fileloader: false,
    prevState: props.step,
    animation: false,
    animation2: false,
    onBoarding: window.innerWidth > 768 ? false : true,
    topOnBoarding: 0,
    imageSrc: null,
    base64: { ...props.base64 }
  })

  const [ toastMessage ] = useToastMesssage()

  const setState = (newState) => {
    return _setState({ ...newState, ...state})
  }

  const pUser = usePrevious(props.user)
  const pStep = usePrevious(props.step)

  const componentDidMount = async () => {
    await props.action.CurrentForm('kyc_advance')
    if (props.current === 'kyc_advance') {
      props.action.isAppLoading(false)
      props.history.push(`?form=identity_front_upload`)
    }
  }

  const componentDidUpdate = (prevProps) => {
    // inserto las siguientes rutas para poder hacer seguimiento al funnel desde hotjar
    if (pStep === props.step && props.current === 'kyc_advance') { return }
    // console.log('||||||||||||||||||||||||||||||| componentDidUpdate KYC ADVANCE ===> ', pStep, props.step, props)

    const { reset, step } = props
    if (reset) {
      setState({
        animation: false,
        animation2: false,
        prevState: 1,
      })
    }
    if (step === 2) {
      setTimeout(() => { setState({ animation: true }) }, 1)
      setTimeout(() => { setState({ animation2: true }) }, 300)
    }
    if (props.user !== pUser) {
      setState({
        front: props.user.id_type === 'pasaporte' ? "./docs/front_passport.png" : "./docs/front.png",
        selfie: props.user.id_type === 'pasaporte' ? "./docs/selfie_passport.png" : "./docs/selfie.png",
        newfront: props.user.id_type === 'pasaporte' ? "./docs/front_passport.png" : "./docs/front.png",
        newselfie: props.user.id_type === 'pasaporte' ? "./docs/selfie_passport.png" : "./docs/selfie.png",
        id_type: props.user.id_type
      })
    }
    //
    let route
    //
    if (props.step === 2) {
      route = `?form=identity_back_upload`
    }

    if (props.step === 3) {
      route = `?form=identity_selfie_upload`
    }

    if (props.step === 4) {
      route = `?form=identity_files_uploaded_success`
    }
    props.history.push(route)
  }
  
  useEffect(() => {
    componentDidMount()
    componentDidUpdate()
  }, [])

  const goFileLoader = async e => {
    if (e.target.files && e.target.files.length > 0) {
      // console.log('|||||||| goFileLoader', e.target.files)
      props.action.isAppLoading(true)
      // console.log('||||||||||IMG BEFORE', e.target.files[0])
      const file = await img_compressor(e.target.files[0])
      // return console.log('||||||||||IMG AFTER', file)
      const imageDataUrl = await readFile(file)
      props.action.isAppLoading(false)
      // console.log('|||||||| goFileLoader url', imageDataUrl)
      setState({
        imageSrc: imageDataUrl,
        fileloader: !state.fileloader
      })
    }
  }


  const subirImg = (img) => {
    props.action.isAppLoading(true)
    const {
      urlImg,
      base64
    } = img
    // simulamos llamado del endpoint para guardar imagen
    setTimeout(() => {
      props.action.isAppLoading(false)
      setState({
        fileloader: !state.fileloader
      })

      updateLocalImg(urlImg, base64)

      toastMessage('¡Imagen cargada con éxito!', 'success')
    }, 2000)
  }

  const updateLocalImg = async (img, base64) => {

    const name = props.step === 1 ? 'newfront' : props.step === 2 ? 'newback' : 'newselfie'
    // props.action.UpdatePicKyc({[name]:img})
    await setState({
      [name]: img,
      base64: {
        ...state.base64,
        [name]: base64
      }
    })

    await props.action.UpdateForm('kyc_avanced', state)

    if (props.step <= 3) {
      return setTimeout(() => {
        stepChange()
      }, 700)
    }

  }

  const cancelarSubidaImg = () => {
    setState({
      fileloader: false
    })
  }

  const continuar = () => {
    setState({
      topOnBoarding: -100
    })
  }

  const stepChange = async () => {
    // manejo esta estructura ya que el estep tambien se podrá alterar al dar click en los elementos ./kycDashboardLayout.js=>.imgDashStep
    // const currentStep = step.target.title
    if (props.user.id_type === 'pasaporte' && props.step === 1) {
      setState({ prevState: 3 })
      return props.action.IncreaseStep('kyc_avanced', 3)
    }

    const prevStep = props.step
    await props.action.IncreaseStep('kyc_avanced')
    const currentStep = props.step

    // console.log(`DEBUGEANDO ANDO::::::-----____----- CURRENT: ${currentStep} -- PREVSTEP: ${prevStep}`)

    if (currentStep === prevStep) { return false }
    await setState({
      animation: false
    })

    // console.log(`|||||| KYC CONTAINER Steps current ${currentStep} , prev ${prevStep}`, props)
    // if(currentStep != 3 && prevStep != 3){

    // Ejecutamos este if para aplicar la animacion de la cedula
    if (currentStep < 3) {
      setTimeout(() => { setState({ animation: true }) }, 1)
      setTimeout(() => { setState({ animation2: true }) }, 300)
      return setTimeout(() => {
        setState({
          prevState: currentStep
        })
      }, 500)
    }

    setState({
      prevState: currentStep
    })


    // Si todo sale bien, Finalizamos y enviamos la información para validar en el back
    // console.log('||||||||| currentStep', currentStep)
    const { base64 } = state
    const {
      newfront,
      newback,
      newselfie
    } = base64


    if ((newfront && newback && newselfie) || (newfront && newselfie && props.user.id_type === 'pasaporte')) {
      let finish_kyc_advanced = await props.validate_identity_kyc(state)
      if (finish_kyc_advanced) {
        return setState({ kyc_success: true })
      }
    }

  }

  const finish = () => {
    props.action.toggleModal()
  }

  return (
    <KycAvancedLayout
      stepChange={stepChange}
      goFileLoader={goFileLoader}
      continuar={continuar}
      subirImg={subirImg}
      cancelarSubidaImg={cancelarSubidaImg}
      finish={finish}
      {...state}
      {...props}
    />
  )

}

function mapStateToProps(state, props) {
  const { user } = state.modelData
  const { current } = state.form
  return {
    loader: state.isLoading.loader,
    step: state.form.form_kyc_avanced.step,
    base64: state.form.form_kyc_avanced.base64,
    user: user,
    current
  }
}


function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(KycAvancedContainer)
