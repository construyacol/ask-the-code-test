import React from 'react'

import './items.css'

// forma de activacion en css:
// .componentePadre:hover .bigEgg{
//   animation-name: bigEgg;
// }
// .componentePadre:hover .egg{
//   animation-name: egg;
// }

const ActiveItem = props => {

  const {
  Anim2,
  color
  } = props

  let eggStyles = {
    transform:Anim2 ? 'scale(1)' : 'scale(0)',
    animationDelay:Anim2 ? '.12s' : '',
    background:color === 'green' ? 'linear-gradient(to right, #11998e, #38ef7d)' : 'linear-gradient(to right, #377FD7, #00D2FF)'
  }

  let bigEggStyles = {
    animationDelay:Anim2 ? '.15s' : '',
    background:color === 'green' ? '#3be18545' : '#109cd04f'
  }

  return(
    <div className="active_account" title="Cuenta Habilitada">
      <div className="bigEgg" style={bigEggStyles}></div>
      <div className="egg" style={eggStyles}></div>
    </div>
  )

}

export default ActiveItem
