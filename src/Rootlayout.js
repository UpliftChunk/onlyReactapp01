import React from 'react'
import NavigationBar from './components/navigationbar/NavigationBar'
import { Outlet } from 'react-router-dom'
import Footer from './components/footer/Footer';

function Rootlayout() {
  return (
    <div>
      {/* navigation bar */}
      <NavigationBar/>
      {/* place holder */}
      <Outlet/>

      <Footer/>
    </div>
  )
}

export default Rootlayout