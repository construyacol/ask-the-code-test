import React, { Component, Fragment } from 'react'
import HeaderLanding from './sections/header'
import { ButtonForms } from '../widgets/buttons/buttons'
import config from './default'
import QuoteCurrenciesLanding from './sections/quoteCurrenciesLanding'
import Coinsenda from '../widgets/icons/logos/coinsenda'
import LandingBarNav from './sections/barnav'
import ScrollMagic from 'scrollmagic'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import FeaturesContainer from './sections/features'
import MetricsContainer from './sections/metrics'
import LandingMobileSection from './sections/mobile'
import FaqSection from './sections/faqSection'
import FooterContainer from './sections/footer'
import ReviewsComponent from './sections/reviewsComponent'
import PublicRelationsContainer from './sections/publicRelations'
import VideoTutorialContainer from './sections/videoTutorials'
import LayerStickyComponent from './sections/layerStickyComponent'
import SelectCountryLanding from './sections/selectCountryLanding'
import { CountryList } from './sections/selectCountryLanding'
import BubbleMsg from '../widgets/msgBubble/msgBubble'

import { CurrencyList } from './sections/currencies_implemented'

import './landingPageContainer.css'

const oauth = config.oauth
const signinUri = `${oauth.host}/${oauth.signup}?clientId=${oauth.key}`
const signupUri = `${oauth.host}/${oauth.signin}?clientId=${oauth.key}`

const controller = new ScrollMagic.Controller();


class LandingPageContainer extends Component {

  state = {
    quoteComponentActive:false,
    menuActive:false,
    triggerBackground:false,
    logoAnim:false,
    current_country:'',
    player:{
      togglePlay:null,
      toggleMuted:null
    }
  }

  country_change = (current_country) =>{
    this.setState({current_country})
  }

  componentWillUnmount(){
    // scene.remove();
  }

  componentDidMount(){
    this.init_component()
    // VideoTutorialContainer.hola()
  }

  init_component = async(props) => {
    // let country = await this.props.action.country_detect()
    // let country_validators = await this.props.action.countryvalidators()
    await this.props.action.get_all_currencies()
    // if(country_validators.countries && country_validators.countries[country.country_name.toLowerCase()]){
    //   let current_country = country.country_name.toLowerCase()
    //   let pairs = await this.props.action.get_pairs_for(current_country)
    // }else{
    //   let pairs = await this.props.action.get_pairs_for('colombia')
    // }





    await this.props.action.get_all_pairs_from_landing()
    await this.props.action.get_pairs_for('colombia')

    if(process.env.NODE_ENV === 'development'){
      this.setState({triggerBackground:false})
    }

      new ScrollMagic.Scene({
          triggerHook:0.07,
          triggerElement: "#headerTrigger",
          duration: "100%"
      })
      .setClassToggle("#QuoteCurrenciesLanding", "active")
      .addTo(controller);


      let LogoAnim = new ScrollMagic.Scene({
          offset: window.innerWidth<768 ? 0 : 80
      })
      .addTo(controller);

      LogoAnim.on('start', async(event) => {
          this.setState({
            logoAnim:true
          })
      })

      LogoAnim.on('leave', (event) => {
          this.setState({
            logoAnim:false
          })
      })

      let BarNav = new ScrollMagic.Scene({
          triggerElement: "#headerTrigger",
          offset: window.innerWidth<768 ? 0 : 200
      })
      .setClassToggle(".landingBarNavBack", "active")
      .addTo(controller);

      BarNav.on('start', async(event) => {
          this.setState({
            menuActive:true
          })
      })

      BarNav.on('leave', (event) => {
          this.setState({
            menuActive:false
          })
      })


      if(window.innerWidth>768){
        new ScrollMagic.Scene({
            triggerHook:0.6,
            triggerElement: "#triggerReviews",
            duration: "150%"
        })
        .setClassToggle(".imgPictureCircle", "active")
        .addTo(controller);
      }










      // VideoTutorialContainer =====================================================================================================================

      let videoTutorial = new ScrollMagic.Scene({
          triggerElement: "#VideoTutorialMenu",
          triggerHook:1,
          duration: "130%"
      })
      // .setClassToggle(".landingBarNavBack", "active")
      .addTo(controller);

      videoTutorial.on("enter", (event) => {
       // add custom action
       this.state.player.togglePlay(true)
       this.state.player.toggleMuted(false)
      })
       .on("leave", (event) => {
         // reset my element to start position
         if (event.state === 'AFTER' || event.state === 'BEFORE') {
           this.state.player.togglePlay(false)
           this.state.player.toggleMuted(true)
         }
       });

  }


  ascendMethodsFromVideoTutorial = (togglePlay, toggleMuted) => {
    // toggleMuted
    this.setState({player:{
      togglePlay:togglePlay,
      toggleMuted:toggleMuted
    }})
  }




  render(){

    // console.log('|||||| =======>    LandingPageContainer =====>', this.state.player)
    let movil = window.innerWidth<768

    const {
      triggerBackground,
      quoteComponentActive,
      menuActive,
      logoAnim
    } = this.state

    return(
    <Fragment>
              <section id="LandingPageContainer">
                <LandingBarNav menuActive={menuActive} signinUri={signinUri} signupUri={signupUri} logoAnim={logoAnim} landing={true}/>

                    <HeaderLanding>
                          <div className="HeaderLandingContent">
                            <div className="headerFirstSection">
                              <span id="headerTrigger" style={{background:triggerBackground ? 'red' : 'none'}}></span>
                              <div className="contItemLogo">
                                <Coinsenda size={movil ? 45 : 65} color="white" />
                                <h1 className="headerTitle fuenteMuseo">Coinsenda</h1>
                              </div>
                              <h2 className="headerParr fuente">Compra y vende Bitcoin, Ethereum, Dash y Litecoin con pesos Colombianos.</h2>
                              <a href={signinUri} target="_blank"  rel="noopener noreferrer">
                                <ButtonForms active={true} clases="register">
                                  <p className="fuenteMuseo ctaLand" >Crear mi cuenta</p>
                                </ButtonForms>
                              </a>
                            </div>
                            <div className="headerSecondSection">
                                <QuoteCurrenciesLanding quoteComponentActive={quoteComponentActive}/>
                            </div>
                          </div>
                      </HeaderLanding>

                      <section className="sections features">
                         <FeaturesContainer/>
                      </section>

                      <section className="sections video" >
                        <VideoTutorialContainer loadMethodsOnParentComponent={this.ascendMethodsFromVideoTutorial}/>
                      </section>

                      <section className="sections metrics">
                         <MetricsContainer/>
                      </section>

                      <section className="sections reviews" id="triggerReviews">
                        <ReviewsComponent/>
                      </section>

                      <section className="sections publicRelations">
                        <div className="backgroundRelations"></div>
                        <PublicRelationsContainer/>
                        <LayerStickyComponent
                          component="currencyList"
                          config={{trigger_items:4, random_class:'layerStickyTrigger', height:170}}
                          left={<CurrencyList left={true}/>}
                          rigth={<CurrencyList rigth={true}/>}
                        />
                        <LayerStickyComponent
                          component="countryList"
                          config={{trigger_items:5, random_class:'layerStickyTriggerCountry', height:movil ? 110 : 200}}
                          rigth={!movil && <SelectCountryLanding rigth={true} country_change={this.country_change} current_country={this.state.current_country}/>}
                          left={<CountryList current_country={this.state.current_country}/>}
                        />
                      </section>

                      <section className="sections mobile">
                        <LandingMobileSection/>
                      </section>

                      <section className="sections faqs">
                          <FaqSection landing={true}/>
                      </section>

              </section>
              <section id="FooterLanding">
                <FooterContainer/>
              </section>
    </Fragment>
    )

  }
}


function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}


export default connect(null, mapDispatchToProps) (LandingPageContainer)
