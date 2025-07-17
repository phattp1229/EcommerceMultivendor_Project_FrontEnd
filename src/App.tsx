import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

function App() {
  return (
    <div className="p-20">

      <h1 className='font-bold text-5xl'>Shopping Mall</h1>

      <Button variant='contained'>Shop E-commerce</Button>  {/* Nút có nền xanh đậm (default primary)*/}

      <AddShoppingCartIcon></AddShoppingCartIcon>
    </div>
  )
}

export default App
