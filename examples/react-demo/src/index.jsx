import React from 'react'
import ReactDOM from 'react-dom'
import ComponentA from './components/ComponentA'
import ComponentB from './components/ComponentB'

const App = () => (
  <div>
    <ComponentA />
    <ComponentB />
  </div>
)

const app = document.querySelector('#app')

ReactDOM.render(<App />, app)
