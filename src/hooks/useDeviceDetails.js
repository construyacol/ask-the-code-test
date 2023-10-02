import { useState, useEffect } from 'react';
import { OS } from 'const/device'


function useDeviceDetails() {
  const [deviceDetails, setDeviceDetails] = useState({
    brand: undefined,
    browser: undefined,
    os: undefined
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;

    // Determinar el navegador
    let browser = undefined;
    if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
    else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) browser = "Opera";
    else if (userAgent.indexOf("Trident") > -1) browser = "Internet Explorer";
    else if (userAgent.indexOf("Edge") > -1) browser = "Edge";
    else if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Safari";

    // Determinar el sistema operativo
    let os = undefined;
    if (/android/i.test(userAgent)) os = OS.ANDROID;
    else if (/iPad|iPhone|iPod/.test(userAgent)) os = OS.IOS;
    else if (/Mac OS X/.test(userAgent)) os = OS.MAC_OS;
    else if (/Linux/.test(userAgent)) os = OS.LINUX;
    else if (/Windows NT/.test(userAgent)) os = OS.WINDOWS;

    // Determinar la marca (esto es un poco más complicado y menos confiable)
    let brand = undefined;
    if (/samsung/i.test(userAgent)) brand = "Samsung";
    else if (/huawei/i.test(userAgent)) brand = "Huawei";
    else if (/iphone|ipad|ipod/i.test(userAgent)) brand = "Apple";

    // Este es solo un conjunto básico de marcas y puede necesitar ser expandido dependiendo de tus necesidades.

    setDeviceDetails({
      browser,
      os,
      brand
    });

  }, []);

  return deviceDetails;
}

export default useDeviceDetails;
