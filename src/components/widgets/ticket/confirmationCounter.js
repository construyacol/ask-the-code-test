import React, { Component, Fragment } from 'react'

class ConfirmationCounter extends Component {

  state = {
    ctx:null
  }

  init_draw = async props => {
    let c = document.getElementById("myCanvas")
    await this.setState({
      ctx: c.getContext("2d")
    })
  }


  draw = amount =>{
    const {
      ctx
    } = this.state

    // console.log(amount)
    if(!ctx){return false}

    ctx.beginPath()
    ctx.arc(150, 63, 50, 0, 2 * (Math.PI/100)*((100/this.props.total_confirmations)*amount))
    // ctx.arc(150, 63, 50, 0, 2 * (Math.PI/100)*(17*amount))
    ctx.lineWidth = 3
    ctx.strokeStyle = 'white'
    ctx.stroke()
  }

  componentWillReceiveProps(props){
    const {
      confirmations
    } = props

    this.draw(confirmations)

    // this.draw('||||||||| componentWillReceiveProps' ,confirmations)
  }

  componentDidMount(){
    this.init_draw()
  }

  render(){

    const {
      confirmations,
      total_confirmations
    } = this.props

    return(
      <section className="contCanvasConfirmation" >
        <div className="confirmationCounterText fuentePrin">
          <p>
            {confirmations}
            <span>/ {total_confirmations ? total_confirmations : '6'}</span>
          </p>
        </div>
        <canvas id="myCanvas" width="300" height="125"></canvas>
      </section>
    )

  }
}

export default ConfirmationCounter
