import loadDynamicScript from 'utils/loadDynamicScript'
import { getCdnPath } from 'environment'
export const initAppVersion = () => {
  return new Promise(resolve => {
    loadDynamicScript(resolve, `${getCdnPath('appVersion')}`, 'mobileVersionApp')
  });
}