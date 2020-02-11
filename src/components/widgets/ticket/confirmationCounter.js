import React, { Component } from 'react'

class ConfirmationCounter extends Component {

  state = {
    ctx:null
  }

  draw_interval

  init_draw = async props => {
    let c = document.getElementById("myCanvas")
    await this.setState({
      ctx: c.getContext("2d")
    })

    this.draw_interval =  setInterval(()=>{
        this.draw(this.props.confirmations)
    }, 500)
  }


  draw = amount =>{
    const {
      ctx
    } = this.state

    if(!ctx){return false}
    clearInterval(this.draw_interval)

    ctx.beginPath()
    ctx.arc(150, 63, 50, 0, 2 * (Math.PI/100)*((100/this.props.total_confirmations)*amount))
    ctx.lineWidth = 3
    ctx.strokeStyle = 'white'
    ctx.stroke()
  }


  componentDidUpdate(prevProps) {
    if (this.props.confirmations !== prevProps.confirmations) {
        this.draw(this.props.confirmations)
    }
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
