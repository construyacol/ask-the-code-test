import { useState, useRef, useEffect } from 'react'
import sleep from 'utils/sleep'
import { isEmpty } from 'lodash'
// import { _getCdnPath } from 'environment';

// COMPONENTS
import { P } from 'core/components/atoms'
// STYLES
import { 
  ButtonsContainer, 
  ButtonLayout,
  LogoContainer,
  AvailableIn,
  AppStoreDataContainer,
  StoreNameContainer
} from './styles';
// ASSETS

import { STORE_ASSETS, APP_STORE_DATA, AVAILABLE_STORES } from 'const/appStore'

const ITERATION_TIME = 4000



export default function AppstoreButtom({ 
  className = '',
  defaultStore = '',
  handleClick = () => null,
  size = 'large',
  title = 'DISPONIBLE EN',
  uiLabel = ''
}) {

  const [ currentStore, setCurrentStore ] = useState(defaultStore || 'googlePlay')
  const [ availableStores, setAvailableStores ] = useState({})
  const storeNameRef = useRef()
  const storeImgRef = useRef()

  const nextStore = async() => { 
    for (let appStoreKey in availableStores) {
      if (availableStores.hasOwnProperty(appStoreKey)) {
        await sleep(ITERATION_TIME)
        await changeStore(appStoreKey)
      }
    }
    return nextStore()
  }

  const changeStore = async(storeName) => {
    if(!storeImgRef.current && !storeNameRef.current)return;
    storeImgRef.current.classList.add('disappearStoreImg')
    storeNameRef.current.classList.add('disappearStoreName')
    await sleep(150)
    setCurrentStore(storeName)
    storeImgRef.current.classList.add('appearStoreImg')
    storeNameRef.current.classList.add('appearStoreName')
    await sleep(150)
    storeNameRef.current.classList.remove('disappearStoreName')
    storeNameRef.current.classList.remove('appearStoreName')
    storeImgRef.current.classList.remove('disappearStoreImg')
    storeImgRef.current.classList.remove('appearStoreImg')
  }

  useEffect(() => {
    if(!isEmpty(availableStores) && !defaultStore) nextStore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableStores])

  useEffect(() => {
    (() => {
      if(defaultStore)return;
      let _availableStores = {}
      for (let appStoreKey in AVAILABLE_STORES) {
        if(AVAILABLE_STORES[appStoreKey]){
          _availableStores = {
            ..._availableStores,
            [appStoreKey]:APP_STORE_DATA[appStoreKey]
          }
        }
      }
        setAvailableStores(_availableStores)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ( 
      <ButtonsContainer className={`${className} ${size || ''} withFrame`} data-store_name={currentStore} onClick={handleClick}>
        <ButtonLayout className="appstoreButtom__buttonLayout">
          <LogoContainer ref={storeImgRef}>
            <img src={STORE_ASSETS[currentStore]} width="65%" loading="lazy" alt="" />
          </LogoContainer>
          <AppStoreDataContainer className={`${!title ? 'no-title' : ''}`}>
            {
              title ? 
              <AvailableIn className="appstoreButtom__availableIn" >
                <P className="bold no-margin" color="white">{title}</P>
              </AvailableIn>
              :<></>
            }
            <StoreNameContainer ref={storeNameRef} className="appstoreButtom__storeNameContainer">
              <P className="bold no-margin" color="white">{uiLabel || APP_STORE_DATA[currentStore].uiLabel}</P>
            </StoreNameContainer>
          </AppStoreDataContainer>
        </ButtonLayout>
      </ButtonsContainer>
  );
}


