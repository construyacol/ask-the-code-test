import React, { Component, Fragment } from 'react';
import SimpleLoader from '../loaders'

import * as d3 from 'd3'
import './sAmerica.css';

let svg,
    path,
    countriesGroup,
    zoom,
    minZoom,
    maxZoom,
    w = 3000,
    h = 1250,
    projection,
    active = d3.select(null);

class SAmerica extends Component {

  state = {
    current_data:{
      country:null
    }
  }


  componentDidMount(){
    this.geoProd()
    //console.log('componentDidMount', document.getElementById('map').clientWidth)
  }

  // zoom to show a bounding box, with optional additional padding as percentage of box size
  boxZoom = (box, centroid, paddingPerc, d, this_index, paths) => {

    const { properties } = d
    let country = properties.admin.toLowerCase()

    const { available_countries, select_country_component } = this.props
    let available_country = available_countries[country]
    if(!available_country){return false}

    active.classed("active", false);

    const { current_data } = this.state
    if(country === current_data.country) return this.reset();

    // console.log('||||||| Find PATH', paths[this_index])
    let _this = paths[this_index]
    active = d3.select(_this).classed("active", true);

    let minXY = box[0];
    let maxXY = box[1];
    // find size of map area defined
    let zoomWidth = Math.abs(minXY[0] - maxXY[0]);
    let zoomHeight = Math.abs(minXY[1] - maxXY[1]);
    // find midpoint of map area defined
    let zoomMidX = centroid[0];
    let zoomMidY = centroid[1];
    // increase map area to include padding
    zoomWidth = zoomWidth * (1 + paddingPerc / 100);
    zoomHeight = zoomHeight * (1 + paddingPerc / 100);
    // find scale required for area to fill svg
    let maxXscale = document.getElementById('svg_map').clientWidth / zoomWidth;
    let maxYscale = document.getElementById('svg_map').clientHeight / zoomHeight;
    let zoomScale = Math.min(maxXscale, maxYscale);
    // handle some edge cases
    // limit to max zoom (handles tiny countries)
    zoomScale = Math.min(zoomScale, maxZoom);
    // limit to min zoom (handles large countries and countries that span the date line)
    zoomScale = Math.max(zoomScale, minZoom);
    // Find screen pixel equivalent once scaled
    let offsetX = zoomScale * zoomMidX;
    let offsetY = zoomScale * zoomMidY;
    // Find offset to centre, making sure no gap at left or top of holder
    let dleft = Math.min(0, document.getElementById('svg_map').clientWidth / 2 - offsetX);
    let dtop = Math.min(0, document.getElementById('svg_map').clientHeight / 2 - offsetY);
    // Make sure no gap at bottom or right of holder
    dleft = Math.max(document.getElementById('svg_map').clientWidth - w * zoomScale, dleft);
    dtop = Math.max(document.getElementById('svg_map').clientHeight - h * zoomScale, dtop);
    // set zoom
    svg
      .transition()
      .duration(500)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
      );

    this.setState({
      current_data:{
        country:country
      }
    })

    if(select_country_component){
      let data={
        target:{
          value:country
        }
      }
      select_country_component(data, true)
    }

  }


  reset = () =>{
    // svg.classed("active", false);
    active = d3.select(null);
    this.setState({
      current_data:{
      country:null,
      path:null
    }})
    this.initiateZoom()
  }

  // Function that calculates zoom/pan limits and sets zoom to default value
  initiateZoom = () => {
    minZoom = Math.max(document.getElementById('map-holder').clientWidth / w, document.getElementById('map-holder').clientHeight / h);
    maxZoom = 20 * minZoom;
    // set extent of zoom to chosen values
    // set translate extent so that panning can't cause map to move out of viewport
    zoom
      .scaleExtent([minZoom, maxZoom])
      .translateExtent([[0, 0], [w, h]])
    ;
    // define X and Y offset for centre of map to be shown in centre of holder
    let midX = (document.getElementById('map-holder').clientWidth - minZoom * w) / 2;
    let midY = (document.getElementById('map-holder').clientHeight - minZoom * h) / 2;
    // change zoom transform to min zoom and centre offsets
    svg
    .transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(minZoom));
  }

  geoProd = () => {

          projection = d3
            .geoEquirectangular()
            .center([-60, -25])
            .scale(700)
            .translate([w / 2, h / 2])
          ;
          // Define map path
          path = d3
            .geoPath()
            .projection(projection)
          ;
          // Create function to apply zoom to countriesGroup
          // Define map zoom behaviour
          zoom = d3
            .zoom()
            .on("zoom", zoomed)
          ;
          // create an SVG
          svg = d3
            .select("#map-holder")
            .append("svg")
            // set to the same size as the "map-holder" div
            .attr("id", 'svg_map')
            .attr("width", document.getElementById('map-holder').clientWidth)
            .attr("height", document.getElementById('map-holder').clientHeight)
            // add zoom functionality
            // .call(zoom)
          ;

          countriesGroup = svg.append("g").attr("id", "map");

          function zoomed() {
            let t = d3
              .event
              .transform
            ;
            countriesGroup
              .attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")")
            ;
          }

          // window.addEventListener("resize", ()=>{
          //   svg
          //     .attr("width", document.getElementById('map').clientWidth)
          //     .attr("height", document.getElementById('map').clientHeight)
          //   ;
          //   initiateZoom();
          //
          // });

          // get map data
          d3.json(
            // "https://api.myjson.com/bins/gc29i",
            "https://api.jsonbin.io/b/5c904d232d33133c40168935",
            async(json) => {

              const {
                action_loader,
                available_countries
              } = this.props

              await action_loader(false)

              // draw a path for each feature/country
              countriesGroup
                .selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("stroke", "white")
                .attr("id", function(d, i) {
                  return d.properties.admin.toLowerCase();
                })
                .attr("fill", (data) => {
                  let filled = available_countries && available_countries[data.properties.admin.toLowerCase()]
                  if(!filled){return "#e8e8e8"}
                  return "#dadada"
                })
                .attr("class", (data) => {
                  let filled = available_countries && available_countries[data.properties.admin.toLowerCase()]
                  if(!filled){return ""}
                  return "available_country"
                })
                .on("click", (d, i, p) => {
                    // d3.selectAll(".country").classed("country-on", false);
                    // d3.select(this).classed("country-on", true);
                this.boxZoom(path.bounds(d), path.centroid(d), 20, d, i, p);
                });

              this.initiateZoom();
            }
          );

          // drawMaps = async(geojson) => {
          //
          //   const {
          //     action_loader,
          //     available_countries
          //   } = this.props
          //
          //
          //   map.selectAll("path")
          //     .data(geojson.features)
          //     .enter()
          //     .append("path")
          //     .attr("d", path)
          //     .attr("stroke", "white")
          //     .attr("fill", (data) => {
          //       let filled = available_countries && available_countries[data.properties.admin.toLowerCase()]
          //       if(!filled){return "#f1f1f1"}
          //       return "#dadada"
          //     })
          //     .attr("class", (data) => {
          //       let filled = available_countries && available_countries[data.properties.admin.toLowerCase()]
          //       if(!filled){return ""}
          //       return "available_country"
          //     })
          //     .on("click", (d, i) => {
          //       return this.boxZoom(path.bounds(d), path.centroid(d), 20);
          //     });
          //     // .on('mouseover', mouseover)
          //     // .on('mouseout', mouseout)
          //     // .on("click", this.clicked);
          //     // console.log('DrawMaps => ::', geojson)
          //     // console.log('DrawMaps => ::', map.select())
          //     // map.select("path").classed("active", true);
          // }

  }











  render() {

    const{
      loader
    } = this.props

    return (
          <div id="map-holder">
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
