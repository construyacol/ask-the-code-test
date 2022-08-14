import React, { Component } from "react";
import styled from "styled-components";

export default class DownCounter extends Component {
  state = {
    ctx: null,
    total: 20,
    loader: true,
    color: "#159e8c",
  };

  draw_interval;

  // init_draw = async props => {
  //   let c = document.getElementById("myCanvas")
  //   await this.setState({
  //     ctx: c.getContext("2d")
  //   })
  //

  draw = async (amount) => {
    // const {
    //   ctx
    // } = this.state
    await this.setState({ loader: false });
    let c = document.getElementById("myCanvas");
    if (!c) {
      return false;
    }
    const ctx = c.getContext("2d");
    clearInterval(this.draw_interval);
    let tasaPercent = (100 * amount) / this.state.total;
    await this.setState({
      color:
        amount <= 6
          ? "red"
          : amount <= 12
          ? "orange"
          : amount <= 20 && "#159e8c",
    });

    // console.log('||||| emitiendo ==> ')
    ctx.beginPath();
    ctx.arc(150, 63, 58, 0, ((2 * Math.PI) / 100) * tasaPercent);
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.state.color;
    ctx.stroke();
    // ctx.closePath()
  };

  async componentDidUpdate(prevProps) {
    if (this.props.current !== prevProps.current) {
      await this.setState({ loader: true });
      this.draw(this.props.current);
    }
  }

  async componentDidMount() {
    await this.setState({ loader: true });
    this.draw_interval = setInterval(() => {
      this.draw(this.props.current);
    }, 250);
  }

  render() {
    const { current } = this.props;

    const { color } = this.state;

    return (
      <ContCanvasConfirmation>
        <div className="confirmationCounterText fuente2">
          <CounterText color={color || "#159e8c"}>{current}</CounterText>
        </div>
        {!this.state.loader && (
          <Canvas id="myCanvas" width="300" height="125" />
        )}
      </ContCanvasConfirmation>
    );
  }
}

const CounterText = styled.article`
  color: ${(props) => (props.color ? `${props.color} !important` : "white")};
  font-size: 40px !important;
  margin: 0 !important;
  padding: 0 !important;
  align-self: center !important;
`;

const ContCanvasConfirmation = styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;
  align-items: center;
  justify-items: center;
  .confirmationCounterText{
    position:absolute;
  }
`;

const Canvas = styled.canvas`
  transform: rotate(-90deg);
  transition: 0.3s;
`;
