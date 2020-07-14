import React from 'react'
import '../icons.css'

export const CompartirBank = props => {

  return(
    <img width={props.size} src="data:image/png;base64,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" alt=""/>
  )

}

export default CompartirBank