import React from 'react'
import { SimpleLoader } from '../../loaders'
import '../toast.css'

export const SavePayment = (props) =>{
  const { label, loader } = props

  return(
    <div className="SavePayment" >
      <p>{label}</p>
      {
        loader ?
        <SimpleLoader />
        :
        <i className="far fa-check-circle Msuccess"></i>
      }
    </div>
  )
}

export default SavePayment
