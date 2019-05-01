import React, { Component, Fragment } from 'react'
import CopyContainer from '../widgets/copy/copyContainer'


class ReferralLinkShare extends Component {

  render(){

    let netWorks = [
      {
        icon:"fab fa-facebook-f",
        name:"facebook",
        cta:"Compartir"
      },
      {
        icon:"fab fa-twitter",
        name:"twitter",
        cta:"Twittear"
      },
      {
        icon:"fas fa-inbox",
        name:"mail",
        cta:"Enviar"
      }
    ]

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
    link
  } = props

  return(
    <div className="element1Ref">
      <i className={icon}></i>
      <p className="fuente">{cta}</p>
    </div>
  )

}


export default ReferralLinkShare
