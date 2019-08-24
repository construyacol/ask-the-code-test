import React, { Component, Fragment } from 'react'
import Slider from "react-slick";
import IconSwitch from '../../widgets/icons/iconSwitch'
import '../css/sections.css'


export default class ReviewsComponent extends Component {


  render() {

    const settings = {
      dots: true,
      infinite: true,
      speed: 1050,
      autoplaySpeed: 12000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      pauseOnHover: false,
      swipeToSlide: true
    };

    return (
      <Fragment>

      <div className="extraSectionSlider"></div>
      <div className="SimpleSlider2">


        <div className="contImgsPictures right">
          <div className="imgPictureCircle uno"></div>
          <div className="imgPictureCircle dos"></div>
          <div className="imgPictureCircle tres"></div>
        </div>

        <div className="contImgsPictures left">
          <div className="imgPictureCircle cuatro"></div>
          <div className="imgPictureCircle cinco"></div>
          <div className="imgPictureCircle seis"></div>
        </div>


        <Slider ref={c => (this.slider = c)} {...settings}>

          <div className="SimpleSliderItem SimpleSliderItem2">
            <div className="titleSliderGroup">
              <h1 className="fuente" >Juan Carlos Duarte</h1>
              <div className="reviewStars">
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
              </div>
            </div>
            <div className="sliderReviewComent">
              <IconSwitch
                icon="comillas"
                size={50}
                color="gray"
              />
              <p className="fuente">Senda me acompañó en mi proceso de venta de BTC, la empresa tiene un excelente servicio al cliente, la plataforma es muy amigable y en general el proceso es muy transparente. Los recomiendo ampliamente.</p>
            </div>
          </div>


          <div className="SimpleSliderItem SimpleSliderItem2">
            <div className="titleSliderGroup">
              <h1 className="fuente" >Carlos puertas</h1>
              <div className="reviewStars">
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
              </div>
            </div>
            <div className="sliderReviewComent">
              <IconSwitch
                icon="comillas"
                size={50}
                color="gray"
              />
              <p className="fuente">Muy fácil y sencilla de usar, aparte muy segura, hacia falta ver algo así en Colombia hace tiempo, el mercado lo estaba necesitando.</p>
            </div>
          </div>


          <div className="SimpleSliderItem SimpleSliderItem2">
            <div className="titleSliderGroup">
              <h1 className="fuente" >Luis A Torres</h1>
              <div className="reviewStars">
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
              </div>
            </div>
            <div className="sliderReviewComent">
              <IconSwitch
                icon="comillas"
                size={50}
                color="gray"
              />
              <p className="fuente">Soy una persona de negocios y noto enseguida cuando hay una excelente gerencia detrás de un proyecto, felicidades Coinsenda.</p>
            </div>
          </div>

          <div className="SimpleSliderItem SimpleSliderItem2">
            <div className="titleSliderGroup">
              <h1 className="fuente" >Henry Rivera</h1>
              <div className="reviewStars">
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
                <i className="fas fa-star star_icon"></i>
              </div>
            </div>
            <div className="sliderReviewComent">
              <IconSwitch
                icon="comillas"
                size={50}
                color="gray"
              />
              <p className="fuente">impecable servicio. tasas de compra y venta muy justas y la rapidez del servicio es muy buena. recomiendo totalmente este servicio.</p>
            </div>
          </div>

        </Slider>
      </div>
    </Fragment>
    );
  }
}
