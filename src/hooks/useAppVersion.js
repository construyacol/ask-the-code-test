import React from "react";
import { App } from "@capacitor/app";
import { CAPACITOR_PLATFORM, CAPACITOR_PLATFORMS } from "const/const";
import { initAppVersion } from "services/CoinsendaAppVersion";

export function useAppVersion() {
  const [isAppOutdated, setIsAppOutdated] = React.useState(false);

  async function checkAppVersion() {
    try {
      await initAppVersion();
      const storeVersions = window.appVersion;
      const appInfo = await App.getInfo();
      CAPACITOR_PLATFORM === CAPACITOR_PLATFORMS.ANDROID && setIsAppOutdated(CAPACITOR_PLATFORM === CAPACITOR_PLATFORMS.ANDROID && storeVersions.androidVersionCode !== appInfo.build);
      CAPACITOR_PLATFORM === CAPACITOR_PLATFORMS.IOS && setIsAppOutdated(CAPACITOR_PLATFORM === CAPACITOR_PLATFORMS.IOS && storeVersions.iosVersion !== appInfo.build);
    } catch (e) {
      console.error("CHECKING_APP_VERSION", e);
    }
  }

  React.useEffect(function () {
    CAPACITOR_PLATFORM !== CAPACITOR_PLATFORMS.WEB && checkAppVersion();
  }, [])

  return isAppOutdated;
}