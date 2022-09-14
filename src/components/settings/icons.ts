import { IoMdFingerPrint } from 'react-icons/io';
import { BsShieldLock } from 'react-icons/bs';
import { IoMailUnreadOutline } from 'react-icons/io5';
import loadable from "@loadable/component";
import { getExportByName } from 'components/widgets/icons/iconSwitch'

const Handshake = loadable(() => import("components/widgets/icons").then(getExportByName("Handshake")));

const getIcon = (iconValue:string | undefined) => {

    const icons = {
        security:BsShieldLock,
        kyc:IoMdFingerPrint,
        referral:Handshake,
        email:IoMailUnreadOutline,
        twofa:BsShieldLock,
        identity:IoMdFingerPrint
    }
    
    return icons[iconValue as keyof typeof icons] || IoMdFingerPrint
}

export default getIcon
