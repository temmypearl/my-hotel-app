import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  // Add state to keep track of reservation data and selected rooms
  const [reservationData, setReservationData] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState(null);

  
  const handleReservationSubmit = (formData) => {
    console.log("Reservation data received:", formData);
    setReservationData(formData);
  };
  const handleRoomSelection = (roomData) => {
    console.log("Room selection received:", roomData);
    setSelectedRooms(roomData);
  };
  return (
      <div className="app">
       <Navbar />
        <main className="min-h-screen">
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
            <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />}/>
          </Routes>
        </main>
        <Footer />
      </div>
   
  );
}

export default App;