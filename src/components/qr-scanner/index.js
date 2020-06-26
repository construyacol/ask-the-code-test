import React, { useState } from 'react'
import QrReader from 'react-qr-reader'
import OtherModalLayout from '../widgets/modal/otherModalLayout'
import { useActions } from '../../hooks/useActions'
import styled from 'styled-components'
import { device } from '../../const/const'
import { MAIN_COLOR } from '../referrals/shareStyles'
import IconSwitch from '../widgets/icons/iconSwitch'
import { InputButton } from '../widgets/buttons/controlButton'

const QrScanner = (props) => {
    const [facingMode, setFacingMode] = useState(false)
    const actions = useActions()

    const closeModal = (e) => {
        if(e && e.name) {
            actions.mensaje(`Camara no disponible`, 'error')
        }
        actions.renderModal(null)
    }

    const handleScan = data => {
        if (data) {
            if (data.indexOf('?')) {
                data = data.slice(0, data.indexOf('?'))
            }
            props.onScan(data.slice(data.indexOf(':') + 1))
            closeModal()
        }
    }

    return <OtherModalLayout>
        <Container>
            <p>Escanear código QR</p>
            <div className="qr-scanner">
                <QrReader
                    delay={100}
                    facingMode={facingMode ? 'user' : 'environment'}
                    onError={closeModal}
                    onScan={handleScan}
                    style={{ width: '100%' }}

                />
            </div>
            <div>
                <InputButton type="primary" handleAction={closeModal} active={true} label="Cancelar" />
                <IconSwitch
                    icon="swap-camera"
                    color={"blue"}
                    onClick={() => setFacingMode(!facingMode)}
                    size={50} />
            </div>
        </Container>
    </OtherModalLayout>
}

const CornerPos = "-2px"
const CornerStyle = `2px solid ${MAIN_COLOR}`

const Container = styled.div`
    height: 100%;
    width: 25vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    p {
        color: white !important;
        font-family: 'Raleway';
        font-weight: bold;
        width: 100%;
        padding: 0 !important;
    }
    > .qr-scanner {
        width: 94%;
        position: relative;

        &:before, &:after, > section::before, > section::after {
            display: block;
            content: "";
            width: 30px;
            height: 30px;
            position: absolute;
        }

        &:before {
            top: ${CornerPos};
            left: ${CornerPos};
            border-top: ${CornerStyle};
            border-left: ${CornerStyle};
        }

        &:after {
            top: ${CornerPos};
            right: ${CornerPos};
            border-top: ${CornerStyle};
            border-right: ${CornerStyle};
        }

        > section::before {
            bottom: ${CornerPos};
            left: ${CornerPos};
            border-bottom: ${CornerStyle};
            border-left: ${CornerStyle};
        }

        > section::after {
            bottom: ${CornerPos};
            right: ${CornerPos};
            border-bottom: ${CornerStyle};
            border-right: ${CornerStyle};
        }

        > section > section > div {
            border: unset !important;
            box-shadow: unset !important;
            height: 4px !important;
            margin: auto;
            bottom: 0 !important;
            right: 0 !important;
            background: ${MAIN_COLOR}
        }

        video {
            top: 0;
            left: 0;
            bottom: 0 !important;
            right: 0 !important;
            margin: auto;
            width: 92% !important;
            height: 92% !important;
        }
    }

    > div:last-child {
        display: flex;
        margin-bottom: 15px;
        > div:first-child {
            margin-right: 8px;
        }
    }

    @media ${device.tabletL} {
        width: 100%;
        height: 100%;
        position: absolute;
    }
`

export default QrScanner