import React from 'react'
import KycDashBoard from './dashboard/kycDashboardLayout'
import SimpleSlider from './carousel/carouselLayout'
import CropImg from '../../widgets/cropimg'
import SimpleLoader from '../../widgets/loaders'
import '../kyc.css'

const KycAvancedLayout = (props) =>{


  const {
    dashboard,
    fileloader,
    goFileLoader,
    onBoarding,
    continuar,
    topOnBoarding,
    imageSrc,
    loader,
    step
  } = props
  // console.log('FIGAROOOO FIGAROOOO FIGAROOOOOO::::', props)

  return(
    <div className="KycAvancedLayout" >
        <div className={`containerKycAvanced ${(dashboard && step<4 ) ? 'desktop' : ''}`} style={{ top: `${topOnBoarding}vh` }} >

          {
            (step < 4 && window.innerWidth>768) &&
            <div className="KYCAstep KycOnboarding">
              <SimpleSlider
                onBoarding={onBoarding}
                continuar={continuar}
              />
            </div>
          }


          <div className="KYCAstep KycDashboard">
            <div className="KycprogressBar">
              <div className="kycPropgressed" style={{width:step == 1 ? '0%' :  step == 2 ? '33%' : step == 3 ? '66%' : '100%' }} ></div>
            </div>
            {
              loader &&
              <div className="auxDesma">
                  <SimpleLoader
                    label="cargando"
                  />
              </div>
            }


            <div className={`KycDashContainer ${fileloader ? 'fileloader' : ''}`}>
              <KycDashBoard
                {...props}
              />
              {/* <div className="ssoa" onClick={goFileLoader}> */}
              <div className="ssoa">
                <CropImg
                  {...props}
                />
              </div>
            </div>

          </div>

        </div>
    </div>
  )
}

export default KycAvancedLayout
