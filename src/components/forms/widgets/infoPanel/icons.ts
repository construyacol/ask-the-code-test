import { IoMdFingerPrint } from 'react-icons/io';
// import { BsShieldLock } from 'react-icons/bs';
// import { IoMailUnreadOutline } from 'react-icons/io5';
import { GoLocation } from "react-icons/go";

// import loadable from "@loadable/component";
// import { getExportByName } from 'components/widgets/icons/iconSwitch'
// const Handshake = loadable(() => import("components/widgets/icons").then(getExportByName("Handshake")));

const getIcon = (iconValue:string | undefined):JSX.Element | any => {
    const Icons = {
        identity:IoMdFingerPrint,
        location:GoLocation,
        contact:GoLocation
    }
    return Icons[iconValue as keyof typeof Icons] || IoMdFingerPrint
}

export default getIcon
