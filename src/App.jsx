import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import { AuthProvider } from "./context/AuthContext";
import './app.css';
import axios from 'axios'; // Import axios for API calls

// Import all your pages/components
import Home from "./pages/Home";
import Aboutus from "./pages/aboutus";
import RoomBooking from "./pages/roombooking";
import Contact from "./pages/contact";
import Login from "./pages/login";
import Services from "./pages/service";
import OTPPage from "./pages/otp";
import PaymentCallback from "./pages/paymentCallback";
import ConfirmPayment from "./pages/confirmPayment";
import ReservationHistory from "./pages/ReservationHistory";
import Reservation from "./pages/reservation";
import ReservationDetails from "./pages/reservationdetail";
import Payment from "./pages/payment";
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function AppLayout({ children }) {
    const location = useLocation();
    // Ensure paths match the routes where Navbar/Footer should be hidden
    const hideLayout = location.pathname.startsWith("/roombooking") ||
                     location.pathname.startsWith("/reservation/") || // Covers /reservation/:id/confirm
                     location.pathname.startsWith("/payment-callback");

    return (
        <div className="app">
            <ScrollToTop />
            {!hideLayout && <Navbar />}
            <main className="min-h-screen">
                {children}
            </main>
            {!hideLayout && <Footer />}
        </div>
    );
}

function App() {
    const navigate = useNavigate();
    const [reservationData, setReservationData] = useState(null); // Initial reservation form data
    const [selectedRooms, setSelectedRooms] = useState(null); // Selected rooms from RoomBooking (optional for state)

    const [currentAuthPage, setCurrentAuthPage] = useState('login');
    const [userEmail, setUserEmail] = useState('');

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

    const handleReservationSubmit = (formData) => {
        console.log("Reservation data received:", formData);
        setReservationData(formData); // Store initial form data
        navigate('/roombooking');
    };

    const handleRoomBookingContinue = async ({ roomCounts, totalAmount, nights }) => {
        // This function is called when the user clicks "Continue Booking" in RoomBooking
        setSelectedRooms(roomCounts); // Store selected room counts if needed later

        if (!reservationData) {
            console.error("No initial reservation data found to create booking.");
            alert("Please go back to the reservation form and fill it out first.");
            navigate('/reservation');
            return;
        }

        try {
            // Prepare the payload for your backend's reservation register endpoint.
            // Map frontend form data to backend expected fields.
            const bookingPayload = {
                name: reservationData.name,
                emailAddress: reservationData.email,
                phoneNumber: reservationData.phone,
                specialRequest: reservationData.notes || "nothing",
                checkInDate: reservationData.checkIn,
                checkOutDate: reservationData.checkOut,
                noOfAdult: Number(reservationData.adults),
                noOfChildren: Number(reservationData.children),
                // Backend's 'Register' function currently calculates its own totalPrice based on an arbitrary room.
                // To fully utilize frontend's calculated totalAmount and specific room selections,
                // the backend's 'Register' endpoint would need modification to accept 'totalPrice'
                // from the client and potentially 'roomCounts' to book specific room types.
                // For now, we send core data matching the backend's expected fields.
                // Sending `totalPrice` here is good practice for a future-proof backend.
                totalPrice: totalAmount, // Send total amount calculated by frontend
                // If backend needs selected room types/counts explicitly, you would add them here:
                // selectedRoomCounts: roomCounts,
            };

            const response = await axios.post(
                'http://localhost:4000/api/v1/hotel/reservation/register',
                bookingPayload
            );

            // Assuming your backend returns the new reservation object, e.g., in `response.data.results[0].newReservation`
            const { newReservation } = response.data.results[0];
            const reservationId = newReservation.id;

            if (reservationId) {
                // Navigate to the payment confirmation page with the new reservation ID
                navigate(`/reservation/${reservationId}/confirm`);
            } else {
                alert("Failed to create reservation. No reservation ID received from the server.");
            }

        } catch (error) {
            console.error("Error creating reservation:", error);
            // Provide user-friendly error message
            alert("Failed to create reservation. Please try again. " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <AuthProvider>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/aboutus" element={<Aboutus />} />
                    <Route path="/service" element={<Services />} />

                    <Route
                        path="/reservation"
                        element={<Reservation onSubmit={handleReservationSubmit} />}
                    />

                    <Route
                        path="/roombooking"
                        element={
                            reservationData ? (
                                <RoomBooking
                                    formData={reservationData}
                                    onContinue={handleRoomBookingContinue}
                                />
                            ) : (
                                <Navigate replace to="/reservation" />
                            )
                        }
                    />
                    <Route
                        >
                       
                    </Route>
                    <Route
                        path="/confirmPayment"
                        element={<ConfirmPayment />}
                    />
                     <Route
                        path="/payment"
                        element={<Payment />}
                    />
                    <Route
                        path="/payment-callback"
                        element={<PaymentCallback />}
                    />

                    <Route
                        path="/my-reservations"
                        element={<ReservationHistory />}
                    />

                    <Route
                        path="/my-reservations/:id"
                        element={<ReservationDetails />}
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
        </AuthProvider>
    );
}

export default App;