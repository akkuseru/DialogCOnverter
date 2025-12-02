import React from 'react'
import Converter from './components/Converter'

export default function App(){
return (
  <div className="app">
    <header>
      <h1>Dialog Converter — Excel ↔ JSON</h1>
      <p>Convierte tus diálogos sin tocar código.</p>
    </header>
  <main>
    <Converter />
  </main>
  <footer>
    <small>Portable, offline y fácil de usar.</small>
  </footer>
  </div>
)
}