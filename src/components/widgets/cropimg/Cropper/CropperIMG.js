import React, { useState } from "react";
import Cropper from "react-easy-crop";
import BarSlider from "./BarSlider";

const MAX_ZOOM = 3;
const MIN_ZOOM = 0.5;
const ASPECT = 4 / 3;
const SLIDER_STEP = 0.05;

export default function CropperIMG({ image, onCropComplete }) {
  const [crop, setChange] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [deg, setDeg] = useState(360);
  return (
    <>
      <div className="crop-container">
        <Cropper
          image={image}
          style={
            {
              cropAreaStyle: {
                minWidth: 256,
                minHeight: 192
              }
            }
          }
          rotation={deg}
          onRotationChange={setDeg}
          crop={crop}
          aspect={ASPECT}
          zoom={zoom}
          onCropChange={setChange}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="crop-controls">
        <div>
          <span>Zoom</span>
          <BarSlider value={zoom} onChange={(e) => setZoom(e.currentTarget.value)} step={SLIDER_STEP} min={MIN_ZOOM} max={MAX_ZOOM} />
        </div>
        <div>
          <span>Rotación</span>
          <span className="crop-rotate-button" onClick={() => {
            const newDeg = deg - 90;
            setDeg(newDeg < 0 ? 360 : newDeg)
          }} ><i className="fa fa-undo" aria-hidden="true"></i></span>
        </div>
      </div>
    </>
  )
}
