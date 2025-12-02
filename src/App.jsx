import React from 'react'
import Converter from './components/Converter'
import TimeConverter from './components/TimeConverter'

export default function App(){
  return (
    <div className="app">
      <header>
        <h1>ConvMin</h1>
        <p>Convierte tus diálogos sin tocar código.</p>
      </header>

      <main>
        <Converter />
        <TimeConverter /> 
      </main>

<br />
      <footer>
        <small>Portable, offline y fácil de usar.</small>
      </footer>
    </div>
  )
}
