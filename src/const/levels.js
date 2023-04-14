const LEVEL_TYPES = {
    level_1:"level_1",
    level_2:"level_2",
}

export const OPERATIONAL_LEVELS = [
    LEVEL_TYPES.level_1,
    LEVEL_TYPES.level_2,
]

export const LEVELS_DATA = {
    level_1:{
        value:"level_1",
        name:"level_1",
        uiName:"Nivel 1",
        // requirements:["defaultRequirement"],
        requirements:["contact", "location", "identity"],
        itemsMenu:{
            location:{
                uiName:"Contacto y residencia"
            },
            identity:{
                uiName:"Información personal"
            }
        }
    },
    level_2:{
        uiName:"2",
        value:"level_2",
        name:"level_2"
    }
}



// export const LEVELS_INFO = {
//     level_1:{
//         identity:{
//             uiName:"Identidad",
//             confirmed:"Estamos verificando tu identidad, este proceso puede tardar hasta 72 horas hábiles.",
//             accepted:"Tu cuenta está verificada.",
//             rejected:"Ocurrió un error, vuelve a enviar tus datos de identidad.",
//         },
//         contact:{
//             uiName:"Contácto",
//             pending:"",
//             confirmed:"",
//             accepted:"Datos de contacto verificados" 
//         },
//         location:{
//             uiName:"Residencia",
//             pending:"",
//             confirmed:"",
//             accepted:"Datos de residencia verificados."
//         }
//     }
// }