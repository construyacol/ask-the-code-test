import React from 'react';

function Icon(props){

  const {
    color,
    size,
    clases,
    viewBox
  } = props

  return(
      <svg
        className={clases ? clases : ''}
        viewBox={`${viewBox ? viewBox : '0 0 512 512' }`}
        height={size}
        width={size}
        fill={color}
        >
        {props.children}
      </svg>
  )
}

export default Icon;
