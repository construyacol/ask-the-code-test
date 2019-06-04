import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import screenfull from 'screenfull'
import './videoPlayer.css'

class VideoPlayer extends Component {
  onClickFullscreen = () => {
    const el = document.getElementById('ReactPlayer');
    document.getElementById('button').addEventListener('click', () => {
    if (screenfull.enabled) {
        screenfull.request(el);
    }
    });
    // screenfull.request(findDOMNode(this.refs.player))
  }
  render () {
    return(
    <div>
      <ReactPlayer
       width="300px"
       height="200px"
       id="ReactPlayer"
       controls
       url='https://www.youtube.com/watch?v=oUwxqg90Zc4'
       playing
       config={{ iframeParams: { fullscreen: 0 } }}
      />
      <button onClick={this.onClickFullscreen} id="button">Fullscreen</button>
    </div>)

  }
}

export default VideoPlayer
