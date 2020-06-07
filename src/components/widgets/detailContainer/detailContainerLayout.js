import React, { Component } from 'react'
import { connect } from 'react-redux'

import './detailContainer.css'

class detailContainerLayout extends Component {
  render() {
    const { current_wallet, pathname, primary_path, style, customClass = '' } = this.props

    return (
      <div style={style ? style : {}} className={`${customClass} contenido ${(primary_path && current_wallet) ? 'DCcurrent_wallet' : ''} ${primary_path} ${pathname}`}>
        {this.props.children}
      </div>
    )

  }
}

function mapStateToProps(state, props) {
  let account_opts = {}
  if (props.match) {
    const { path, primary_path, account_id } = props.match.params
    account_opts = {
      current_wallet: (props.wallets && account_id) && props.wallets[account_id],
      pathname: path,
      primary_path
    }
  }

  return {
    current_section: state.ui.current_section,
    ...account_opts
  }
}

export default connect(mapStateToProps)(detailContainerLayout)
