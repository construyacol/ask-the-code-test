import { useState, useEffect } from "react";
import { debounce } from "../utils";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", debounce(handleResize, 500));
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return [
    windowDimensions.width > 900,
    windowDimensions.width,
    windowDimensions.height,
  ];
}
