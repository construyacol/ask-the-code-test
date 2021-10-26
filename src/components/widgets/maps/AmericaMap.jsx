import React, { useEffect, useState } from 'react'
import SimpleLoader from '../loaders'
import { getCdnPath } from '../../../environment'
import loadDynamicScript from '../../../utils/loadDynamicScript'

import './sAmerica.css'


const AmericaMap = ({
    availableCountries,
    actionLoader,
    loader,
    setSelectedCountry, 
    // selectedCountry
}) => {

    const [wrapperid] = useState('map-holder')
    const getCountryName = (data) => data.properties.admin.toLowerCase()

    useEffect(() => {
        let d3Cdn = getCdnPath('d3')
        loadDynamicScript(
            () => {
                const d3 = window.d3
                const mapContainer = document.getElementById(wrapperid)
                if (!mapContainer) return

                const isFirefox = navigator && navigator.userAgent.toLowerCase().indexOf('firefox') > -1

                const currentData = {
                    country: null,
                }
                const w = 3000
                const h = 1250
                let active = d3.select(null)
                let minZoom = Math.max(
                    mapContainer.clientWidth / w,
                    mapContainer.clientHeight / h
                )
                let maxZoom = 20 * minZoom

                const projection = d3
                    .geoEquirectangular()
                    .center([-60, -25])
                    .scale(700)
                    .translate([w / 2, h / 2])
                // Define map path
                const path = d3.geoPath().projection(projection)
                // create an SVG
                const svg = d3
                    .select(`#${wrapperid}`)
                    .append('svg')
                    // set to the same size as the "map-holder" div
                    .attr('id', 'svg_map')
                    .attr('width', mapContainer.clientWidth)
                    .attr('height', mapContainer.clientHeight)
                // add zoom functionality
                // .call(zoom)

                const countriesGroup = svg.append('g').attr('id', 'map')
                
                // Create function to apply zoom to countriesGroup

                // Define map zoom behaviour
                const zoomed = ({ transform }) => {
                    let { x, y, k } = transform
                    countriesGroup.attr(
                        'transform',
                        'translate(' + [x, y] + ')scale(' + k + ')'
                    )
                }
                const zoom = d3.zoom().on('zoom', zoomed)
                // Function that calculates zoom/pan limits and sets zoom to default value
                const initiateZoom = () => {
                    // set extent of zoom to chosen values
                    // set translate extent so that panning can't cause map to move out of viewport
                    zoom.scaleExtent([minZoom, maxZoom]).translateExtent([
                        [0, 0],
                        [w, h],
                    ])
                    // define X and Y offset for centre of map to be shown in centre of holder
                    let midX = (mapContainer.clientWidth - minZoom * w) / 2
                    let midY = (mapContainer.clientHeight - minZoom * h) / 2
                    // change zoom transform to min zoom and centre offsets
                    svg.transition()
                        .duration(750)
                        .call(
                            zoom.transform,
                            d3.zoomIdentity.translate(midX, midY).scale(minZoom)
                        )
                }

                const boxZoom = (
                    box,
                    centroid,
                    paddingPerc,
                    data,
                    paths,
                    ppp
                ) => {
                    let country = getCountryName(data)
                    let available_country = availableCountries[country]
                    
                    if (!available_country) {
                        return false
                    }

                    active.classed('active', false)
                    active.classed('disabled', false)
                    // if (country === currentData.country) return reset()

                    d3.select('#map').selectAll('path').classed('active', false)
                    d3.select(ppp.target).classed('active', true)
                    currentData.country = country

                    if (isFirefox) {
                        return false
                    }

                    // setSelectedCountry(country)


                    const minXY = box[0]
                    const maxXY = box[1]
                    // find size of map area defined
                    let zoomWidth = Math.abs(minXY[0] - maxXY[0])
                    let zoomHeight = Math.abs(minXY[1] - maxXY[1])
                    // find midpoint of map area defined
                    const zoomMidX = centroid[0]
                    const zoomMidY = centroid[1]
                    // increase map area to include padding
                    zoomWidth = zoomWidth * (1 + paddingPerc / 100)
                    zoomHeight = zoomHeight * (1 + paddingPerc / 100)
                    // find scale required for area to fill svg
                    const maxXscale =
                        document.getElementById('svg_map').clientWidth /
                        zoomWidth
                    const maxYscale =
                        document.getElementById('svg_map').clientHeight /
                        zoomHeight
                    let zoomScale = Math.min(maxXscale, maxYscale)
                    // handle some edge cases
                    // limit to max zoom (handles tiny countries)
                    zoomScale = Math.min(zoomScale, maxZoom)
                    // limit to min zoom (handles large countries and countries that span the date line)
                    zoomScale = Math.max(zoomScale, minZoom)
                    // Find screen pixel equivalent once scaled
                    const offsetX = zoomScale * zoomMidX
                    const offsetY = zoomScale * zoomMidY
                    // Find offset to centre, making sure no gap at left or top of holder
                    let dleft = Math.min(
                        0,
                        document.getElementById('svg_map').clientWidth / 2 -
                            offsetX
                    )
                    let dtop = Math.min(
                        0,
                        document.getElementById('svg_map').clientHeight / 2 -
                            offsetY
                    )
                    // Make sure no gap at bottom or right of holder
                    dleft = Math.max(
                        document.getElementById('svg_map').clientWidth -
                            w * zoomScale,
                        dleft
                    )
                    dtop = Math.max(
                        document.getElementById('svg_map').clientHeight -
                            h * zoomScale,
                        dtop
                    )
                    // set zoom
                    svg.transition()
                        .duration(500)
                        .call(
                            zoom.transform,
                            d3.zoomIdentity
                                .translate(dleft, dtop)
                                .scale(zoomScale)
                        )
                }


                d3.json('https://api.jsonbin.io/b/5e961dcd5fa47104cea07454').then((json) => {
                    if (!json) return
                    actionLoader(false)
                    // draw a path for each feature/country
                    countriesGroup
                        .selectAll('path')
                        .data(json.features)
                        .enter()
                        .append('path')
                        .attr('d', path)
                        .attr('stroke', 'white')
                        .attr('id', (data) => getCountryName(data))
                        .attr('fill', (data) => {
                            const isValidCountry =
                                availableCountries &&
                                availableCountries[getCountryName(data)]

                            const filled = isValidCountry
                                ? '#cecdcd'
                                : '#e5e5e5'

                            return filled
                        })
                        .attr('class', (data) => {
                            const isValidCountry =
                                availableCountries &&
                                availableCountries[getCountryName(data)]

                            const filled = isValidCountry
                                ? 'available_country'
                                : ''

                            return filled
                        })
                        .on('click', (props, data) => {

                            const mapPaths = d3.select('#map').node().children
                            const country = getCountryName(data)
                            let selectedCountryElement = document.querySelector(`#${country}`)
                            const isActived = selectedCountryElement.classList.value.includes('active')
                            
                            console.log('isActive => ', isActived)

                            if(isActived){
                                // disabled country selection
                                selectedCountryElement.classList.remove('active')
                                setSelectedCountry({target:{value:null}}, true)
                                initiateZoom()

                            }else {
                                setSelectedCountry({target:{value:country}}, true)
                                boxZoom(
                                    path.bounds(data),
                                    path.centroid(data),
                                    20,
                                    data,
                                    mapPaths,
                                    props
                                )
                            }
                        })
                    initiateZoom()
                })
            },
            d3Cdn,
            'd3'
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wrapperid])

    return (
        <div id={wrapperid}>
            {loader && (
                <div className="mapLoader">
                    <SimpleLoader label="Cargando mapa" />
                </div>
            )}
        </div>
    )
}

export default AmericaMap
