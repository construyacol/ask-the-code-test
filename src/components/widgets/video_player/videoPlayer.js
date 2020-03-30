import React, { Component } from 'react'
// import ReactPlayer from 'react-player'
import YouTubePlayer from 'react-player/lib/players/YouTube'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import Fullscreen from "react-full-screen";
import './videoPlayer.css'

class VideoPlayer extends Component {


  componentWillUnmount(){
    // YouTubePlayer.removeCustomPlayers()
  }

  state = {
    isFull:false
  }

  goFull = () => {
    this.setState({ isFull: true });
  }

  minimize = () => {
    this.setState({ isFull: false });
  }

  render () {

    const { video } = this.props
    const { isFull } = this.state

    return(
      <div className="VideoPlayer" style={{display:(video && video.play ? 'block' : 'none')}}>
        {
          video && video.play &&
            <div className="videoPlayerContainer">

                <div className="closeButtonPlayer" onClick={this.props.action.default_video_state}>
                    <i className="far fa-times-circle"></i>
                </div>

              <Fullscreen
                 enabled={isFull}
                 onChange={isFull => this.setState({isFull})}
               >
                       <YouTubePlayer
                        ref='player'
                        id="putis"
                        width="100%"
                        height="100%"
                        url={video.url}
                        playing={video.play}
                        controls
                        onStart={this.goFull}
                        // onPlay={this.goFull}
                        onPause={this.minimize}
                        onEnded={this.props.action.default_video_state}
                       />
              </Fullscreen>
            </div>
        }
      </div>
  )

  }
}


function mapStateToProps(state, props){

  const { user, user_id } = state.modelData
  const { videos, verification_state } = state.ui
  let verification_video = (verification_state === 'rejected' || !verification_state) ? 'kyc_basic' :
                           verification_state === 'pending' && 'kyc_advanced'

  return {
      user:user,
      video:videos[verification_video],
      verification_state
  }
}

function mapDispatchToProps(dispatch){
  return{
    action: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (VideoPlayer)
