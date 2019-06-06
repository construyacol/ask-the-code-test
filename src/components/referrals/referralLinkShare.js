import React, { Component } from 'react'
import CopyContainer from '../widgets/copy/copyContainer'


class ReferralLinkShare extends Component {

  componentDidMount(){
      this.facebook_init()
  }


  facebook_init = () =>{
    (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'))
  }

  render(){

    let netWorks = [
      // {
      //   icon:"fab fa-facebook-f",
      //   name:"facebook",
      //   cta:"Compartir",
      //   clase:"fb-share-button"
      // },
      // {
      //   icon:"fab fa-twitter",
      //   name:"twitter",
      //   cta:"Twittear"
      // },
      {
        icon:"fas fa-inbox",
        name:"mail",
        cta:"Enviar",
        active:false
      }
    ]

    let twitter_text = "Amigos, este es mi link de referidos de Coinsenda:"

    const { referralLink } = this.props

    return(
      <div className="contReferralLink">

        <div className="ReferralLink">
          <i className="refeico fas fa-share-alt"></i>
          <CopyContainer
            valueToCopy={referralLink}
            color="#3A7BD5"
            max_width={360}
          />
        </div>

        <div className="buttonsReferralShare fuente">
          {/* BOTON FACEBOOK */}
          <div className='element1Ref' data-href="https://www.coinsenda.com/">
            <a className="fb-share-button" alt="" href={referralLink}
              data-href={referralLink}
              data-layout="button_count">
            </a>
            <i className="fab fa-facebook-f"></i>
            <p className="fuente">Compartir</p>
          </div>

          {/* BOTON TWITTER */}
          <a className={`element1Ref`} href={`https://twitter.com/intent/tweet?text=${twitter_text}&url=${referralLink}`} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
            <p className="fuente">Twittear</p>
          </a>

          {
            netWorks.map((network)=>{
              return(
                <ShareElement
                  key={network.name}
                  {...network}
                />
              )
            })
          }
        </div>


      </div>
    )
  }

}


const ShareElement = props => {

  const {
    cta,
    icon,
    active
  } = props

  return(
    <a className={`element1Ref ${active ? 'activo' : 'desactive'}`} href="#">
      <i className={icon}></i>
      <p className="fuente">{cta}</p>
    </a>
  )

}


export default ReferralLinkShare
