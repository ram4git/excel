import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar () {
  return (
    <div className='container navbar'>
      <Link to='/'>Home</Link>
      <nav className='nav-links'>
        <Link to='/settings'>Price Calculation</Link>
				<Link to='/broken'>Price Reverse Calculation</Link>
        <Link to='/distances'>Distances</Link>
      </nav>
    </div>
  )
}
