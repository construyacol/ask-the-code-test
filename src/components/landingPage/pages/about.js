import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class About extends Component {
  render () {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>
        </nav>
        <p className="App-intro">
          This is the about page
        </p>
      </div>
    )
  }
}
