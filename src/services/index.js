import { toast } from 'react-toastify';


export const mensaje = async(msg, type, position) =>{

  return toast(msg, {
    position: toast.POSITION[!position ? 'BOTTOM_RIGHT' : position],
     pauseOnFocusLoss: false,
     draggablePercent: 60,
     className: `${type === 'error' ? 'toastError': type === 'success' ? 'DCfondo' : 'DCfondoDefault'}`,
     bodyClassName: `${type === 'error' ? 'toastErrorText': type === 'success' ? 'DCTtext' : 'DCTtextDefault'}`,
     progressClassName: `${type === 'error' ? 'ErroProgressBar': type === 'success' ? 'DCProgress' : 'DCProgress'}`,
     toastId:1,
     autoClose: 4000
  })

}


export const ticketModalView = (state) =>{
  let view

  switch (state) {
    case 'pending':
        return view = "pendingView"
    case 'accepted':
        return view = "modalSuccess"
    case 'canceled':
        return view = "badView"
    case 'rejected':
        return view = "rejectedView"
    case 'confirmed':
        return view = "confirmedView"
      break;
    default:
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




export const objectToArray = (object_list) => {

    return new Promise(async(resolve, reject)=>{

    let new_list = []

    await Object.keys(object_list).forEach((indice) => {
        if(indice === 'ui_name'){return false}
        new_list.push(object_list[indice])
    })

    return resolve(new_list)
  })

}



export const add_index_to_root_object = (list) => {

    return new Promise(async(resolve, reject)=>{

    let new_object
    await Object.keys(list).forEach((index_id) => {
      if(index_id === 'ui_name'){return false}
        list[index_id]={
          ...list[index_id],
          value:index_id
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
        if(indice === 'ui_name'){return false}
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



export const withdraw_provider_by_type = async(withdraw_providers) => {

  let providers_served

  await withdraw_providers.map(provider => {
    providers_served = {
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
                return item.sell_pair.includes(primary) && result.push(item)
            case 'buy_pair':
            // BUSCAMOS COINCIDENCIA DENTRO DEL USER COLLECTION PROVEIDO EN LA LISTA {primary: element}
                return item.buy_pair.includes(primary) && result.push(item)
            default:
              all_results = true
              return item[type].toLowerCase().includes(primary) && result.push(item)
          }
      })

 if(result.length<1){return false}
 if(all_results){return result}
 return result[0]

}



export const handleKeyPress = (e, current) => {
  var keynum = window.event ? window.event.keyCode : e.which;
  // if ((keynum == 8) || (keynum == 46) || (keynum == 45) || (keynum == 44) ){
   let message = ""

    if (keynum<48 || keynum>57){
      return message = "Solo se aceptan numeros en este campo"
    }
    return /\d/.test(String.fromCharCode(keynum));
}



export const number_format = (amount) => {
    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto
    amount = '' + amount.toFixed(0);

    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
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
  let normalizeData = await get_list(data_user, wallets)

  const {
    user
  } = normalizeData.entities

  let deposit_array = await serve_orders(user[data_user.id][filter], normalizeData.entities[filter], current_wallet && current_wallet.id, filter)
  // console.log('||||||||||||||||||||||| °°°°°° DEPOSIT_ARRAY:::', deposit_array)

  return deposit_array

}


export const serve_orders = async(indices, list, account_id, filter) =>{

  let new_array = []
  // console.log('°°°°||||||||||||||| ORDER SERVIDAS ',indices, list, account_id, filter)

  if(filter === 'swaps' && account_id){
    indices.map((id) => {
       (list[id].account_id === account_id || list[id].account_to === account_id) && new_array.push(list[id])
    })
  }

  if(filter !== 'swaps' && account_id){
    indices.map((id) => {
       (list[id].account_id === account_id) && new_array.push(list[id])
    })
  }

  if(!account_id){
    indices.map((id) => {
       new_array.push(list[id])
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
