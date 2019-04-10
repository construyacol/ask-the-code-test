import React from 'react'

export default function asyncComponent(importComponent) {
  class AsyncComponent extends React.Component {
    // as this is an 'async' component, a scenario
    // where the compontent unMounted while this was
    // loading is possible. Change stillHere properly
    // so it doesn't set the component (hence, mount and render)
    stillHere = true
    constructor(props) {
      super(props)

      this.state = {
        component: null
      }
    }

    async componentDidMount() {
      const { default: component } = await importComponent()

      if (!this.stillHere) {
        return
      }
      this.setState({
        component: component
      })
    }

    componentWillUnmount () {
      this.stillHere = false
    }

    render() {
      const C = this.state.component

      return C ? <C {...this.props} /> : null
    }
  }

  return AsyncComponent
}
