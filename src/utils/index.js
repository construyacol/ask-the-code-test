import { toast as reactToastify } from "react-toastify";
import { kyc } from "../components/api/ui/api.json";
import Compressor from "compressorjs";
import { updateNormalizedDataAction } from "../actions/dataModelActions";
import * as normalizr_services from "../schemas";
import { store } from "..";
import imageType from 'image-type'
import { IMAGE_MIME_TYPES, PRIORITY_ENTITIES } from '../const/const'
import * as Sentry from "@sentry/react";


const { normalizeUser } = normalizr_services;


export const checkCameraPermission = async () => {
  const { Camera } = await import("@capacitor/camera");
  try {
    let result = await Camera.checkPermissions()
    if (result.camera === 'granted') {
      return true;
    }
    if (result.camera === 'denied') {
      const { NativeSettings, IOSSettings, AndroidSettings } = await import("capacitor-native-settings");
      NativeSettings.open({
        optionAndroid: AndroidSettings.ApplicationDetails, 
        optionIOS: IOSSettings.App
      })
      result = await Camera.requestPermissions(['camera']);
    } else {
      result = await Camera.requestPermissions(['camera']);
    }
    if (result.camera === 'denied') {
      throw new Error("Camera permissions no granted")
    }
    return result.camera === 'granted';
  } catch (e) {
    console.log('ERROR => ', JSON.stringify(e.message))
    return false;
  }
};


export const isSafari = () => {
  if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
    return 'is_safari'
  }else{
    return ''
  }
}

export const parseQueryString = () => {
  const params = new URLSearchParams(window.location.search);
  const values = (Array.from(params.values())); 
  return values.join(' ')
}

export const osDevice = () => {
  var userAgent = window.navigator.userAgent;
  if((/iP(hone|od|ad)/.test(userAgent))){
     return 'ioSystem'
   }
   return ''
}


export const SentryCaptureException = (error, extra_data) => {
  Sentry.configureScope((scope) => {
    scope.setExtra("extra_data", extra_data);
  });
  Sentry.captureException(error);
};

 
export const getIdentityState = ({ file_state, info_state }) => {
  if(!file_state || !info_state)return ;
  let state = 'pending'
  if([info_state, file_state].includes("rejected")){
      return "rejected"
  }else if(info_state === file_state){
      state = info_state
  }
  return state
}


export const setAnimation = (className, containerId, time = 100) => {
  return new Promise((resolve, reject) => {
    const element = document?.getElementById(containerId);
    element?.classList?.add(className);
    setTimeout(() => {
      resolve();
      setTimeout(() => {
        element.classList.remove(className);
      }, time + 1);
    }, time);
  });
};

// simulate_click(document.getElementById(`${match[0].value}`), 'click');
export const simulate_click = (el, etype) => {
  // Función para simular click sobre el elemento (path country)
  if(!el){return}
  if (el.fireEvent) {
    el.fireEvent("on" + etype);
  } else {
    var evObj = document.createEvent("Events");
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
};

export const img_compressor = (file, quality) => {
  return new Promise(async (resolve, reject) => {
    if (file.type.includes("image") && file.size > 2000000) {
      console.log("La imagen es superior a 2MB, será comprimida", file.size);
      if (!quality) {
        // Calcula el nivel de compresión en función al tamaño de la imagen
        quality = await get_img_quality(file.size);
      }
      new Compressor(file, {
        quality: quality,
        success: resolve,
        error: reject,
      });
      return resolve;
    }
    console.log("La imagen es INFERIOR a 2MB, NO será comprimida");
    return resolve(file);
  });
};

const get_img_quality = (size) => {
  let quality =
    size > 12000000
      ? 0.3
      : size > 8000000
      ? 0.4
      : size > 5000000
      ? 0.5
      : size > 4000000
      ? 0.6
      : size > 2000000 && 0.7;
  return quality;
};

export const toast = async (msg, type, position) => {
  return reactToastify(msg, {
    position: reactToastify.POSITION[!position ? "BOTTOM_RIGHT" : position],
    pauseOnFocusLoss: false,
    draggablePercent: 60,
    className: `${
      type === "error"
        ? "toast-error"
        : type === "success"
        ? "dc-background"
        : "dc-background-default"
    }`,
    bodyClassName: `${
      type === "error"
        ? "toast-error-text"
        : type === "success"
        ? "dc-text"
        : "dc-text-default"
    }`,
    progressClassName: `${
      type === "error"
        ? "error-progress-bar"
        : "dc-progress"
    }`,
    autoClose: 4000,
  });
};

export const copy = (payload) => {
  if (!document || !payload) return;
  let aux = document.createElement("input");
  aux.setAttribute(
    "value",
    payload.target.dataset && payload.target.dataset.copy
  );
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  return toast("¡Copiado Exitosamente!");
};

export const capitalizarPalabras = (val) => {
  // console.log('_______________________capitalizarPalabras', val, typeof val)
  if (typeof val !== "string") {
    return val;
  }
  return val
    .toLowerCase()
    .trim()
    .split(" ")
    .map((v) => v[0] && v[0].toUpperCase() + v.substr(1))
    .join(" ");
};

export const capitalizeWord = (word) => {
  if(!word?.charAt)return word;
  const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1)?.toLowerCase();
  return capitalizedWord
}

export const capitalizeString = (string) => {
  if (typeof string !== "string") {
    return string;
  }
  const re = /(^|[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ])(?:([a-záéíóúüñ])|([A-ZÁÉÍÓÚÜÑ]))|([A-ZÁÉÍÓÚÜÑ]+)/gu;
  // Capitalizacion en castellano ref: https://es.stackoverflow.com/questions/111241/como-puedo-hacer-para-que-aparezcan-las-primeras-letras-de-las-palabras-en-mayu
  return string.replace(
    re,
    (m, caracterPrevio, minuscInicial, mayuscInicial, mayuscIntermedias) => {
      const locale = ["es", "gl", "ca", "pt", "en"];
      if (mayuscIntermedias) return mayuscIntermedias.toLocaleLowerCase(locale);
      return (
        caracterPrevio +
        (minuscInicial
          ? minuscInicial.toLocaleUpperCase(locale)
          : mayuscInicial)
      );
    }
  );
};

export const ticketModalView = (state) => {
  switch (state) {
    case "pending":
      return "pendingView";
    case "accepted":
      return "modalSuccess";
    case "canceled":
      return "badView";
    case "rejected":
      return "rejectedView";
    case "confirmed":
      return "confirmedView";
    default:
      break;
  }
};

export const normalized_list = (activity_list, activity_type) => {
  return async (dispatch, getState) => {
    const user = getState().modelData.user;

    let list = await arrayToObject(activity_list);
    if (getState().modelData[activity_type]) {
      // Si ya hay depositos/retiros/swaps en el estado, entonces tomarlos en cuenta en la adición
      list = {
        ...getState().modelData[activity_type],
        ...list,
      };
    }

    let user_update = {
      id: user.id,
      [activity_type]: {
        ...list,
      },
    };

    let normalizedUser = await normalizeUser(user_update);
    await dispatch(updateNormalizedDataAction(normalizedUser));
  };
};

export function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === "object";
}

export const desNormalizedList = async (normalizedList, indices) => {
  // Recibimos como parametros el objeto con la info normalizada y la lista de indices
  let new_list = [];

  if (indices.length > 0) {
    new_list = await indices.map((id) => {
      return normalizedList[id];
    });
  }

  return new_list;
};
// indices

export const matchNormalizeWallet = (list, itemReview) => {
  return new Promise(async (resolve, reject) => {
    let result = [];
    await Object.keys(list).forEach((wallet_id) => {
      if (list[wallet_id].currency.currency === itemReview) {
        result.push(list[wallet_id]);
      }
    });
    return resolve(result);
  });
};

export const arrayToObject = (array_list) => {
  let new_object = {};

  for (let item of array_list) {
    new_object = {
      ...new_object,
      [item.id]: item,
    };
  }

  return new_object;
};

function getProps(obj, path) {
  var arr = path.split(".");
  var parent = obj;
  var name = arr[0];

  arr.slice(1).forEach((fieldName) => {
    parent[name] = parent[name] || {};
    parent = parent[name];
    name = fieldName;
  });
  return parent[name];
}



export const convertToObjectWithCustomIndex = (matriz, customIndex) => {
  // @param matriz: arrray | object
  // array to object
  // let arrayToObject = await array.reduce((a, v) => ({ ...a, [v?.code]: v}), {}) 

  let MATRIZ = matriz;
  let OBJECT_RESULT = {};
  let INDEX;
  customIndex = !customIndex ? "id" : customIndex;

  if (typeof MATRIZ === "object") {
    MATRIZ = Object.values(MATRIZ);
  } //if it's object so convert to array

  if (Array.isArray(MATRIZ)) {
    for (let item of MATRIZ) {
      INDEX = getProps(item, customIndex);
      OBJECT_RESULT = {
        ...OBJECT_RESULT,
        [INDEX]: item,
      };
    }
  }

  return OBJECT_RESULT;
};

export const objectToArray = (object_list, assign_id) => {
  return new Promise(async (resolve, reject) => {
    let new_list = [];
    let new_object = {
      ...object_list,
    };
    let index = 1;

    await Object.keys(new_object).forEach((indice) => {
      if (indice === "ui_name" || indice === "ui_type") {
        return false;
      }
      if (assign_id) {
        object_list[indice].id = index;
      }
      new_list.push(object_list[indice]);
      index++;
    });

    return resolve(new_list);
  });
};

export const addIndexToRootObject = (list) => {
  // @params
  // list:object

  return new Promise(async (resolve, reject) => {
    let new_object;
    await Object.keys(list).forEach((index_id) => {
      if (index_id === "ui_name") {
        return false;
      }

      if (index_id !== "ui_type") {
        list[index_id] = {
          ...list[index_id],
          value: index_id,
        };
      }
      new_object = {
        ...new_object,
        [index_id]: list[index_id],
      };
    });

    return resolve(new_object);
  });
};


export const serveBankOrCityList = (list, type) => {
  return new Promise(async (resolve, reject) => {
    let new_list = [];
    let indices = 0;

    let priorityEntities = []

    await Object.keys(list).forEach((indice) => {

      if (indice === "ui_name" || indice === "ui_type") {
        return false;
      }


      if(PRIORITY_ENTITIES.includes(indice)){
        let priotityItem = {
          ...list[indice],
          code: indice,
          id: indices, 
          type: type,
          name: list[indice].ui_name.toLowerCase(),
          selection: false,
        };
        indices++;
        return priorityEntities.push(priotityItem)
      }

      let new_item = {
        ...list[indice],
        code: indice,
        id: indices, 
        type: type,
        name: list[indice].ui_name.toLowerCase(),
        selection: false,
      };
      indices++;
      new_list.push(new_item);

    });

    // console.log('|||||||| list ==> ', Object.keys(list).length)
    // console.log('|||||||| new_list ==> ', new_list.length, new_list)
    // console.log('|||||||| PRIORITY_ENTITIES ==> ', priorityEntities)
    // debugger

    return resolve([...priorityEntities, ...new_list]);
  });
};

export const converToInitState = (obj) => {
  // recibe un objeto como parametro y devuelve ese objeto con todos los parametros vacíos, como un estado inicializado desde 0
  return new Promise(async (resolve) => {
    let new_state;
    await Object.keys(obj).forEach((index_state) => {
      new_state = {
        ...new_state,
        [index_state]: "",
      };
    });
    return resolve(new_state);
  });
};

export const extractSelectList = async (kyc_array, kyc_object) => {
  let object_list;
  await kyc_array.map(async (item) => {
    if (item.ui_type === "select" && item.name !== "nationality") {
      let _this_array = [];
      let id = 1;
      await Object.keys(kyc_object[item.name]).forEach((indx) => {
        if (indx === "ui_name" || indx === "ui_type") {
          return false;
        }
        let new_item = {
          ...kyc_object[item.name][indx],
          code: indx,
          name: kyc_object[item.name][indx].ui_name,
          id: id++,
        };
        _this_array.push(new_item);
      });
      object_list = {
        ...object_list,
        [item.name]: _this_array,
      };
    }
  });
  return object_list;
};

export const FormatCountryList = (original_list, to_model_convert_list) => {
  let new_list = [];
  // console.log('!!!! to_model_convert_list', to_model_convert_list)
  original_list.map(async (item) => {
    let res = await matchItem(
      to_model_convert_list,
      { primary: item.code },
      "name"
    );
    if (!res) {
      return false;
    }
    new_list.push(res[0]);
  });

  return new_list;
};

export const serveKycData = (list) => {
  return new Promise(async (resolve, reject) => {
    const { kyc_basic } = kyc;
    const { user } = store.getState().modelData;
    let kyc_model = kyc_basic[user.person_type];

    // console.log('||||||||||||| LISTA ALMACENADA FRONTEND - - - ', kyc_basic[user.person_type])
    // console.log('|||||| LISTA RECIBIDA BACKENND', list)

    let new_list = [];
    let indices = 1;
    await Object.keys(list).forEach((indice) => {
      // console.log(`recorriendo objetito: - - FRONT ${indice} - -`, kyc_model[indice])
      // console.log(`recorriendo objetito: - - BACK ${indice} - -`, list[indice])
      // if(indice === 'ui_name'){return false}
      let new_item = {
        label: list[indice].ui_name,
        name: indice,
        id: indices,
        ui_type: list[indice].ui_type ? list[indice].ui_type : "text",
        placeholder: list[indice].ui_name,
        ...kyc_model[indice],
      };
      indices++;
      new_list.push(new_item);
    });
    // console.log('RESULTADO CONVERSIÓN DATA:', new_list)
    return resolve(new_list);
  });
};

export const withdrawProvidersByType = (withdrawProviders) => {
  let providers_served;
  withdrawProviders.map((provider) => {
    return (providers_served = {
      ...providers_served,
      [provider.provider_type]: provider,
    });
  });

  return providers_served;
};

export const matchItem = (list, itemReview, type, all_results) => {
  const { primary } = itemReview;

  let result = [];
  // let all_results = false

  list.filter((item) => {
    let query = primary.toLowerCase();
    switch (type) {
      case "view":
        // BUSCAMOS COINCIDENCIAS DENTRO DEL MODELO DE LAS VISTAS
        return item.name.includes(query) && result.push(item);
      case "quote":
        // BUSCAMOS COINCIDENCIA DENTRO DEL MODELO DE LAS LISTAS DE PARES/COTIZACIONES QUE NOS RETORNA EL SERVER
        return (
          item.primary_currency.currency.includes(query) && result.push(item)
        );
      case "primary":
        // BUSCAMOS COINCIDENCIA DENTRO DEL USER COLLECTION PROVEIDO EN LA LISTA {primary: element}
        return item.primary.includes(query) && result.push(item);
      case "sell_pair":
        // BUSCAMOS COINCIDENCIA DENTRO DEL USER COLLECTION PROVEIDO EN LA LISTA {primary: element}
        return item.sell_pair.includes(query) && result.push(item);
      case "buy_pair":
        // BUSCAMOS COINCIDENCIA DENTRO DEL USER COLLECTION PROVEIDO EN LA LISTA {primary: element}
        return item.buy_pair.includes(query) && result.push(item);
      default:
        all_results = true;
        if (typeof type === "object") {
          // solo aplica cuando se hacen busquedas en mas de un nivel
          type.first.toLowerCase();
          type.second.toLowerCase();
          console.log(
            "]]]]]]] ====> ANDALE ANDALE",
            item[type.first][type.second]
          );
          return (
            item[type.first][type.second].includes(query) && result.push(item)
          );
        }
        return item[type].toLowerCase().includes(query) && result.push(item);
    }
  });

  if (result.length < 1) {
    return false;
  }
  if (all_results) {
    return result;
  }
  return result[0];
};

export const handleKeyPress = (e, current) => {
  var keynum = window.event ? window.event.keyCode : e.which;
  // if ((keynum == 8) || (keynum == 46) || (keynum == 45) || (keynum == 44) ){
  if ((keynum < 48 || keynum > 57) && keynum !== 13) {
    return "Solo se aceptan números en este campo";
  }
  return /\d/.test(String.fromCharCode(keynum));
};

export const number_format = (amount) => {
  amount += ""; // por si pasan un número en vez de un string
  amount = parseFloat(amount.replace(/[^0-9]/g, "")); // elimino cualquier cosa que no sea número o punto
  amount = "" + amount.toFixed(0);

  var amount_parts = amount.split("."),
    regexp = /(\d+)(\d{3})/;
  while (regexp.test(amount_parts[0]))
    amount_parts[0] = amount_parts[0].replace(regexp, "$1,$2");
  return amount_parts.join(".");
};

export function formatNumber(number) {
  const dotsCount = (number.match(/\./g) || []).length;
  const commasCount = (number.match(/,/g) || []).length;
  const dotIndex = number.search(/\./);
  const commaIndex = number.search(/,/);
  const dotFirst = dotsCount === commasCount && dotIndex < commaIndex;
  const commaFirst = dotsCount === commasCount && commaIndex < dotIndex;

  // Remove thousands separators from input
  if (dotsCount > 1 || dotFirst) {
    number = number.split(".").join("");
  } else if (commasCount > 1 || commaFirst) {
    number = number.split(",").join("");
  }

  if (Number.isNaN(Number(number.replace(",", ".")))) {
    return "";
  }

  let integer = "";
  let decimals = "";
  let thousandsSeparator = "";
  let decimalPoint = "";

  if (number.includes(",")) {
    [thousandsSeparator, decimalPoint] = [".", ","];
  } else {
    [thousandsSeparator, decimalPoint] = [",", "."];
  }

  [integer, decimals] = number.split(decimalPoint);
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  integer = integer === "" ? "0" : integer;

  if (!decimals) {
    return integer;
  }

  return [integer, decimals].join(decimalPoint);
}

export const readFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};


 
export const serve_activity_list = async (
  get_list,
  data_user,
  current_wallet,
  filter,
  wallets
) => {
  // other_call - será false cuando lo llamamos al iniciar el componenete, y true cuando lo llamamos desde otro metodo accionado por el usuario ej. ActivityList
  await get_list(data_user, wallets);

  // console.log('||||||||||||||||||||||| °°°°°° normalizeData:::', normalizeData)

  let list = await serve_orders(current_wallet && current_wallet.id, filter);
  // console.log('||||||||||||||||||||||| °°°°°° serve_activity_list:::', list)

  return list;
};

export const serve_orders = async (account_id, filter) => {
  let new_array = [];
  // console.log('°°°°||||||||||||||| ORDER SERVIDAS ', account_id, filter)
  const { modelData } = store.getState();
  const { user } = store.getState().modelData;

  let list = modelData[filter];
  let indices = user[filter];



  // console.log('°°°°||||||||||||||| ORDER SERVIDAS ', modelData[filter])

  if (filter === "swaps" && account_id) {
    indices.map((id) => {
      // if(!list[id].account_id){return false}
      return (
        (list[id].account_from === account_id ||
          list[id].account_to === account_id) &&
        new_array.push(list[id])
      );
    });
  }



  if (filter !== "swaps" && account_id) {
    for (const item of indices) {
      if(list[item].account_id === account_id){
        new_array = [
          ...new_array,
          list[item]
        ]
      }
    }
  }

  if (!account_id) {
    indices.map((id) => {
      return new_array.push(list[id]);
    });
  }

  return new_array;
};

export const get_ui_name_currency = (short_currency_name) => {
  return short_currency_name === "cop"
    ? "Pesos Colombianos"
    : short_currency_name === "clp"
    ? "Pesos Chilenos"
    : short_currency_name === "pen"
    ? "Sol Peruano"
    : short_currency_name === "uyu"
    ? "Pesos Uruguayos"
    : short_currency_name === "ars"
    ? "Pesos Argentinos"
    : "Dolares Americanos";
};

export function setInputFilter(textbox, inputFilter) {
  if (!textbox) return;
  [
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mouseup",
    "select",
    "contextmenu",
    "drop",
  ].forEach(function (event) {
    textbox.addEventListener(event, function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}



/**
 * Function para hacer request debounce  
 *
 * @param {Object} objectData Objeto con clave|valor, donde la clave referencia el espacio en local storage 0y el valor es una cadena que permite hacer la comparación de un identificador permitiendo una única ejecución
 * @param {Function} callback Función callback a ejecutar
 * @param {Boolean} waitRes Si espera async/await del callback, por defecto es false
 * @param {Number} timeExect Tiempo de espera para la ejecución del callback
 */

export const funcDebounce = (
  objectData, 
  callback,  
  waitRes = false, 
  timeExect = 1000
) => {

  if(!Object.entries(objectData).length)return ;
  const [ dataKey, dataValue ] = Object.entries(objectData)[0]
  let storageData = localStorage.getItem(dataKey);
  if(storageData === dataValue)return ;
  localStorage.setItem(dataKey, dataValue);

  if(waitRes){
    return new Promise(async (resolve) => {
      setTimeout(async() => {
        localStorage.removeItem(dataKey);
      }, timeExect)
      const res = await callback()
      return resolve(res)
    });
  }

  setTimeout(() => {
    localStorage.removeItem(dataKey);
  }, timeExect)
  
  return callback()
}



export const funcDebounces = ({
  keyId, 
  callback,  
  waitRes = false, 
  timeExect = 1000,
  storageType = "localStorage"
}) => { 
  const storage = window[storageType]
  if(!Object.entries(keyId).length)return ;
  const [ dataKey, dataValue ] = Object.entries(keyId)[0]
  let storageData = storage.getItem(dataKey);
  if(storageData === dataValue)return ;
  storage.setItem(dataKey, dataValue);

  if(waitRes){
    return new Promise(async (resolve) => {
      setTimeout(async() => {
        storage.removeItem(dataKey);
      }, timeExect)
      const res = await callback()
      return resolve(res)
    });
  }

  setTimeout(() => {
    storage.removeItem(dataKey);
  }, timeExect)
  
  return callback()
}

/**
 * Function para hacer debounce
 *
 * @param {Function} func function target
 * @param {Number} wait timer representado en ms's
 */
export function debounce(func, wait) {
  //Previene over flows. Si el usuario en 1 seg da x cantidad de clicks solo ejecuta el último click
  // Esto surgió porque, podía darse, presionar muchas teclas a la vez en cuestión de milisegundos
  // Entonces, limite que solo reconozca la última acción en 100ms
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      func.apply(context, [...args, () => clearTimeout(timeout)]);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}




export const getAcronym = (_string) => {
  if(typeof _string !== 'string') return _string;
  let patt1 = /^.|\s./g; 
  let result = _string.match(patt1);
  return result.toString().replace(/,/g, " ").toUpperCase();
}



export default handleKeyPress;


export function includesAnyImageMime(value){

  let allowed_img_mimes = IMAGE_MIME_TYPES;

  if (typeof(value) != "string" && !(value instanceof String)) return false;

  let image_buffer = Buffer.from(value, 'base64');
  let image_info = imageType(image_buffer);
  if(!image_info) return false;

  let found = allowed_img_mimes.find((allowed_img_mime) => {
    return allowed_img_mime === image_info.mime;
  });

  if (!found) return false;

  return image_info;
}

