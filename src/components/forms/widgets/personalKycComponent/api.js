
const countryValidators = {
    res:{
        levels:{
            level_1:{
                personal:{
                    natural:{
                        name:{
                            ui_name: "Nombres completos"
                        }
                    }
                        
                }
            }
        }
    }
}


export const ApiGetPersonalStages = (config) => {
    const { personType, level, formName } = config
    return countryValidators?.res?.levels[level][formName][personType]
  }