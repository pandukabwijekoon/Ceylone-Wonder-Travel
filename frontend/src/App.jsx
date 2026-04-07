import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages (to be implemented)
import Home from './pages/Home';
import Explore from './pages/Explore';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Destination from './pages/Destination';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Packages from './pages/Packages';
import TripPlanner from './pages/TripPlanner';

// Styles
import './css/style.css';
import './css/header.css';
import './css/animations.css';

function App() {
  return (
    <Router>
      {/* We can conditionally render Navbar if we are not on Auth pages if we want */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/destination/:name" element={<Destination />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
      </Routes>
      <Footer />
      <Chatbot />
    </Router>
  );
}

export default App;
