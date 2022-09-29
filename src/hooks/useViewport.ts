import { useState, useEffect } from 'react';
import { size } from "const/const";
import { useViewportType } from 'interfaces/useViewport';

const isBrowser = () => typeof window !== 'undefined';

const viewportDefaultState = {
  "viewportWidth":0,
  "isMobile":0,
  "isLaptop":0,
  "isDesktop":0,
  "isCustom":0
}

export default function useViewport(customSize: Number | number = 0): useViewportType {

  const getViewportSizes = ():useViewportType => {
    if(isBrowser()){
      let clientWidth = document.documentElement.clientWidth
      let viewportSizes = {
        "viewportWidth":clientWidth,
        "isMobile": size.mobile >= clientWidth,
        "isLaptop": size.laptop >= clientWidth && size.mobile <= clientWidth,
        "isDesktop": size.desktop >= clientWidth && size.laptop <= clientWidth,
        "isCustom":customSize! > clientWidth
      }
      return viewportSizes
    }
    return viewportDefaultState
  }

  const [ viewportSizes, setViewportSizes ] = useState<useViewportType>(getViewportSizes())



  useEffect(() => {
    const handleWindowResize = () => setViewportSizes(getViewportSizes());
    window?.addEventListener('resize', handleWindowResize);
    return () => window?.removeEventListener('resize', handleWindowResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return viewportSizes;
}
