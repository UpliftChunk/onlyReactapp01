import React from 'react'
import './NavigationBar.css'
import {Nav,Navbar} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import {FaUserTimes, FaUserPlus, FaUserCheck} from 'react-icons/fa';
function NavigationBar() {
  return (
    <div>
      <Navbar bg="dark" variant="dark" className='px-5'>
          <Navbar.Brand>
            <NavLink className='nav-link' to="/">
              <FaUserPlus className='mb-1 mx-1'/>
              NavBrand
            </NavLink>
          </Navbar.Brand>
          <Nav className="navbarContainer custstyles ms-auto">
            <NavLink className='nav-link' to="/removedUsers">
              <FaUserTimes className='mx-1 fixricon'/>
              Discarded Users
              </NavLink>
            <NavLink className='nav-link' to="/users">
              <FaUserCheck className='mx-1 fixricon'/>
              Current Users
            </NavLink>
          </Nav>
      </Navbar>
    </div>
  )
}

export default NavigationBar