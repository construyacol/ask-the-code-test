import React, { Component, Fragment } from 'react'
import './cubic.css'


class CubicMessageComponent extends Component {

  render(){

    const{
      settings
    } = this.props

    const{
      cubicMessage,
      backgroundColor,
      color,
      rotate
    } = settings


    return(
      <Fragment>
      <div className="scene" onClick={this.cubeRotate}>
        <div className={`cube ${rotate ? 'show-top' : 'show-front'}`}>
          <div className="cube__face cube__face--front fuente">{this.props.children}</div>
          <div className="cube__face cube__face--top fuente" style={{background:backgroundColor ? backgroundColor : 'white', color:color ? color : 'gray'}}>{cubicMessage}</div>
        </div>
      </div>
      </Fragment>
    )
  }
}

export default CubicMessageComponent
