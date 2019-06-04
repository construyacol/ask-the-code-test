import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import ReactDOM from 'react-dom'
import './videoPlayer.css'
import Fullscreen from "react-full-screen";

class VideoPlayer extends Component {


  componentDidMount(){
  }

  onClickFullscreen = async() => {

    this.goFull()
    // const el = document.getElementById('ReactPlayer');
    // console.log(document.getElementById('ReactPlayer'))
    // alert('')
    //   if (screenfull.enabled) {
    //       await screenfull.request(document.getElementById('ReactPlayer'));
    //   }
    // screenfull.request(ReactDOM.findDOMNode(this.refs.player))
  }

  state = {
    isFull:false
  }

  goFull = () => {
    this.setState({ isFull: true });
  }

  render () {
    return(
      <Fullscreen
         enabled={this.state.isFull}
         onChange={isFull => this.setState({isFull})}
       >
          <ReactPlayer
           ref='player'
           width="100%"
           height="100%"
           url='https://www.youtube.com/watch?v=oUwxqg90Zc4'
           // playing
           controls
           onStart={this.goFull}
          />
          <button onClick={this.goFull}>Fullscreen</button>
  </Fullscreen>
  )

  }
}

export default VideoPlayer
