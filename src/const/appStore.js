import { environment } from 'environment'
import googlePlay from 'assets/appstore/googlePlay.png'
import appleStore from 'assets/appstore/appleStore.png'
import android from 'assets/appstore/android.png'
import huaweiAppGallery from 'assets/appstore/huaweiAppGallery.png'
import amazonAppStore from 'assets/appstore/amazon.png'
import { _getCdnPath } from 'environment';

export const OS = {
    ANDROID:"android",
    IOS:"ios",
    MAC_OS:"macOs",
    LINUX:"linux",
    WINDOWS:"windows"
}

export const APP_STORES = {
    GOOGLE:"googlePlay",
    APPLE:"appleStore",
    ANDROID:"android",
    HUAWEI:"huaweiAppGallery",
    AMAZON:"amazonAppStore"
}

export const QUERY_PARAM_OPEN_MODAL_APP = 'open_app_store_modal'


export const DEFAULT_STORE_BY_OS = {
    [OS.ANDROID]:APP_STORES.GOOGLE,
    [OS.IOS]:APP_STORES.APPLE
}

export const AVAILABLE_STORES = {
    [APP_STORES.APPLE]:true,
    [APP_STORES.ANDROID]:true,
    [APP_STORES.GOOGLE]:true,
    [APP_STORES.HUAWEI]:environment !== 'production' ? true : false,
    [APP_STORES.AMAZON]:environment !== 'production' ? true : false
}

export const STORE_ASSETS = {
    [APP_STORES.GOOGLE]:googlePlay,
    [APP_STORES.APPLE]:appleStore,
    [APP_STORES.ANDROID]:android,
    [APP_STORES.HUAWEI]:huaweiAppGallery,
    [APP_STORES.AMAZON]:amazonAppStore,
}

export const APP_STORE_DATA = {
    [APP_STORES.APPLE]:{
      uiLabel:"App Store",
      link:'https://apps.apple.com/co/app/coinsenda/id1667096147',
      os:OS.IOS
    },
    [APP_STORES.ANDROID]:{
        uiLabel:"Android APK",
        downloadable:true,
        link:`${_getCdnPath('assets')}/appstore/apk/app-debug.apk`,
        os:OS.ANDROID
    },
    [APP_STORES.GOOGLE]:{
        uiLabel:"Google Play",
        downloadable:false,
        link:'https://play.google.com/store/apps/details?id=app.coinsenda',
        os:OS.ANDROID
    },
    [APP_STORES.HUAWEI]:{
        uiLabel:"App Gallery",
        downloadable:false,
        link:'https://consumer.huawei.com/co/mobileservices/appgallery/',
        os:OS.ANDROID
    },
    [APP_STORES.AMAZON]:{
        uiLabel:"App Store",
        downloadable:false,
        link:'https://www.amazon.com/appstore/s?k=appstore',
        os:OS.ANDROID
    }
  }

