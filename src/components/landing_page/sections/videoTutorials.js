import React, { Component, Fragment } from 'react'
import IconSwitch from '../../widgets/icons/iconSwitch'
import YouTubePlayer from 'react-player/lib/players/YouTube'

let playList = [
  {
    id:1,
    name:"create_account",
    videos:[
      {
        id:1,
        category_id:1,
        name:'register',
        url:"https://www.youtube.com/watch?v=zDOo57e7Xyw"
      },
      {
        id:2,
        category_id:1,
        name:'verify',
        url:"https://www.youtube.com/watch?v=xJpqMOCMR5I"
      },
    ]
  },
  {
    id:2,
    name:"deposit",
    videos:[
      {
        id:1,
        category_id:2,
        name:'fiat_deposit',
        url:"https://www.youtube.com/watch?v=7ohSjXZAcjQ"
      },
      {
        id:2,
        category_id:2,
        name:'crypto_deposit',
        url:"https://www.youtube.com/watch?v=maHEmS0GPlU"
      },
    ]
  },
  {
    id:3,
    name:"swap",
    videos:[
      {
        id:1,
        category_id:3,
        name:'crypto_fiat',
        url:"https://www.youtube.com/watch?v=5Yyz47ZsONE"
      },
      {
        id:2,
        category_id:3,
        name:'fiat_crypto',
        url:"https://www.youtube.com/watch?v=IBaSizQyC5g"
      },
    ]
  },
  {
    id:4,
    name:"withdraw",
    videos:[
      {
        id:1,
        category_id:4,
        name:'withdraw_crypto',
        url:"https://www.youtube.com/watch?v=5Yyz47ZsONE"
      },
      {
        id:2,
        category_id:4,
        name:'withdraw_fiat',
        url:"https://www.youtube.com/watch?v=IBaSizQyC5g"
      },
    ]
  }
]

class VideoTutorialContainer extends Component{

   state = {
     duration:0,
     totalProgressed:0,
     playList:playList,
     currentVideo:playList[3].videos[1],
     videoList:[],
     muted:true,
     playing:false
   }

   togglePlay = (payload) => {
     this.setState({
       playing:payload
     })
   }

   toggleMuted = (payload) => {
     this.setState({
       muted:payload
     })
   }

   componentDidMount(){
     this.props.loadMethodsOnParentComponent(this.togglePlay, this.toggleMuted)
   }


  onDuration = (duration) => {
    this.setState({duration})
  }

  onProgress = ({playedSeconds}) => {

    const { duration } = this.state
    const progressedSecond = parseInt(playedSeconds)
    const totalProgressed = parseInt((progressedSecond * 100)/duration)

    if(totalProgressed === this.state.totalProgressed){return false}
    this.setState({totalProgressed})
  }

  siguiente = (e) => {
    const { currentVideo } = this.state
    let category_index = currentVideo.category_id - 1
    let video_index = currentVideo.id - 1
    let video_length = this.state.playList[category_index].videos.length

    // Reproduzca el siguiente video solo si hay mas videos en la categoría actual
    if(currentVideo.id < video_length){
      // Siguiente video dentro de la misma categoría
      return this.setState({currentVideo:this.state.playList[category_index].videos[video_index+1], playing:true, muted:false})
    }

    //Si no, pase a la siguiente categoría reproduciendo el primer video de la misma
    if(currentVideo.id === video_length){
      // Siguiente Categoría
      if(!this.state.playList[category_index+1]){return this.setState({currentVideo:this.state.playList[0].videos[0]})}
      return this.setState({currentVideo:this.state.playList[category_index+1].videos[0], playing:true, muted:false})
    }
  }


  goto_video = async(e) => {
    let query = e.target.dataset.menu
    let result = []
    let videoList = []

    if(this.state.videoList.length<1){
      await this.state.playList.map(async(playListItem) => {
           await playListItem.videos.map(video => {
             return videoList.push(video)
           })
        })
      await this.setState({videoList})
    }else{
      videoList = this.state.videoList
    }

    await videoList.filter((item)=>{
                    return item.name.includes(query) && result.push(item)
                  })
    this.setState({currentVideo:result[0], playing:true, muted:false})
  }


  render(){

    let movil = window.innerWidth<768

    const {
      muted,
      playing
    } = this.state


    // console.log('PLAYLIST STRUCTURE =======> ', this.state)
    const { totalProgressed, currentVideo } = this.state
    let iconSize = window.innerWidth<768 ? 17 : 25

    return(


      <Fragment>
        {
          movil &&
          <h2 className="titleSections fuente colorTitleLanding">Un Producto <span className="fuente">intuitivo y facil</span> de usar</h2>
        }

      <div className="VideoTutorialContainer">

        <div className="VideoTutorialMenu" id="VideoTutorialMenu">

      {
        movil ?

        <div className="videoMovilContainer">
                  <VideoPlayerComponent
                    currentVideo={currentVideo}
                    playing={playing}
                    muted={muted}
                    onProgress={this.onProgress}
                    onDuration={this.onDuration}
                    onEnded={this.siguiente}
                  />
        </div>
        :
        <div className="videoTitleCont" >
          <IconSwitch
            icon="ux"
            color="#0085e0"
            size={35}
          />
          <p className="fuente">Un producto <span className="">intuitivo</span> y fácil de usar</p>
        </div>
      }


          <div className="VideoMenuCont">
            <div className={`videoMenCItem ${currentVideo.category_id === 1 ? 'active' : ''} `}>
              {
                currentVideo.category_id === 1 &&
                <VideoProgressBar progress={totalProgressed}/>
              }
              <div className="videoMenCItemTitle">
                <IconSwitch
                  icon="account"
                  color="#0085e0"
                  size={iconSize}
                />
                <p className="fuente">Crea tu cuenta</p>
              </div>
              <div className="videoMenCItems">
                <p data-menu="register" onClick={this.goto_video} className={`VTCItem ${currentVideo.name === 'register' ? 'active' : ''}`}>Regístrate</p>
                <p data-menu="verify" onClick={this.goto_video} className={`VTCItem ${currentVideo.name === 'verify' ? 'active' : ''}`}>Verifícate</p>
              </div>
            </div>

            <div className={`videoMenCItem ${currentVideo.category_id === 2 ? 'active' : ''} `}>
              {
                currentVideo.category_id === 2 &&
                <VideoProgressBar progress={totalProgressed}/>
              }
              <div className="videoMenCItemTitle">
                <IconSwitch
                  icon="deposit"
                  color="#0085e0"
                  size={iconSize}
                />
                <p className="fuente">Deposita</p>
              </div>
              <div className="videoMenCItems">
                <p data-menu="fiat_deposit" onClick={this.goto_video} className={`VTCItem ${currentVideo.name === 'fiat_deposit' ? 'active' : ''}`}>Fiat</p>
                <p data-menu="crypto_deposit" onClick={this.goto_video} className={`VTCItem ${currentVideo.name === 'crypto_deposit' ? 'active' : ''}`}>Crypto</p>
              </div>
            </div>

            <div className={`videoMenCItem ${currentVideo.category_id === 3 ? 'active' : ''} `}>
              {
                currentVideo.category_id === 3 &&
                <VideoProgressBar progress={totalProgressed}/>
              }
              <div className="videoMenCItemTitle">
                <IconSwitch
                  icon="swap"
                  color="#0085e0"
                  size={iconSize}
                />
                <p className="fuente">Intercambia</p>
              </div>
              <div className="videoMenCItems">
                <p data-menu="crypto_fiat" onClick={this.goto_video} className={`VTCItem ${currentVideo.name === 'crypto_fiat' ? 'active' : ''}`}>Crypto => Fiat</p>
                <p data-menu="fiat_crypto" onClick={this.goto_video} className={`VTCItem ${currentVideo.name === 'fiat_crypto' ? 'active' : ''}`}>Fiat => Crypto</p>
              </div>
            </div>

            <div className={`videoMenCItem ${currentVideo.category_id === 4 ? 'active' : ''} `} id="section_video">
              {
                currentVideo.category_id === 4 &&
                <VideoProgressBar progress={totalProgressed}/>
              }
              <div className="videoMenCItemTitle">
                <IconSwitch
                  icon="withdraw"
                  color="#0085e0"
                  size={iconSize}
                />
                <p className="fuente">Retira</p>
              </div>
              <div className="videoMenCItems">
                <p data-menu="withdraw_crypto" onClick={this.goto_video} className={`VTCItem ${currentVideo.name === 'withdraw_crypto' ? 'active' : ''}`}>Crypto</p>
                <p data-menu="withdraw_fiat" onClick={this.goto_video} className={`VTCItem ${currentVideo.name === 'withdraw_fiat' ? 'active' : ''}`}>Fiat</p>
              </div>
            </div>
          </div>

        </div>

        <div className="videoTutorialContainers">
          {
            !movil &&
            <VideoPlayerComponent
              currentVideo={currentVideo}
              playing={playing}
              muted={muted}
              onProgress={this.onProgress}
              onDuration={this.onDuration}
              onEnded={this.siguiente}
            />
          }

        </div>

      </div>
    </Fragment>
    )
  }


}




const VideoPlayerComponent = props => {

  const { currentVideo, playing, muted, onProgress, onDuration, siguiente  } = props

  return(
    <div className="videoTutorialContent">
      <div className="configFrameWorkMac contentVideoFrame">
        <div id="VideoTutorialCont">
          <YouTubePlayer
           id="VideoTutorialContainer"
           width="100%"
           height="100%"
           url={currentVideo.url}
           playing={playing}
           muted={muted}
           onProgress={onProgress}
           onDuration={onDuration}
           controls
           // onStart={this.goFull}
           // onPlay={this.goFull}
           // onPause={this.minimize}
           onEnded={siguiente}
          />
        </div>
      </div>
      {/* <div className="configFrameWorkMac FrameWorkMac">
        <img src={macbook} alt="" height="100%" width="100%"/>
      </div> */}
    </div>
  )
}


const VideoProgressBar = props =>{

  const { progress } = props

  return(
    <div className="videoBar">
      <div className="videoBarProgress" style={{width:`${progress}%`}} ></div>
    </div>
  )

}

export default VideoTutorialContainer
