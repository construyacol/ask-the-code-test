import { toast } from 'react-toastify';
import { kyc } from '../components/api/ui/api.json'
import Compressor from 'compressorjs';

import store from '../'





export const img_compressor = (file, quality) => {
  return new Promise(async(resolve, reject) => {
    if(file.size > 2000000){
      console.log('La imagen es superior a 2MB, será comprimida')
      if(!quality){
        // Calcula el nivel de compresión en función al tamaño de la imagen
        quality = await get_img_quality(file.size)
        console.log('quality', quality, typeof quality)
      }
      new Compressor(file, {
        quality: quality,
        success: resolve,
        error: reject,
      })
      return resolve
    }
    console.log('La imagen es INFERIOR a 2MB, NO será comprimida')
    return resolve(file)
  })
}


const get_img_quality = (size) => {
  let quality = (size>12000000) ? 0.3 : (size>8000000) ? 0.4 : (size>5000000) ? 0.5 : (size>4000000) ? 0.6 : (size>2000000) && 0.7
  return quality
}


export const mensaje = async(msg, type, position) =>{
  return toast(msg, {
    position: toast.POSITION[!position ? 'BOTTOM_RIGHT' : position],
     pauseOnFocusLoss: false,
     draggablePercent: 60,
     className: `${type === 'error' ? 'toastError': type === 'success' ? 'DCfondo' : 'DCfondoDefault'}`,
     bodyClassName: `${type === 'error' ? 'toastErrorText': type === 'success' ? 'DCTtext' : 'DCTtextDefault'}`,
     progressClassName: `${type === 'error' ? 'ErroProgressBar': type === 'success' ? 'DCProgress' : 'DCProgress'}`,
     autoClose: 4000
  })
}


export const ticketModalView = (state) =>{
  switch (state) {
    case 'pending':
        return "pendingView"
    case 'accepted':
        return "modalSuccess"
    case 'canceled':
        return "badView"
    case 'rejected':
        return "rejectedView"
    case 'confirmed':
        return "confirmedView"
    default:
      break;
  }
}





export const desNormalizedList = async(normalizedList, indices) =>{
// Recibimos como parametros el objeto con la info normalizada y la lista de indices
  let new_list = []

  if(indices.length>0){
           new_list = await indices.map((id)=>{
             return normalizedList[id]
           })
  }

  return new_list
}
// indices

export const matchNormalizeWallet = (list, itemReview) => {
    return new Promise(async(resolve, reject)=>{
    let result = []
    await Object.keys(list).forEach((wallet_id) => {
      if(list[wallet_id].currency.currency === itemReview ){
        result.push(list[wallet_id])
      }
    })
    return resolve(result)
  })
}





export const objectToArray = (object_list, assign_id) => {

    return new Promise(async(resolve, reject)=>{
    let new_list = []
    let new_object = {
      ...object_list
    }
    let index = 1

    await Object.keys(new_object).forEach((indice) => {
        if(indice === 'ui_name' || indice === 'ui_type'){return false}
        if(assign_id){object_list[indice].id = index}
        new_list.push(object_list[indice])
        index++
    })

    return resolve(new_list)
  })

}



export const add_index_to_root_object = (list) => {

    return new Promise(async(resolve, reject)=>{

    let new_object
    await Object.keys(list).forEach((index_id) => {
      if(index_id === 'ui_name'){return false}

      if(index_id !== 'ui_type'){
        list[index_id]={
          ...list[index_id],
          value:index_id
        }
      }
        new_object = {
          ...new_object,
          [index_id]:list[index_id]
        }
    })

    return resolve(new_object)
  })

}


export const serveBankOrCityList = (list, type) => {

    return new Promise(async(resolve, reject)=>{

    let new_list = []
    let indices = 0

    await Object.keys(list).forEach((indice) => {
        if(indice === 'ui_name' || indice === 'ui_type'){return false}
        let new_item = {
          ...list[indice],
          code:indice,
          id:indices,
          type:type,
          name:list[indice].ui_name,
          selection:false
        }
        indices++
        new_list.push(new_item)
    })

    return resolve(new_list)
  })

}


export const converToInitState = (obj) => {
  // recibe un objeto como parametro y devuelve ese objeto con todos los parametros vacíos, como un estado inicializado desde 0
    return new Promise(async(resolve, reject)=>{
    let new_state
    await Object.keys(obj).forEach((index_state) => {
        new_state ={
          ...new_state,
          [index_state]:""
        }
    })
    return resolve(new_state)
  })
}


export const extractSelectList = async(kyc_array, kyc_object) => {
    let object_list
    await kyc_array.map(async(item) =>{
      if(item.ui_type === 'select' && item.name !== "nationality"){
        let _this_array=[]
        let id = 1
          await Object.keys(kyc_object[item.name]).forEach((indx) => {
            if(indx === 'ui_name' || indx === 'ui_type'){return false}
            let new_item = {
              ...kyc_object[item.name][indx],
              code:indx,
              name:kyc_object[item.name][indx].ui_name,
              id:id++
            }
              _this_array.push(new_item)
            })
        object_list = {
          ...object_list,
          [item.name]:_this_array
        }
      }
    })
    return object_list
}


export const FormatCountryList = (original_list, to_model_convert_list) => {

  let new_list = []
  // console.log('!!!! to_model_convert_list', to_model_convert_list)
  original_list.map(async(item)=>{
    let res = await matchItem(to_model_convert_list, {primary:item.code}, 'name')
    if(!res){return false}
    new_list.push(res[0])
  })

  return new_list

}





export const serveKycData = (list) => {

    return new Promise(async(resolve, reject)=>{
      const { kyc_basic } = kyc
      const { user, user_id } = store.getState().model_data
      let kyc_model = kyc_basic[user[user_id].person_type]

      // console.log('||||||||||||| LISTA ALMACENADA FRONTEND - - - ', kyc_basic[user[user_id].person_type])
      // console.log('|||||| LISTA RECIBIDA BACKENND', list)

      let new_list = []
      let indices = 1
      await Object.keys(list).forEach((indice) => {
          // console.log(`recorriendo objetito: - - FRONT ${indice} - -`, kyc_model[indice])
          // console.log(`recorriendo objetito: - - BACK ${indice} - -`, list[indice])
          // if(indice === 'ui_name'){return false}
          let new_item = {
            label:list[indice].ui_name,
            name:indice,
            id:indices,
            ui_type:list[indice].ui_type ? list[indice].ui_type : 'text',
            placeholder:list[indice].ui_name,
            ...kyc_model[indice],
          }
          indices++
          new_list.push(new_item)
      })
      // console.log('RESULTADO CONVERSIÓN DATA:', new_list)
      return resolve(new_list)
  })

}







export const withdraw_provider_by_type = async(withdraw_providers) => {

  let providers_served

  await withdraw_providers.map(provider => {
    return providers_served = {
      ...providers_served,
      [provider.provider_type]:provider
    }
  })

  return providers_served

}


export const matchItem = (list, itemReview, type, all_results) => {

  const { primary } = itemReview

  let result = []
  // let all_results = false


  list.filter((item)=>{
          let query = primary.toLowerCase()
          switch (type) {
            case 'view':
            // BUSCAMOS COINCIDENCIAS DENTRO DEL MODELO DE LAS VISTAS
                return item.name.includes(query) && result.push(item)
            case 'quote':
            // BUSCAMOS COINCIDENCIA DENTRO DEL MODELO DE LAS LISTAS DE PARES/COTIZACIONES QUE NOS RETORNA EL SERVER
                return item.primary_currency.currency.includes(query) && result.push(item)
            case 'primary':
            // BUSCAMOS COINCIDENCIA DENTRO DEL USER COLLECTION PROVEIDO EN LA LISTA {primary: element}
                return item.primary.includes(query) && result.push(item)
            case 'sell_pair':
            // BUSCAMOS COINCIDENCIA DENTRO DEL USER COLLECTION PROVEIDO EN LA LISTA {primary: element}
                return item.sell_pair.includes(query) && result.push(item)
            case 'buy_pair':
            // BUSCAMOS COINCIDENCIA DENTRO DEL USER COLLECTION PROVEIDO EN LA LISTA {primary: element}
                return item.buy_pair.includes(query) && result.push(item)
            default:
              all_results = true
              if(typeof(type) === 'object'){
                // solo aplica cuando se hacen busquedas en mas de un nivel
                type.first.toLowerCase()
                type.second.toLowerCase()
                console.log(']]]]]]] ====> ANDALE ANDALE', item[type.first][type.second])
                return item[type.first][type.second].includes(query) && result.push(item)
              }
              return item[type].toLowerCase().includes(query) && result.push(item)
          }
      })

 if(result.length<1){return false}
 if(all_results){return result}
 return result[0]

}



export const handleKeyPress = (e, current) => {
  var keynum = window.event ? window.event.keyCode : e.which;
  // if ((keynum == 8) || (keynum == 46) || (keynum == 45) || (keynum == 44) ){
    if (keynum<48 || keynum>57){
      return "Solo se aceptan numeros en este campo"
    }
    return /\d/.test(String.fromCharCode(keynum));
}



export const number_format = (amount) => {
    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9]/g, '')); // elimino cualquier cosa que no sea numero o punto
    amount = '' + amount.toFixed(0);

    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1,$2');
    return amount_parts.join('.');
}

export const readFile = (file) => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener(
      'load',
      () => resolve(reader.result),
      false
    )
    reader.readAsDataURL(file)
  })
}



export const serve_activity_list = async(get_list, data_user, current_wallet, filter, wallets) =>{

  // other_call - será false cuando lo llamamos al iniciar el componenete, y true cuando lo llamamos desde otro metodo accionado por el usuario ej. ActivityList
  await get_list(data_user, wallets)

  // console.log('||||||||||||||||||||||| °°°°°° normalizeData:::', normalizeData)

  let list = await serve_orders(current_wallet && current_wallet.id, filter)
  // console.log('||||||||||||||||||||||| °°°°°° serve_activity_list:::', list)

  return list

}


export const serve_orders = async(account_id, filter) =>{

  let new_array = []
  // console.log('°°°°||||||||||||||| ORDER SERVIDAS ', account_id, filter)
  const { model_data } = store.getState()
  const { user, user_id } = store.getState().model_data

  let list = model_data[filter]
  let indices = user[user_id][filter]

  // console.log('°°°°||||||||||||||| ORDER SERVIDAS2 ', list, indices)

  // console.log('°°°°||||||||||||||| ORDER SERVIDAS ', model_data[filter])


  if(filter === 'swaps' && account_id){
    indices.map((id) => {
      // if(!list[id].account_id){return false}
       return (list[id].account_id === account_id || list[id].account_to === account_id) && new_array.push(list[id])
    })
  }

  if(filter !== 'swaps' && account_id){
    indices.map((id) => {
      // if(!list[id].account_id){return false}
       return (list[id].account_id === account_id) && new_array.push(list[id])
    })
  }

  if(!account_id){
    indices.map((id) => {
       return new_array.push(list[id])
    })
  }



  return new_array
}



export const get_ui_name_currency = (short_currency_name) => {

  return (
    short_currency_name === 'cop' ? 'Pesos Colombianos' :
    short_currency_name === 'clp' ? 'Pesos Chilenos' :
    short_currency_name === 'pen' ? 'Sol Peruano' :
    short_currency_name === 'uyu' ? 'Pesos Uruguayos' :
    short_currency_name === 'ars' ? 'Pesos Argentinos' :
    'Dolares Americanos'
  )
}













export default handleKeyPress
