import React, { useEffect, useState  } from 'react'
import logo1 from '../../../assets/logo1.png'
import logo2 from '../../../assets/logo2.png'
// import pic1 from '../../../assets/latin fest/1.JPG'
// import pic2 from '../../../assets/latin fest/2.JPG'
// import pic3 from '../../../assets/latin fest/3.JPG'
import IconSwitch from '../../widgets/icons/iconSwitch'
import { panel_new } from '../../api/ui/public relations'
import YouTubePlayer from 'react-player/lib/players/YouTube'


import ScrollMagic from 'scrollmagic'

import '../css/sections.css'

const controller = new ScrollMagic.Controller();

let articles = [
  {
    "title":"VII Reunión Blockchain en Bogotá",
    "description":"Discutió sobre proyectos y economía regulatoria en Colombia",
    "link":"https://www.diariobitcoin.com/index.php/2018/08/26/vii-reunion-blockchain-en-bogota-discutio-sobre-proyectos-y-economia-regulatoria-en-colombia/",
    "img":"https://pbs.twimg.com/profile_images/931295883357851648/vDaGsARG_400x400.jpg"
  },
  {
    "title":"Coinsenda como Patrocinador",
    "description":"del cripto latin fest en Bogotá, La receptividad que tuvo el pri...",
    "link":"https://criptoinforme.com/bogota-servira-nuevamente-como-sede-del-cripto-latin-fest-este-18-y-19-de-mayo/",
    "img":"https://i.ibb.co/wSWmHVQ/criptoinfo.png"
  }
]


const PublicRelationsContainer = props => {

  const [ currentNew, setCurrentNew ] = useState(panel_new[0])
  const [ currentVideoUrl, setCurrentVideoUrl ] = useState()
  const [ currentVideoPlayer, setCurrentVideoPlayer ] = useState(false)
  const [ playingVideo, setPlayingVideo ] = useState(false)

  useEffect(()=>{


    let first = new ScrollMagic.Scene({
          triggerElement: ".publicRelationsPress",
          triggerHook:0.4,
      })
      .setClassToggle(".panelRPimgCont", "first")
      .addTo(controller);

      first.on("start", (event) => {
       setCurrentNew(panel_new[1])
      }).on("leave", (event) => {
        if (event.state === 'BEFORE') {
          setCurrentNew(panel_new[0])
        }
      });

    let second = new ScrollMagic.Scene({
            triggerElement: ".publicSocialMedia",
            triggerHook:0.4,
        })
        .setClassToggle(".panelRPimgCont", "second")
        .addTo(controller);

    second.on("start", (event) => {
     setCurrentNew(panel_new[2])
    }).on("leave", (event) => {
      if (event.state === 'BEFORE') {
        setCurrentNew(panel_new[1])
      }
    });




    let videoTrigger = new ScrollMagic.Scene({
            triggerElement: ".PublicRelationsContainer",
            triggerHook:0.4,
            duration:"120%"
        })
        .addTo(controller);

    videoTrigger.on("enter", (event) => {
      setPlayingVideo(true)
    }).on("leave", (event) => {
      // console.log('========> event', event)
      // setPlayingVideo(false)
      if (event.state === 'AFTER' || event.state === 'BEFORE') {
        setPlayingVideo(false)
      }
    });


    return (()=>{
      controller.removeScene([first, second, videoTrigger])
    })

  }, [])


  const reproducir = () =>{
    setCurrentVideoPlayer(true)
    setCurrentVideoUrl(currentNew.link)

  }


  const videoPLayerClose = () =>{
    setCurrentVideoPlayer(false)
  }

  // console.log('|||||| =========> PublicRelationsContainer', panel_new, currentNew)


  return(
    <div className="PublicRelationsContainer">

      <div className="columnRP contentRelations">
        <div className="rpsection publicRelations2">
          <h1 className="FTitle fuente">Relaciones públicas</h1>
          <p className="fuente">Entérate de lo nuevo</p>
          <div className="contentRRPP ArticleComponentContainer">
            {
              articles.map( (article, id_art) => {
                return <ArticleComponent article={article} key={id_art}/>
              })
            }
          </div>
        </div>

        <div className="rpsection publicRelationsPress">
          <h1 className="FTitle fuente">Gabinete de prensa</h1>
          <p>Contacto: <span>prensa@coinsenda.com</span></p>
          <div className="contentRRPP contentRRPP2">
            <div className="cRRPP contentRRPP">
              <img src={logo1} width="100%" alt=""/>
            </div>
            <div className="cRRPP contentRRPP">
              <img src={logo2} width="100%" alt=""/>
            </div>
          </div>
        </div>

        <div className="rpsection publicSocialMedia">
          <h1 className="FTitle fuente">Medios sociales</h1>
          <p>Mantente al día por medio de nuestros canales sociales</p>
          <div className="contentRRPP socialGrid">
            <div>
              <i className="fab fa-twitter"></i>
            </div>
            <div>
              <i className="fab fa-facebook-f"></i>
            </div>
            <div>
              <i className="fab fa-youtube"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="columnRP contentRelationsPanel">
        <div className="panelRP">
          {
            currentVideoPlayer &&
            <div className="closeVideoRRPP" onClick={videoPLayerClose}><i className="fas fa-times"></i></div>
          }
          <div className="panelRPContainer">

            {
              currentVideoPlayer ?
              <div className="panelRPvideoPlayer">
                  <YouTubePlayer
                   id="VideoPRContainer"
                   width="100%"
                   height="100%"
                   url={currentVideoUrl}
                   playing={playingVideo}
                   // muted={muted}
                   // onProgress={this.onProgress}
                   // onDuration={this.onDuration}
                   controls
                   // onStart={this.goFull}
                   // onPlay={this.goFull}
                   // onPause={this.minimize}
                   // onEnded={this.siguiente}
                  />
              </div>
              :
              <div className="panelRPClicker">
                {
                  currentNew.media_type !== 'video' ?
                  <a className="fuente" href={currentNew.link} target="_blank" rel="noopener noreferrer" >Ver en {currentNew.social_network}</a>
                  :
                  <p className="fuente" onClick={reproducir}>Reproducir</p>
                }
              </div>
            }


              <div className="panelRPimgCont" style={{width:`${panel_new.length}00%`, left:`-${currentNew.id-1}00%`, gridTemplateColumns:`repeat(${panel_new.length}, 1fr)`}}>
                {
                  !currentVideoPlayer &&  panel_new.map(item => {
                    return(
                      <div className="panelRPItem" key={item.id}>
                        <img src={item.src_img} width="100%" alt=""/>
                      </div>
                    )
                  })
                }
              </div>



            <div className="panelRPRailsContainer">

              <div className="panelRPRails" style={{height:`${panel_new.length}00%`, top:`-${currentNew.id-1}00%`, gridTemplateRows:`repeat(${panel_new.length}, 1fr)`}}>

                {
                  panel_new.map(item => {
                    return(
                      <div className="panelRPText" key={item.id}>
                        <div>
                          <IconSwitch icon={item.icon} size={40}/>
                        </div>
                        <div className="panelRPTextCont">
                          <h3 className="fuente">{item.title}</h3>
                          <p className="fuente panelRPTextContp">{item.description}</p>
                        </div>
                      </div>
                    )

                  })
                }

              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  )
}




const ArticleComponent = props =>{

  const { article } = props

  return(
    <a className="ArticleComponent" href={article.link} target="_blank" rel="noopener noreferrer">
      <div className="ArticleBrand">
        <img src={article.img} alt="" width="100%"/>
      </div>
      <h3 className="fuente">{article.title}</h3>
      <p className="fuente">{article.description}</p>
    </a>
  )

}




export default PublicRelationsContainer
