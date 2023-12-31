type documentPathProps = {
    pasaporte:{ [key: string]: string },
    cedula_ciudadania:{ [key: string]: string },
    cedula_extranjeria:{ [key: string]: string },
    pep:{ [key: string]: string },
    ppt:{ [key: string]: string },
}

export const DOCUMENT_IMAGE_CDN_PATH:documentPathProps = {
    pasaporte:{
        id_front:"kyc_identity/colombia/pasaporte/id_front.png",
        selfie:"kyc_identity/colombia/pasaporte/selfie.png"
    },
    cedula_ciudadania:{
        id_front:"kyc_identity/colombia/cedula_ciudadania/id_front.png",
        id_back:"kyc_identity/colombia/cedula_ciudadania/id_back.png",
        selfie:"kyc_identity/colombia/cedula_ciudadania/selfie.png"
    },
    cedula_extranjeria:{
        id_front:"kyc_identity/colombia/cedula_ciudadania/id_front.png",
        selfie:"kyc_identity/colombia/cedula_ciudadania/selfie.png"
    },
    pep:{
        id_front:"kyc_identity/colombia/cedula_ciudadania/id_front.png",
        selfie:"kyc_identity/colombia/cedula_ciudadania/selfie.png"
    },
    ppt:{
        id_front:"kyc_identity/colombia/cedula_ciudadania/id_front.png",
        selfie:"kyc_identity/colombia/cedula_ciudadania/selfie.png"
    }

}