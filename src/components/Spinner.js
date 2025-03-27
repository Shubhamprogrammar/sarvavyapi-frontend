import React, { Component } from 'react'
import rolling from "./Rolling.gif"

export class Spinner extends Component {
  render() {
    return (
      <div className='text-center'>
        <img className='my-3' src={rolling} alt="Broken" />
      </div>
    )
  }
}

export default Spinner