
const countryValidators = {
    res:{
        levels:{
            level_1:{
                personal:{
                    natural:{
                        name:{
                            ui_name: "Nombres completos"
                        },
                        phone:{
                            ui_name: "Numero de teléfono",
                            ui_type: "phone"
                        },
                        nationality:{
                            colombia:{
                                ui_name: "Colombia"
                            },
                            afghanistan:{
                                ui_name: "Afghanistan"
                            },
                            ui_name: "Nacionalidad del documento",
                            ui_type: "select"
                        },
                        address:{
                            ui_name:"Dirección de residencia"
                        },
                        city:{
                            ui_name: "Ciudad"
                        },
                        id_type:{
                            ui_name: "Tipo de documento",
                            ui_type: "select",
                            cedula_ciudadania:{
                                ui_name: "Cedula de ciudadanía"
                            },
                            cedula_extranjeria:{
                                ui_name: "Cedula de extranjería"
                            },
                            pasaporte:{
                                ui_name: "Pasaporte"
                            },
                            pep:{
                                ui_name: "Permiso especial de permanencia"
                            }
                        },                        
                        id_number:{
                            ui_name: "Número de documento",
                            ui_type: "text"
                        },
                        birthday:{
                            ui_name: "Fecha de nacimiento",
                            ui_type: "date"
                        },
                        country:{
                            colombia:{
                                ui_name: "Colombia",
                                value: "colombia"
                            },
                            peru:{
                                ui_name: "Perú",
                                value: "peru"
                            },
                            ui_name: "País",
                            ui_type: "select"
                        },
                        surname:{
                            ui_name: "Apellidos completos"
                        }
                    }
                }
            }
        }
    }
}

const STAGES = {
      "id_type":{
        uiName:"Tipo de documento:",
        key:"id_type",
        uiType:"text",
        "settings":{
          defaultMessage:"Elige el documento de identidad con el cual verificarás tu cuenta.",
          successPattern:/[a-zA-Z ]{3,40}/g,
          label:"Tipo de documento:",
          placeholder:"Elije tu documento de identidad",
          selectList:{},
          queryParams:{
            form:'personal_id_type'
          },
          errors:[
            // { pattern:/[^a-zA-Z ]{1,30}/g, message:'Solo se permiten letras...'}
          ],
        }
      },
      "city":{
        uiName:"Ciudad de residencia",
        key:"city",
        uiType:"text",
        "settings":{
          defaultMessage:"Escribe la ciudad en la que resides actualmente",
          successPattern:/[a-zA-Z ]{3,40}/g,
          label:"Ciudad de residencia:",
          placeholder:"Elije tu ciudad actual",
          queryParams:{
            form:'personal_residence_city'
          },
          errors:[
            { pattern:/[^a-zA-Z ]{1,30}/g, message:'Solo se permiten letras...'}
          ],
        }
      },
      "address":{
        uiName:"Dirección de residencia:",
        key:"address",
        uiType:"text",
        "settings":{
          defaultMessage:"Escribe de forma completa tu dirección actual de residencia",
          successPattern:/[a-zA-Z ]{3,40}/g,
          label:"Dirección de residencia:",
          placeholder:"Escribe la dirección",
          queryParams:{
            form:'personal_address'
          },
          errors:[
            { pattern:/[^a-zA-Z ]{1,30}/g, message:'Solo se permiten letras...'}
          ],
        }
      },
      "surname":{
        uiName:"Apellidos completos",
        key:"surname",
        uiType:"text",
        "settings":{
          defaultMessage:"Tus apellidos deben coincidir con los de tu documento de identidad.",
          successPattern:/[a-zA-Z ]{3,40}/g,
          label:"Apellidos completos:",
          placeholder:"Ej: Sanchez buitrago",
          queryParams:{
            form:'personal_surnames'
          },
          errors:[
            { pattern:/[^a-zA-Z ]{1,30}/g, message:'Solo se permiten letras...'}
          ],
        }
      },
      "name":{
        uiName:"Nombres completos",
        key:"name",
        uiType:"text",
        "settings":{
          defaultMessage:"Los nombres deben coincidir con los de tu documento de identidad",
          successPattern:/[a-zA-Z ]{3,40}/g,
          label:"Nombres completos (sin apellidos):",
          placeholder:"Ej: Juan josé ",
          queryParams:{
            form:'personal_names'
          },
          errors:[
            { pattern:/[^a-zA-Z ]{1,30}/g, message:'Solo se permiten letras...'}
          ],
          AuxComponent:null,
          MainComponent:null
        }
      },
      "nationality":{
        uiName:"Nacionalidad del documento:",
        key:"nationality",
        uiType:"select",
        "settings":{
          defaultMessage:"Selecciona la nacionalidad de tu documento de identidad",
          successPattern:/[a-zA-Z _]{1,40}/g,
          errors:[
            { pattern:/[^a-zA-Z _]{1,30}/g, message:'Solo se permiten letras...'}
          ],
          label:"Nacionalidad del documento:",
          placeholder:"Ej: pasaporte",
          queryParams:{
            form:'personal_country'
          }
        }
      },
      "country":{
        uiName:"País",
        key:"country",
        uiType:"select",
        selectList:{},
        "settings":{
          defaultMessage:"Elige el país desde el que operarás tu cuenta",
          successPattern:/[a-zA-Z _]{1,40}/g,
          errors:[
            { pattern:/[^a-zA-Z _]{1,30}/g, message:'Solo se permiten letras...'}
          ],
          label:"País de operación:",
          placeholder:"Ej: Juan josé ",
          queryParams:{
            form:'personal_country'
          },
          auxComponent:null,
          mainComponent:null
        }
      },
      "birthday":{
        uiName:"Fecha de nacimiento",
        key:"birthday",
        uiType:"date",
        "settings":{
          defaultMessage:"Ingresa tú fecha de nacimiento (Día / Mes / Año)",
          props:{
            min:"1930-01-01",
            max:"2003-12-31",
            pattern:"[0-9]{2}-[0-9]{2}-[0-9]{4}"
          },
          queryParams:{
            form:'personal_birthday'
          },
          // errors:[
          //   { pattern:/1[0-7]/g, message:'Debes de ser mayor de edad(+17) para continuar'}
          // ],
        }
      },
      "id_number":{
        uiName:"Número de documento",
        key:"id_number",
        uiType:"text",
        "settings":{
          defaultMessage:"Digíta tu número de documento",
          successPattern:{
           pasaporte:/[0-9A-Z]{5,15}/g,
           others:/[0-9]{5,15}/g
          },
          label:"Número de documento",
          placeholder:"Dígita el número del documento que elegíste",
          queryParams:{
            form:'personal_number_id'
          },
          errors:{
            pasaporte:[ 
              { pattern:/[^0-9A-Z]/g, message:'Solo se permiten valores alfanuméricos...' }
            ],
            others:[
              { pattern:/[^0-9]/g, message:'Solo se permiten valores númericos...' }
            ]
          },
          mainComponent:null
        }
      },
      "phone":{
        uiName:"Número de celular",
        key:"phone",
        uiType:"text",
        "settings":{
          defaultMessage:"Digíta tu número de celular",
          successPattern:/[0-9]{5,40}/g,
          label:"Número de celular:",
          queryParams:{
            form:'personal_phone'
          },
          errors:[
            { pattern:/[^0-9]/g, message:'Solo se permiten Números...'}
          ],
          auxComponent:"personalKycComponent/countryPrefix", //targetId to render component
          mainComponent:null
        }
      }
    }


export const ApiGetPersonalStages = (config) => {
    const { personType, level, formName } = config
    return countryValidators?.res?.levels[level][formName][personType]
  }

  
export const PERSONAL_COMPONENTS = {
    successStage:{
        personal:{
        component:"personalKycSuccess",
        }
    },
    wrapperComponent:{
        personal:'personalKycComponent'
    }
}

export const PERSONAL_STAGES = {
    personal:STAGES
}

  
  