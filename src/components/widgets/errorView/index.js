import React from 'react'

const ErrorView = props => {

  const {
    msg
  } = props

  return(
    <div>
      <p>Ha ocurrido un error, {msg && msg}</p>
    </div>
  )
}

export default ErrorView
