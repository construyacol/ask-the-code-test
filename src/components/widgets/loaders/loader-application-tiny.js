import React from 'react'
import Coinsenda from '../icons/logos/coinsenda.js'
import './loader.css'

function LoaderAplicationTiny() {
    return (
        <div className={`LoaderAplication withOutContry`}>

            <div className={`LoaderContainer loaderLayout`}>
                <div />

                <div className="logotypes">
                    <Coinsenda size={50} color="white" />
                    <h1 className="fuente">Coinsenda</h1>
                </div>
                <p className="fuente">Iniciando</p>
            </div>
            <div className="KycprogressBar loader">
                <div className="kycPropgressed" style={{ width: 1 }}></div>
            </div>
        </div>

    )
}


export default LoaderAplicationTiny
