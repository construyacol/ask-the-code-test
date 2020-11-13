import React, { useState, useEffect } from "react";
import "./sound_player.css";
import SiriWave from "siriwave";

export default (props) => {
  const [playing, setPlaying] = useState(true);
  const [siriWave, setSiriWave] = useState(false);

  useEffect(() => {
    init_component();
  }, []);

  const init_component = async () => {
    let siriFunc = await new SiriWave({
      container: document.getElementById("siri-container"),
      width: 150,
      height: 45,
      amplitude: 0.01,
      speed: 0.2,
      color: "#1ea4ff",
      style: "ios",
    });

    siriFunc.start();
    setSiriWave(siriFunc);
  };

  const play = () => {
    setPlaying(false);
    siriWave.setAmplitude(0.6);
    console.log("PLAY");
    // siriWave.start()
  };

  const pause = () => {
    setPlaying(true);
    siriWave.setAmplitude(0.01);
    console.log("PAUSE");
    // siriWave.stop()
  };

  return (
    <div className={`Soundplayer ${props.className}`}>
      <div className="SoundplayerContent">
        <div>
          {!playing ? (
            <div className="toggleSoundPButtom paused" onClick={pause}>
              <i className="fas fa-pause"></i>
            </div>
          ) : (
            <div className="toggleSoundPButtom play" onClick={play}>
              <i className="fas fa-play"></i>
            </div>
          )}
        </div>
        <div className="SoundPlayerRola">
          <p className="fuente">
            {props.current_sound && props.current_sound.faq}
          </p>
          <span></span>
        </div>
        <div className="siriContainer">
          <div id="siri-container"></div>
        </div>
      </div>
    </div>
  );
};
