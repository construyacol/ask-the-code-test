import { IoMdFingerPrint } from 'react-icons/io';
import { BsShieldLock } from 'react-icons/bs';
import { IoMailUnreadOutline } from 'react-icons/io5';
import loadable from "@loadable/component";
import { getExportByName } from 'components/widgets/icons/iconSwitch'
import { GoLocation } from "react-icons/go";

const Handshake = loadable(() => import("components/widgets/icons").then(getExportByName("Handshake")));

const getIcon = (iconValue:string | undefined):JSX.Element | any => {
    const Icons = {
        security:BsShieldLock,
        kyc:IoMdFingerPrint,
        referral:Handshake,
        email:IoMailUnreadOutline,
        twofa:BsShieldLock,
        identity:IoMdFingerPrint,
        level_1:GoLocation
    }
    return Icons[iconValue as keyof typeof Icons] || IoMdFingerPrint
}

export default getIcon
