import React, { Component } from "react";
import Slider from "react-slick";
import ItemLayout from "../../items/itemLayout";
import "./slide.css";

export default class SliderComponent extends Component {
  state = {
    currencies: this.props.items,
  };

  aftercillo = async (indice) => {
    this.props.select_currency(this.state.currencies[indice].name);
  };

  render() {
    const { items, currency, select_currency } = this.props;

    const settings = {
      dots: false,
      focusOnSelect: true,
      infinite: true,
      speed: 100,
      slidesToShow: 1,
      slidesToScroll: 1,
      className: "center",
      centerMode: true,
      afterChange: this.aftercillo,
    };

    return (
      <section className="SliderComponent">
        <Slider {...settings}>
          {items.map((item) => {
            return (
              <div key={item.id} className="SliderComponentItem">
                <ItemLayout
                  actives={currency === item.name && true}
                  {...item}
                  actualizarEstado={select_currency}
                />
              </div>
            );
          })}
        </Slider>
      </section>
    );
  }
}
