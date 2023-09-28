import { CAPACITOR_PLATFORM, IS_NATIVE_PLATFORM } from 'const/const';
import { OS } from 'const/device';
import { useAppVersion } from "hooks/useAppVersion";
import useDeviceDetails from 'hooks/useDeviceDetails';
import useViewport from 'hooks/useViewport'
import loadable from "@loadable/component";

const APP_SCHEME = 'sendapp://'
const AppDisclaimerView = loadable(() => import(/* webpackPrefetch: true */ "./view"));

export default function AppNotificationView() {

  const isAppOutdated = useAppVersion();
  const { os } = useDeviceDetails()
  const { isMobile } = useViewport();

  if(isAppOutdated) return <AppDisclaimerView 
    isMobile={isMobile} 
    uiLabel='Actualizar'
    uiMessage='Una nueva version de la aplicación esta disponible'
    platform={CAPACITOR_PLATFORM}
  />
  if((isMobile && !IS_NATIVE_PLATFORM) && os === OS.IOS)return <AppDisclaimerView 
    isMobile={isMobile} 
    uiMessage='Descarga la aplicación para continuar operando'
    title='DESCARGAR EN'
    platform={os}
    callback={() => window.location.href = APP_SCHEME} 
  />
  return <></>
}



