export const ApiGetRequest = async(url, header) => {

  let parametros = {
              method: 'GET',
              headers: header,
             };

  let response
  try {
    response = await fetch(url, parametros)
  }
  catch(error) {
    // si no tenemos conexión con el API nos retornara esto:
    return false
  }
  if(!response.ok){return response.status}
  const data = await response.json()
  return data
}


export const ApiPostRequest = async(url, body, token) => {

  let myHeaders = {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'Authorization':token && `Bearer ${token}`
  }

  let parametros = {
               method: 'POST',
               headers: myHeaders,
               body:JSON.stringify(body)
             }

  let response
  try {
    response = await fetch(url, parametros)
  }
  catch(error) {
    // si no tenemos conexión con el API nos retornara esto:
    return false
  }

  // console.log('|||||||||| °°°°STATUS GOOD°°°°|||||||', response)
  // Si el error esta en los datos de la petición, retornamos el estatus 465
  if(!response.ok){return response.status}
  const data = await response.json()
  return data
}


export const ApiDelete = async(url) => {

  let parametros = {
          method: 'DELETE'
        }
  let response

  try {
    response = await fetch(url, parametros)
  }
  catch(error) {
    // si no tenemos conexión con el API nos retornara esto:
    return false
  }
  // Si el error esta en los datos de la petición, retornamos el estatus 465
  if(!response.ok){return response.status}
  const delete_success = await response.json()
  return delete_success
}


export const generate_headers = (token) =>{


  return async(dispatch, getState) => {
    if(!token){
      const { user, user_id } = getState().modelData
        token = user[user_id].TokenUser
    }

    let myHeaders = {
      'Authorization': `Bearer ${token}`,
    }

    return myHeaders
  }

}
