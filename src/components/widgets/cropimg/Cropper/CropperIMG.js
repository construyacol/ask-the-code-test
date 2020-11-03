import React, { useState } from "react";
import Cropper from "react-easy-crop";
import BarSlider from "./BarSlider";
import { AiOutlineMinus } from "react-icons/ai";
import { FiRotateCcw, FiPlus } from "react-icons/fi";

const MAX_ZOOM = 3;
const MIN_ZOOM = 0.5;
const ASPECT = 4 / 3;
const SLIDER_STEP = 0.05;

export default function CropperIMG({ image, onCropComplete }) {
  const [crop, setChange] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [deg, setDeg] = useState(360);

  return (
    <>
      <div className="crop-container">
        <Cropper
          image={image}
          style={{
            cropAreaStyle: {
              minWidth: 256,
              minHeight: 192,
            },
          }}
          rotation={deg}
          onRotationChange={setDeg}
          crop={crop}
          aspect={ASPECT}
          zoom={zoom}
          onCropChange={setChange}
          onZoomChange={setZoom}
          onCropComplete={(_, croppedAreaPixels) =>
            onCropComplete(croppedAreaPixels, deg)
          }
        />
      </div>
      <div className="crop-controls">
        <div>
          <AiOutlineMinus
            color="gray"
            size={20}
            onClick={() => zoom > 0.1 && setZoom(zoom - 0.3)}
          />
          <BarSlider
            value={zoom}
            onChange={(e) => setZoom(e.currentTarget.value)}
            step={SLIDER_STEP}
            min={MIN_ZOOM}
            max={MAX_ZOOM}
          />
          <FiPlus
            color="gray"
            size={20}
            onClick={() => zoom < 7 && setZoom(zoom + 0.3)}
          />
        </div>
        <div>
          <FiRotateCcw
            color="gray"
            size={20}
            onClick={() => {
              const newDeg = deg - 90;
              setDeg(newDeg < 0 ? 360 : newDeg);
            }}
          />
        </div>
      </div>
    </>
  );
}
