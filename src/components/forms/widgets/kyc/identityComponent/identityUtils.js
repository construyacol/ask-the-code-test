import { mainService } from "../../../../../services/MainService";

export const identityInfo = () => {
  const user = mainService.user
  let pendingIdentityFile
  // const mainIdentity = user?.identity
  // const rejectedIdentity = ((["rejected"].includes(mainIdentity?.info_state) || ["rejected"].includes(mainIdentity?.file_state)) && mainIdentity?.file_state === mainIdentity?.info_state)
  // if(user?.identities?.length && !rejectedIdentity){
  pendingIdentityFile = user?.identities.find(identity => ["pending", "rejected"].includes(identity?.file_state));
  let pendingOrRejectedIdentity = user?.identities.find(identity => ["pending", "rejected"].includes(identity?.file_state) || ["pending", "rejected"].includes(identity?.info_state));
  let confirmedIdentity = user?.identities.find(identity => ["confirmed"].includes(identity?.file_state) && ["confirmed"].includes(identity?.info_state));
  // }
  return {
    pendingIdentityFile,
    pendingOrRejectedIdentity,
    confirmedIdentity
  }
}
 

