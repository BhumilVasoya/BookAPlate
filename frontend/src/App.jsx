// src/App.jsx
import React, { useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import About from './Components/About';
import Service from './Components/Service';
import Contact from './Components/Contact';
import SignUp from './Components/SignUp';
import SignIn from './Components/Signin';
import ProtectedRoute from './Components/ProtectedRoute';
import Restaurants from './Components/Restaurants';
import Reservation from './Components/Reservation';
import Payment from './Components/Payment';
import Confirmation from './Components/Confirmation';

function App() {
  const aboutRef = useRef(null);
  const serviceRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (section) => {
    section.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route path="/restaurant" element={<Restaurants />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/payment" element={<Payment />}/>
      <Route path="/confirmation" element={<Confirmation />}/>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navbar
              onAboutClick={() => scrollToSection(aboutRef)}
              onServiceClick={() => scrollToSection(serviceRef)}
              onContactClick={() => scrollToSection(contactRef)}
            />
            <section id="about" ref={aboutRef}>
              <About />
            </section>
            <section id="service" ref={serviceRef}>
              <Service />
            </section>
            <section id="contact" ref={contactRef}>
              <Contact />
            </section>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
