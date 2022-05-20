import { useState, useEffect } from "react";
import { size } from '../const/const'

export default function useViewport() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const isMovilViewport = width < 768;
  const isTabletOrMovilViewport = width < 970;
  const isLaptopViewport = width >= size.mobile && width <= size.laptop

  return { width, isMovilViewport, isTabletOrMovilViewport, isLaptopViewport };
}
