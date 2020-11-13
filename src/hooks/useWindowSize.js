import { useState, useEffect } from "react";

export default function useViewport() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const isMovilViewport = width < 768;
  const isTabletOrMovilViewport = width < 900;

  return { width, isMovilViewport, isTabletOrMovilViewport };
}
