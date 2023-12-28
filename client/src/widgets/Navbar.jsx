import { useState } from 'react'
import { NavLink } from 'react-router-dom'
// import { ReactComponent as Hamburger } from '../../assets/icons/hamburger.svg'
// import { ReactComponent as Brand } from '../../assets/icons/logo.svg'
import logo from "../parents.png";
import './Navbar.css'

const Navbar = ({onLogout}) => {
  const [showNavbar, setShowNavbar] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <img src={logo} alt='logo' style={{ width: "30px", height: "30px", backgroundColor: "white", borderRadius: "50%" }} />
          <span style={{ fontSize: "2rem" }}>REUNIFY</span>
        </div>


        {/*<div className="menu-icon" onClick={handleShowNavbar}>
          <Hamburger />
        </div> */}
        <div className={`nav-elements  ${showNavbar && 'active'}`}>
          <ul>
            <li>
              <NavLink to="/home">Home</NavLink>
            </li>
            <li>
              <NavLink to="/report">Report</NavLink>
            </li>
            <li>
              <NavLink to="/search">Search</NavLink>
            </li>
            {/* <li>
              <NavLink to="/profile">Profile</NavLink>
            </li> */}
            <li>
              <a href="/" onClick={onLogout}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar