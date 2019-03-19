import React, { Component, Fragment } from 'react';
import SimpleLoader from '../loaders'

import * as d3 from 'd3'
import './sAmerica.css';

let map,
    path,
    active = d3.select(null);

class SAmerica extends Component {

  state = {
    current_data:{
      country:null,
      path:null
    }
  }

  componentDidMount(){
    this.geoProd()
  }

  geoProd = async() => {

    // let width = 900,
        // height = 768;

    let projection = d3.geoEquirectangular()
        .center([0, 15])
        .scale([this.props.width / (1.5 * Math.PI)]) // scale to fit group width
        .translate([this.props.width / 2, this.props.height / 2]) // ensure centred in group
        // .scale(400)
        // .center([-43.05569287116, -18.13722143558]);



    let zoom = d3.zoom()
    path = d3.geoPath().projection(projection);　
  	map = d3.select(".map")
  		.append("svg")
  		.attr("width", this.props.width)
  		.attr("height", this.props.height)
      // .on("click", stopped, true);

    // map.append("rect")
    //     .attr("class", "background")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .on("click", this.reset);

    d3.json("https://api.myjson.com/bins/gc29i", this.drawMaps);

  }


  drawMaps = async(geojson) => {

    const {
      action_loader,
      available_countries
    } = this.props

    await action_loader(false)

    map.selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "white")
      .attr("fill", (data) => {
        let filled = available_countries[data.properties.admin.toLowerCase()]
        if(!filled){return "#f1f1f1"}
        return "#dadada"
      })
      .attr("class", (data) => {
        let filled = available_countries[data.properties.admin.toLowerCase()]
        if(!filled){return ""}
        return "available_country"
      })
      // .on('mouseover', mouseover)
      // .on('mouseout', mouseout)
      .on("click", this.clicked);
      // console.log('DrawMaps => ::', geojson)
      // console.log('DrawMaps => ::', map.select())
      // map.select("path").classed("active", true);
  }


  clicked = (d, this_index , paths) => {

    let _this = paths[this_index]
    const { current_data } = this.state
    if(_this === current_data.path) return this.reset();
    const { properties } = d
    let country = properties.admin.toLowerCase()
    const { available_countries } = this.props
    let available_country = available_countries[country]
    if(!available_country){return false}

    active.classed("active", false);
    active = d3.select(_this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / this.props.width, dy / this.props.height))),
        translate = [this.props.width / 2 - scale * x, this.props.height / 2 - scale * y];

        map.transition().duration(750)
        .attr("transform", "translate(" + '350' + "," + '950' + ") scale(" + scale + ")"); //colombia
        // .attr("transform", "translate(" + '1000' + "," + '1600' + ") scale(" + scale + ")"); //ecuador
        // .attr("transform", "translate(" + '700' + "," + '800' + ") scale(" + scale + ")"); //peru


        // console.log('|||||||||| ---- PACK', _this, country)

        this.setState({
          current_data:{
          country:country,
          path:_this
        }})
  }

  reset = () => {
    active.classed("active", false);
    active = d3.select(null);
    this.setState({
      current_data:{
      country:null,
      path:null
    }})

    map.transition()
        .duration(750)
        .attr('transform', 'scale('+1+')translate(-63.05569287116, -11.13722143558)');
        // .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4
  }





  render() {

    const{
      loader
    } = this.props

    return (
          <div className="map">
            {
              loader &&
              <div className="mapLoader">
                <SimpleLoader
                  label="Cargando mapa"
                />
              </div>
            }
          </div>
    );
  }
}

export default SAmerica;
