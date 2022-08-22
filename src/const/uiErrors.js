

export const UI_ERRORS = {
    "withdrawaccount_9":"No se puede crear la cuenta de retiro porque ya existe.",
    "customerrorhandler_0":"Error con el formato del balance enviado.",
    "identityDuplicated":"La identidad que estás tratando de agregar ya exíste.",
} 


export const getUiError = (error) => {
    if(UI_ERRORS[error]) return UI_ERRORS[error];
    if(error?.includes('duplicate key error')) return UI_ERRORS["identityDuplicated"];
    return error
}