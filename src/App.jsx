import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import './app.css';

// Import your page components
import Home from "./pages/Home";
import Aboutus from "./pages/aboutus";
import Reservation from "./pages/reservation";
import RoomBooking from "./pages/roombooking";
import Contact from "./pages/contact";
import Payment from "./pages/payment";
import Login from "./pages/login";
import Services from "./pages/service";
import OTPPage from "./pages/otp";

// Layout component to handle conditional navbar/footer rendering
function AppLayout({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname === "/roombooking" || location.pathname === "/payment";
  
  return (
    <div className="app">
      {!hideLayout && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  // Reservation and room booking state
  const [reservationData, setReservationData] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState(null);
  
  // Login/OTP state
  const [currentAuthPage, setCurrentAuthPage] = useState('login');
  const [userEmail, setUserEmail] = useState('');

  // Authentication handlers
  const handleRegistrationSuccess = (email) => {
    setUserEmail(email);
    setCurrentAuthPage('otp');
  };

  const handleOTPVerificationComplete = () => {
    alert('Account verified successfully! You can now login.');
    setCurrentAuthPage('login');
  };

  const handleBackToLogin = () => {
    setCurrentAuthPage('login');
  };

  // Reservation handlers
  const handleReservationSubmit = (formData) => {
    console.log("Reservation data received:", formData);
    setReservationData(formData);
  };

  const handleRoomSelection = (roomData) => {
    console.log("Room selection received:", roomData);
    setSelectedRooms(roomData);
  };

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/service" element={<Services />} />
        <Route
          path="/reservation"
          element={
            <Reservation
              onSubmit={(formData) => {
                setReservationData(formData);
                // Navigation happens in the component using useNavigate
              }}
            />
          }
        />
        <Route
          path="/roombooking"
          element={
            reservationData ? (
              <RoomBooking
                formData={reservationData}
                onContinue={(roomCounts) => {
                  setSelectedRooms(roomCounts);
                  // Navigation happens in the component using useNavigate
                }}
              />
            ) : (
              <Navigate replace to="/" />
            )
          }
        />
        <Route
          path="/payment"
          element={
            reservationData && selectedRooms ? (
              <Payment
                reservationDetails={reservationData}
                selectedRooms={selectedRooms}
              />
            ) : (
              <Navigate replace to="/" />
            )
          }
        />
        <Route 
          path="/login" 
          element={
            currentAuthPage === 'login' ? (
              <Login onRegistrationSuccess={handleRegistrationSuccess} />
            ) : (
              <OTPPage
                userEmail={userEmail}
                onVerificationComplete={handleOTPVerificationComplete}
                onBack={handleBackToLogin}
              />
            )
          } 
        />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AppLayout>
  );
}

export default App;