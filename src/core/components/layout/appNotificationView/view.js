import { Layout, ContentContainer } from './styles';
import { AppstoreButtom } from 'core/components/molecules'
import { P } from 'core/components/atoms'
import { APP_STORE_DATA, DEFAULT_STORE_BY_OS } from 'const/appStore'
import logo from 'assets/logo.png'
import { useEffect } from 'react';

export default function AppDisclaimerView({ 
    isMobile, 
    platform, 
    uiLabel, 
    title,
    uiMessage = '',
    callback
  }){
  
    const handleClick = (e) => {
      if(isMobile && APP_STORE_DATA[DEFAULT_STORE_BY_OS[platform]])return window.location.href = APP_STORE_DATA[DEFAULT_STORE_BY_OS[platform]]?.link
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => callback && callback(), [])
  
    return(
      <Layout>
        <ContentContainer>
          <img src={logo} alt="" height={50} />
          <P className={'text-center'}>{uiMessage}</P>
          <AppstoreButtom  
              defaultStore={(isMobile && DEFAULT_STORE_BY_OS[platform]) ? DEFAULT_STORE_BY_OS[platform] : ''} 
              uiLabel={uiLabel}
              title={title}
              handleClick={handleClick} 
          />
        </ContentContainer>
      </Layout>
    )
  }