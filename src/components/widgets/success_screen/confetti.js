import React, { Component } from 'react'
// import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

class ConfettiComponent extends Component {
  // const { width, height } = useWindowSize()

  state = {
    width:null,
    height:null
  }

  componentDidMount(){
    let intViewportWidth = window.innerWidth;
    let intViewportHeight = window.innerHeight;

    this.setState({width:intViewportWidth, height:intViewportHeight})
  }

  render(){
    const { width, height } = this.state
    let style = {
      position:'absolute',
      top:'0px',
      left:'-40px',
      width:width,
      height:height,
      zIndex:-1
    }
    return (
      <div style={style}>
        {
          (width && height) &&
          <Confetti
            width={width}
            height={height}
            numberOfPieces={80}
            gravity={0.05}
            recycle={true}
            opacity={0.6}
          />
        }
      </div>


    )
  }

}

export default ConfettiComponent
