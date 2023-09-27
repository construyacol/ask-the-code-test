import { CAPACITOR_PLATFORM } from 'const/const';
import { useAppVersion } from "hooks/useAppVersion";
import { Layout, ContentContainer } from './styles';
import { AppstoreButtom } from 'core/components/molecules'
import { P } from 'core/components/atoms'
import { APP_STORE_DATA, DEFAULT_STORE_BY_OS } from 'const/appStore'
import useViewport from 'hooks/useViewport'
import logo from 'assets/logo.png'


export default function AppNotificationView() {
  const isAppOutdated = useAppVersion();
  if(isAppOutdated) return <IsAppOutDatedView/>
  return <></>
}





const IsAppOutDatedView = () => {

  const { isMobile } = useViewport();
  const handleClick = (e) => {
    // if(!isMobile || (isMobile && e?.target?.dataset?.store_app === OS.ANDROID)) return openModal(MODAL_ID);
    if(isMobile && APP_STORE_DATA[DEFAULT_STORE_BY_OS[CAPACITOR_PLATFORM]])return window.location.href = APP_STORE_DATA[DEFAULT_STORE_BY_OS[CAPACITOR_PLATFORM]]?.link
  }

  return(
    <Layout>
      <ContentContainer>
        <img src={logo} alt="" height={50} />
        <P className={'text-center'}>Una nueva version de la aplicación esta disponible</P>
        <AppstoreButtom  
            defaultStore={(isMobile && DEFAULT_STORE_BY_OS[CAPACITOR_PLATFORM]) ? DEFAULT_STORE_BY_OS[CAPACITOR_PLATFORM] : ''} 
            uiLabel='Actualizar'
            title=''
            handleClick={handleClick} 
        />
      </ContentContainer>
    </Layout>
  )

}

