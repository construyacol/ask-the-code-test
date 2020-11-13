import React, { Component } from "react";
import styled from "styled-components";

export default class ConfirmationCounter extends Component {
  state = {
    ctx: null,
    total: 6,
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
    ctx.beginPath();
    ctx.arc(150, 63, 58, 0, ((2 * Math.PI) / 100) * tasaPercent);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1cb179";
    ctx.stroke();
    // ctx.closePath()
  };

  async componentDidUpdate(prevProps) {
    if (this.props.confirmations !== prevProps.confirmations) {
      await this.setState({ loader: true });
      this.draw(this.props.confirmations);
    }
  }

  async componentDidMount() {
    await this.setState({ loader: true });
    this.draw_interval = setInterval(() => {
      this.draw(this.props.confirmations);
    }, 250);
  }

  render() {
    const { confirmations, total_confirmations } = this.props;

    const { color } = this.state;

    return (
      <AbsoluteContainer2>
        <RelativeContainer>
          <AbsoluteContainer>
            <ContCanvasConfirmation>
              <ConfirmationContainer>
                <TextContainer>
                  <p className="fuente2">
                    {confirmations}
                    <span>
                      / {total_confirmations ? total_confirmations : "6"}
                    </span>
                  </p>
                </TextContainer>
              </ConfirmationContainer>
              {!this.state.loader && (
                <Canvas id="myCanvas" width="300" height="125" />
              )}
            </ContCanvasConfirmation>
          </AbsoluteContainer>
        </RelativeContainer>
      </AbsoluteContainer2>
    );
  }
}

const AbsoluteContainer = styled.div`
  position: absolute;
`;

const AbsoluteContainer2 = styled(AbsoluteContainer)`
  right: 0;
  transform: scale(0.9);
`;

const RelativeContainer = styled.div`
  width: 130px;
  height: 170px;
  position: relative;
  display: grid;
  align-items: center;
  justify-items: center;
`;

const ConfirmationContainer = styled.div`
  width: 80px;
  height: 50%;
  position: absolute;
  align-self: center;
  justify-self: center;
  display: grid;
  align-items: center;
  justify-items: center;
  p {
    font-size: 30px;
    margin: 0;
  }
`;

const TextContainer = styled.div`
  width: 80px;
  height: 50%;
  position: absolute;
  align-self: center;
  justify-self: center;
  display: grid;
  align-items: center;
  justify-items: center;
  p {
    font-size: 30px;
    color: #1cb179;
    margin: 0;
  }
  span {
    color: #1cb179;
    margin-left: 5px;
    font-size: 18px;
  }
`;

const CounterText = styled.article`
  color: ${(props) => (props.color ? `${props.color} !important` : "red")};
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
`;

const Canvas = styled.canvas`
  transform: rotate(-90deg);
  transition: 0.3s;
`;

//
