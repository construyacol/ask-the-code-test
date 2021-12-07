import { useState, useEffect } from "react";

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




export function debounce(func, wait) {
  //Previene over flows. Si el usuario en 1 seg da x cantidad de clicks solo ejecuta el último click
  // Esto surgió porque, podía darse, presionar muchas teclas a la vez en cuestión de milisegundos
  // Entonces, limite que solo reconozca la última acción en 100ms
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      func.apply(context, [...args, () => clearTimeout(timeout)]);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}