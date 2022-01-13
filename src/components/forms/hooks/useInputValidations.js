import { useState, useEffect } from 'react'
// import * as biometricValidations from '../widgets/biometricKycComponent/validations';

const useValidations = (pathName) => {

  const [ validations, setValidations ] = useState()
  
  const getValidations = async() => {
    let vals = {}
    try {
      vals = await import(`../widgets/${pathName}/validations`);
    } catch (error) {
      console.log(error)
    }
    setValidations(vals?.default)
  }

  useEffect(() => {
    getValidations()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return validations

}

export default useValidations
