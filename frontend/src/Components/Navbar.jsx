
import React, { useState, useEffect } from "react";
import ScrollReveal from "scrollreveal";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onAboutClick, onServiceClick, onContactClick }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });

  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const scrollRevealOption = {
      distance: "50px",
      origin: "bottom",
      duration: 1000,
    };

    ScrollReveal().reveal(".header__container p", { ...scrollRevealOption });
    ScrollReveal().reveal(".header__container h1", { ...scrollRevealOption, delay: 500 });

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser({ name: "", email: "" });
    localStorage.removeItem("user");
  };

  const navigate = useNavigate();

  const goToRestaurant = () => {
    navigate('/restaurant');
  };


  return (
    <div>
      <header className="header">
        <nav>
         <link href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" rel="stylesheet"/>

            <div className="nav__bar">
                <div className="logo">
                    <a href="/"><img src="/images/logo-1.png" alt="logo"/></a>
                </div>
                <div className="nav__menu__btn" onClick={toggleMenu}>
                    <i className={isOpen ? "ri-close-line" : "ri-menu-line"}></i>
                </div>
            </div>
            <ul className={`nav__links ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(false)} id="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); onAboutClick(); }}>About</a></li>
                <li><a href="#service" onClick={(e) => { e.preventDefault(); onServiceClick(); }}>Service</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); onContactClick(); }}>Contact</a></li>
            </ul>
            <button className="btn nav__btn" onClick={goToRestaurant}>Reserve a table</button>

            <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="profile-menu">
                <FaUserCircle className="profile-icon" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="dropdown-content">
                <DropdownMenu.Item className="dropdown-item">
                  {user.name || "User"}
                </DropdownMenu.Item>
                <DropdownMenu.Item className="dropdown-item">
                  {user.email || "user@example.com"}
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="dropdown-separator" />
                <DropdownMenu.Item className="dropdown-item" onClick={handleLogout}>
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </nav>
        
        <div className="section__container header__container" id="home">
            <p>Reserve, Relax, Repeat!</p>
            <h1>Great Food Starts with Great Reservations</h1>
        </div>
        </header>
    </div>
  )
}

export default Navbar
