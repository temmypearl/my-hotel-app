import React, { useState, useEffect } from 'react';
import { CreditCard, ChevronRight, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = ({ reservationId, totalAmount, nights, roomSummary }) => {
  // State to manage the reservation details for display, initialized to null
  const [displayedReservationDetails, setDisplayedReservationDetails] = useState(null);
  // State variables for total amount, nights, and room summary, with props as initial fallback
  const [displayedTotalAmount, setDisplayedTotalAmount] = useState(totalAmount);
  const [displayedNights, setDisplayedNights] = useState(nights);
  const [displayedRoomSummary, setDisplayedRoomSummary] = useState(roomSummary);

  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [paymentData, setPaymentData] = useState({
    email: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // useEffect hook to load reservation data from localStorage when the component mounts
  useEffect(() => {
    const storedResponse = localStorage.getItem('lastReservationResponse');

    if (storedResponse) {
      try {
        const parsedData = JSON.parse(storedResponse);
        console.log("Parsed Reservation Data from localStorage:", parsedData); // For debugging

        // Check if reservationData exists in the parsed response
        if (parsedData.reservationData) {
          // Update the state with details from the backend response
          setDisplayedReservationDetails({
            name: parsedData.reservationData.name,
            checkIn: parsedData.reservationData.checkInDate, // Use backend's checkInDate
            checkOut: parsedData.reservationData.checkOutDate, // Use backend's checkOutDate
            emailAddress: parsedData.reservationData.emailAddress,
            phoneNumber: parsedData.reservationData.phoneNumber
          });

          // Use totalAmount from backend response, fallback to prop
          setDisplayedTotalAmount(parsedData.totalAmount || totalAmount);

          // Recalculate nights based on backend's check-in/check-out dates for accuracy
          if (parsedData.reservationData.checkInDate && parsedData.reservationData.checkOutDate) {
            const checkIn = new Date(parsedData.reservationData.checkInDate);
            const checkOut = new Date(parsedData.reservationData.checkOutDate);
            const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDisplayedNights(diffDays);
          } else {
            setDisplayedNights(nights); // Fallback to prop if dates are missing
          }

          // Construct room summary from backend details, fallback to prop
          if (parsedData.reservationData.roomDetails && parsedData.reservationData.roomNumber) {
            setDisplayedRoomSummary(`${parsedData.reservationData.roomDetails} (Room ${parsedData.reservationData.roomNumber})`);
          } else {
            setDisplayedRoomSummary(roomSummary); // Fallback to prop
          }

          // Pre-fill the email field for payment if available from reservationData
          setPaymentData(prev => ({ ...prev, email: parsedData.reservationData.emailAddress || '' }));

        } else {
          console.warn("localStorage 'lastReservationResponse' missing 'reservationData'.");
        }
      } catch (error) {
        // Handle parsing errors for corrupted localStorage data
        console.error("Error parsing reservation data from localStorage:", error);
        localStorage.removeItem('lastReservationResponse'); // Clear corrupt data
        alert("Failed to load reservation details. Please try reserving again.");
        navigate('/reservation'); // Redirect to reservation page
      }
    } else {
      // If no reservation data is found in localStorage, redirect the user
      alert("No reservation details found. Please make a reservation first.");
      navigate('/reservation');
    }
  }, [navigate, totalAmount, nights, roomSummary]); // Dependencies for useEffect

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Handler for payment form input changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to format card numbers (not used in current direct payment form)
  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  // Generic function to get reservation ID from localStorage or fallback to prop
  const getReservationIdForPayment = () => {
    const storedResponse = localStorage.getItem('lastReservationResponse');
    if (storedResponse) {
      try {
        const parsedData = JSON.parse(storedResponse);
        if (parsedData.reservationData?.id) {
          return parsedData.reservationData.id;
        }
      } catch (error) {
        console.error("Error parsing stored reservation ID for payment:", error);
      }
    }
    return reservationId; // Fallback to prop if localStorage fails
  };

  // Handler for Paystack payment initiation
  const handlePaystackPayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const currentReservationId = getReservationIdForPayment();

    if (!currentReservationId) {
      alert("Reservation ID not found. Cannot proceed with payment.");
      setIsLoading(false);
      return;
    }

    // --- Retrieve the access token from sessionStorage ---
    const accessToken = sessionStorage.getItem('accessToken');

    // --- Check if token exists, otherwise handle it (e.g., redirect to login) ---
    if (!accessToken) {
      alert("Your session has expired or is invalid. Please log in again.");
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      setIsLoading(false);
      return;
    }

    console.log("Initiating Paystack payment for reservation ID:", currentReservationId);
    try {
      const res = await axios.post(
        'http://localhost:4000/api/v1/payment/initiate-payment', // Ensure this URL is correct
        {
          reservationId: currentReservationId // Send the extracted ID
        },
        {
          // --- Add the Authorization header with the access token ---
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Paystack payment initiation response:", res.data);
      
      localStorage.setItem('PaystackPaymentInitiationResponse', JSON.stringify(res.data));

      window.location.href = res.data.authorization_url; // Redirect to Paystack
      navigate("/confirmPayment")
    } catch (err) {
      console.error('Paystack payment initiation error:', err);
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          alert('Your session has expired or is invalid. Please log in again.');
          sessionStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken'); // Clear refresh token too, if used
          sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
          navigate('/login');
      } else {
          alert('Paystack payment initiation failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Flutterwave payment initiation
  const handleFlutterwavePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const currentReservationId = getReservationIdForPayment();

    if (!currentReservationId) {
      alert("Reservation ID not found. Cannot proceed with payment.");
      setIsLoading(false);
      return;
    }

    // --- Retrieve the access token from sessionStorage ---
    const accessToken = sessionStorage.getItem('accessToken');

    // --- Check if token exists, otherwise handle it (e.g., redirect to login) ---
    if (!accessToken) {
      alert("Your session has expired or is invalid. Please log in again.");
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:4000/api/v1/payment/initiate-flutterwave',
        {
          reservationId: currentReservationId // Send the extracted ID
        },
        {
          // --- Add the Authorization header with the access token ---
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Flutterwave payment initiation response:", res);
      localStorage.setItem('flutterwavePaymentInitiationResponse', JSON.stringify(res));
      // window.location.href = res.data.paymentLink; // Redirect to Flutterwave
    } catch (err) {
      console.error('Flutterwave payment initiation error:', err);
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          alert('Your session has expired or is invalid. Please log in again.');
          sessionStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken'); // Clear refresh token too, if used
          sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
          navigate('/login');
      } else {
          alert('Flutterwave payment initiation failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for direct card payment (currently not implemented)
  const handleDirectPayment = async (e) => {
    e.preventDefault();
    alert('Direct card payment is currently unavailable. Please use Paystack or Flutterwave.');
  };

  // Display a loading message until reservation details are loaded
  if (!displayedReservationDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1b1b1b] text-white">
        Loading reservation details...
      </div>
    );
  }

  return (
    <div className="p-6 rounded min-h-screen flex items-center justify-center bg-[#1b1b1b]">
      <div className="bg-white shadow-2xl rounded-xl w-full max-w-lg p-8">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => navigate('/')} // Navigate to home
            className="text-sm text-[#aa8453] hover:underline"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => navigate('/reservation')} // Navigate to reservation
            className="text-sm text-[#aa8453] hover:underline"
          >
            ← Back to Reservation
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4 flex items-center text-[#aa8453]">
          <CreditCard className="mr-2" /> Payment Details
        </h2>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-2">Booking Summary</h3>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Guest:</span> {displayedReservationDetails.name || 'Guest'}</p>
            <p><span className="font-medium">Check-in:</span> {new Date(displayedReservationDetails.checkIn).toLocaleDateString()}</p>
            <p><span className="font-medium">Check-out:</span> {new Date(displayedReservationDetails.checkOut).toLocaleDateString()}</p>
            <p><span className="font-medium">Stay Duration:</span> {displayedNights} {displayedNights === 1 ? 'Night' : 'Nights'}</p>
            <p><span className="font-medium">Room Selection:</span> {displayedRoomSummary}</p>
            {displayedTotalAmount > 0 && (
              <p className="font-medium text-[#aa8453] mt-2 text-lg">
                Total Amount: {formatCurrency(displayedTotalAmount)}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          {['paystack', 'flutterwave', 'direct'].map((method) => (
            <label key={method} className="flex items-center">
              <input
                className="mr-2"
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </label>
          ))}
        </div>

        {paymentMethod === 'paystack' && (
          <form className="space-y-4" onSubmit={handlePaystackPayment}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={paymentData.email}
                onChange={handlePaymentChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center bg-[#0ab259] hover:bg-[#08a050] text-white font-medium py-3 px-4 rounded-md mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : <>Pay with Paystack {formatCurrency(displayedTotalAmount)} <ChevronRight className="ml-2 h-4 w-4" /></>}
            </button>
          </form>
        )}

        {paymentMethod === 'flutterwave' && (
          <form className="space-y-4" onSubmit={handleFlutterwavePayment}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={paymentData.email}
                onChange={handlePaymentChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center bg-[#f5a623] hover:bg-[#e09612] text-white font-medium py-3 px-4 rounded-md mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : <>Pay with Flutterwave {formatCurrency(displayedTotalAmount)} <ChevronRight className="ml-2 h-4 w-4" /></>}
            </button>
          </form>
        )}

        {paymentMethod === 'direct' && (
          <form className="space-y-4" onSubmit={handleDirectPayment}>
            <p className="text-sm text-red-500">Direct card payment is currently unavailable. Please use Paystack or Flutterwave.</p>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
          <Lock className="mr-1 h-3 w-3" /> Your payment information is secure and encrypted
        </div>
      </div>
    </div>
  );
};

export default Payment;