import React from 'react'
import loadable from '@loadable/component'
import './loader.css'

const Coinsenda = loadable(() => import('../icons/logos/coinsenda'))

function LoaderAplicationTiny() {
    return (
        <div className={`LoaderAplication withOutContry`}>

            <div className={`LoaderContainer loaderLayout`}>
                <div style={{
                    height: 60, width: 60
                }} />

                <div className="logotypes">
                    <Coinsenda size={50} color="white" />
                    <h1 className="fuente">Coinsenda</h1>
                </div>
                <p className="fuente">Iniciando</p>
            </div>
            <div className="KycprogressBar loader">
                <div className="kycPropgressed" style={{ width: 2 }}></div>
            </div>
        </div>

    )
}


export default LoaderAplicationTiny
