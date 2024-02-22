import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <div>Hello from App.jsx</div>
      <Outlet />
    </>
  )
}

export default App
