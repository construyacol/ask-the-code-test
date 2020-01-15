import React, { useState, useEffect } from 'react'
// import Navbar from '../navbar'
import { Router, Route, Switch } from 'react-router-dom'
import { Link } from 'react-router-dom'
// import LegalPage from './legal'
// import FeePage from './fees'
import LandingBarNav from '../sections/barnav'
import FaqSection from '../sections/faqSection'
import config from '../default'
import Support from './support'
import Terms from '../../Legal/Terms'
import Legal from '../../Legal/Privacy'
import Fees from '../../Fees'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { connect } from 'react-redux'
import SupportForm from '../sections/supportForm'

import './pages.css'

const oauth = config.oauth
const signinUri = `${oauth.host}/${oauth.signup}?clientId=${oauth.key}`
const signupUri = `${oauth.host}/${oauth.signin}?clientId=${oauth.key}`



const HelPages = props => {
  
  const { history, other_modal } = props
 const [ menuState, setMenuState ] = useState(false)

 useEffect(()=>{
   history.listen((location, action) => {
     window.scrollTo(0, 0);
   })
 }, [history])

 const toggle_menu = () => {
    setMenuState(!menuState)
 }

 const close_menu = () => {
   // console.log(props.action.other_modal_toggle)
   setMenuState(false)
 }


 // let menu_action = window.innerWidth<768 ? menuState : null

    return(
      <div className="PagesRouters">


        {
          other_modal &&
          <SupportForm/>
        }

          <LandingBarNav menuActive={true} logoAnim={true} signinUri={signinUri} signupUri={signupUri} toggle_menu={toggle_menu}/>

          <div className="frameworkHelp">

            <div className={`panelHelp ${menuState ? 'open' : 'close'}`}>
              <nav>
                <Link onClick={close_menu} to="/docs/faqs" className={`itemNavHelp prin fuenteMuseo ${history.location.pathname === '/docs/own' ? 'active' : '' }`}>Coinsenda <span>(Nosotros)</span></Link>   {/* PERSONA NATURAL / JURÍDICA */}
                <Link onClick={close_menu} to="/docs/faqs" className={`itemNavHelp sub off fuente ${history.location.pathname === '/docs/blog' ? 'active' : '' }`}>Blog</Link>   {/* PERSONA NATURAL / JURÍDICA */}
                <Link onClick={close_menu} to="/docs/faqs" className={`itemNavHelp sub off fuente ${history.location.pathname === '/docs/carrers' ? 'active' : '' }`}>Carreras</Link>   {/* PERSONA NATURAL / JURÍDICA */}
                <Link onClick={close_menu} to="/docs/faqs" className={`itemNavHelp sub off fuente ${history.location.pathname === '/docs/press' ? 'active' : '' }`}>Prensa</Link>   {/* PERSONA NATURAL / JURÍDICA */}
                <Link onClick={close_menu} to="/docs/fees" className={`itemNavHelp prin fuente ${history.location.pathname === '/docs/fees' ? 'active' : '' }`}>Tarifas de uso</Link>   {/* PERSONA NATURAL / JURÍDICA */}
                <Link onClick={close_menu} to="/docs/faqs" className={`itemNavHelp prin fuente ${history.location.pathname === '/docs/faqs' || history.location.pathname === '/docs/support' ? 'active' : '' }`} >Ayuda</Link>  {/* FAQS / SUPPORT */}
                <Link onClick={close_menu} to="/docs/faqs" className={`itemNavHelp sub fuente ${history.location.pathname === '/docs/faqs' ? 'active' : '' }`} >Preguntas Frecuentes</Link>
                <Link onClick={close_menu} to="/docs/support" className={`itemNavHelp sub fuente ${history.location.pathname === '/docs/support' ? 'active' : '' }`} >Soporte</Link>
                <Link onClick={close_menu} to="/docs/legal" className={`itemNavHelp prin fuente ${history.location.pathname === '/docs/legal' ? 'active' : '' }`}>Políticas de Privacidad</Link>
                <Link onClick={close_menu} to="/docs/terms" className={`itemNavHelp prin fuente ${history.location.pathname === '/docs/terms' ? 'active' : '' }`}>Terminos y condiciones</Link>
              </nav>
            </div>

            <div className={`helpContainer ${menuState ? 'open' : 'close'}`}>
              <Router history={props.history}>
                  <Switch>
                      <Route exact path="/docs/faqs" component={FaqSection} />
                      <Route exact path="/docs/support" render={()=>(<Support {...props} />)} />
                      <Route path="/docs/terms" component={Terms} />
                      <Route path="/docs/legal" component={Legal} />
                      <Route path="/docs/fees" component={Fees} />
                  </Switch>
              </Router>
            </div>

          </div>

      </div>
    )



}



function mapStateToProps(state){
  return{
    other_modal:state.ui.other_modal
  }
}



function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps) (HelPages)
