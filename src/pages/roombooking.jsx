import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Utensils, Tv, Dumbbell, Clock } from 'lucide-react';
import axios from 'axios'; // Make sure axios is imported

const RoomBooking = ({ formData, onContinue }) => {
  const navigate = useNavigate();
  const [roomCounts, setRoomCounts] = useState({
    junior: 0,
    double: 0,
    deluxe: 0,
    family: 0,
    superior: 0,
    premium: 0
  });

  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for displaying errors

  const updateRoomCount = (roomType, increment) => {
    setRoomCounts(prev => ({
      ...prev,
      [roomType]: Math.max(0, prev[roomType] + increment)
    }));
  };

  // Room data with updated prices (assuming this is correct and fetched/defined)
  const roomData = [
    {
      id: 'junior',
      name: 'Double Deluxe',
      price: 1000,
      displayPrice: 'NGN1,000',
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/1.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    },
    {
      id: 'double',
      name: 'Double Room',
      price: 1500,
      displayPrice: 'NGN1,500',
      amenities: ['Breakfast', 'WiFi', 'Mini-bar', '24-hour room service'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/2.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    },
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      price: 2000,
      displayPrice: 'NGN2,000',
      amenities: ['Breakfast', 'WiFi', 'Bathtub', 'City View', 'Executive Lounge Access'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/3.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    },
    {
      id: 'family',
      name: 'Family Suite',
      price: 2500,
      displayPrice: 'NGN2,500',
      amenities: ['Breakfast', 'WiFi', 'Kitchenette', 'Separate Living Area', 'Kids Club Access'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/4.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    },
    {
      id: 'superior',
      name: 'Superior Suite',
      price: 3000,
      displayPrice: 'NGN3,000',
      amenities: ['Breakfast', 'WiFi', 'Private Balcony', 'Sea View', 'Butler Service'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/5.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    },
    {
      id: 'premium',
      name: 'Premium Penthouse',
      price: 5000,
      displayPrice: 'NGN5,000',
      amenities: ['Breakfast', 'WiFi', 'Private Pool', 'Personal Chef', '24/7 Concierge'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/6.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    }
  ];

  const calculateTotal = () => {
    let total = 0;
    roomData.forEach(room => {
      total += room.price * roomCounts[room.id];
    });
    return total;
  };

  const totalAmount = calculateTotal();

  // Calculate number of nights
  const checkInDate = formData?.checkIn ? new Date(formData.checkIn) : null;
  const checkOutDate = formData?.checkOut ? new Date(formData.checkOut) : null;
  const nights = (checkInDate && checkOutDate)
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24))
    : 0;


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

const handleContinueBooking = async () => {
  // Input validation checks
  setError(null); // Clear previous errors
  if (!formData || !formData.checkIn || !formData.checkOut) {
    setError("Please go back and fill in reservation details first.");
    navigate('/reservation');
    return;
  }

  if (totalAmount <= 0) {
    setError("Please select at least one room to continue.");
    return;
  }

  setIsLoading(true); // Set loading state to true

  const selectedRoomDetails = roomData
    .filter(room => roomCounts[room.id] > 0)
    .map(room => ({
      roomType: room.name, // Use the display name
      roomPrice: room.price,
      numberOfRooms: roomCounts[room.id]
    }));

  const reservationDetails = {
    checkInDate: formData.checkIn,
    checkOutDate: formData.checkOut,
    noOfAdult: parseInt(formData.adults),
    noOfChildren: parseInt(formData.children),
    roomAllocations: selectedRoomDetails, // Using the mapped selected room details
    totalPrice: totalAmount,
    specialRequest: formData.notes,
    // Add user details from formData with corrected keys
    name: formData.name,
    emailAddress: formData.email, // Using emailAddress as per your latest
    phoneNumber: formData.phone,   // Using phoneNumber as per your latest
  };

  // --- Retrieve the access token from sessionStorage ---
  const accessToken = sessionStorage.getItem('accessToken');

  // --- Check if token exists, otherwise handle it (e.g., redirect to login) ---
  if (!accessToken) {
    setError("You are not logged in. Please log in to make a reservation.");
    // Optionally, store the current path to redirect after successful login
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    navigate('/login'); // Assuming you have a login route
    setIsLoading(false);
    return;
  }

  try {
    const res = await axios.post(
      'http://localhost:4000/api/v1/reservation',
      reservationDetails,
      {
        // --- Add the Authorization header with the access token ---
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Full Reservation Response from Backend:", res.data); // Log the full response for verification

    // --- Save the whole reservation response data to localStorage ---
    // Make sure to stringify it because localStorage stores strings
    
    // --- Now perform the normal checking for reservation ID ---
    // IMPORTANT: Verify the exact path for the reservation ID from your backend response.
    // Based on your console.log line: `res.data.reservationData.id`
    if (res.data.reservationData.id) {
      const reservationId = res.data.reservationData.id;
      console.log("Reservation registered successfully with ID:", reservationId);
      localStorage.setItem('lastReservationResponse', JSON.stringify(res.data));
      navigate(`/payment`); // Navigate to confirmation page
    } else {
      // If API call is successful but reservation ID is missing or malformed
      setError('Reservation successful, but reservation ID could not be retrieved. Please check your reservations history.');
      alert('Reservation successful, but reservation ID could not be retrieved. Please check your reservations history.');
    }
  } catch (err) {
    console.error('Error during reservation:', err);
    if (err.response) {
      // Handle 401 Unauthorized specifically for token issues
      if (err.response.status === 401) {
        setError('Your session has expired or is invalid. Please log in again.');
        alert('Your session has expired or is invalid. Please log in again.');
        sessionStorage.removeItem('accessToken'); // Clear invalid token
        localStorage.removeItem('refreshToken'); // Clear refresh token as well if appropriate
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname); // Store current path
        navigate('/login'); // Redirect to login
      } else {
        // Log the specific server error message for better debugging
        console.error("Server Error Details:", err.response.data);
        setError(`Reservation failed: ${err.response.data.message || 'Server error'}`);
        alert(`Reservation failed: ${err.response.data.message || 'Server error'}`);
      }
    } else if (err.request) {
      // The request was made but no response was received (e.g., network down)
      setError('Network error: No response from server. Please check your internet connection or try again later.');
      alert('Network error: Could not connect to the server. Please try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      setError(`An unexpected error occurred: ${err.message}`);
      alert(`An unexpected error occurred: ${err.message}`);
    }
  } finally {
    setIsLoading(false); // Always set loading to false after attempt
  }
};


  return (
    <div className="bg-black text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-[#aa8453] text-center mb-10">Select Your Room(s)</h2>

        {error && (
            <div className="bg-red-800 text-white p-3 rounded-md mb-6 text-center">
                <p>{error}</p>
            </div>
        )}

        {/* Display reservation details from formData */}
        {formData && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-10 text-center">
            <h3 className="text-2xl font-semibold text-[#aa8453] mb-4">Your Reservation Details</h3>
            <p className="text-lg">Check-in: <span className="font-medium">{new Date(formData.checkIn).toLocaleDateString()}</span></p>
            <p className="text-lg">Check-out: <span className="font-medium">{new Date(formData.checkOut).toLocaleDateString()}</span></p>
            <p className="text-lg">Adults: <span className="font-medium">{formData.adults}</span>, Children: <span className="font-medium">{formData.children}</span></p>
            <p className="text-lg">Nights: <span className="font-medium">{nights}</span></p>
            {formData.notes && <p className="text-lg">Special Request: <span className="font-medium">{formData.notes}</span></p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roomData.map((room) => (
            <div key={room.id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col">
              <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-[#aa8453] mb-2">{room.name}</h3>
                <p className="text-xl text-gray-300 mb-4">{formatCurrency(room.price)} <span className="text-sm text-gray-500">/ night</span></p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map((amenity, idx) => (
                    <span key={idx} className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full flex items-center">
                      {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                      {amenity === 'Breakfast' && <Utensils className="h-3 w-3 mr-1" />}
                      {amenity === 'Satellite TV' && <Tv className="h-3 w-3 mr-1" />}
                      {amenity === 'Gym' && <Dumbbell className="h-3 w-3 mr-1" />}
                      {amenity === '24-hour room service' && <Clock className="h-3 w-3 mr-1" />}
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-700">
                  <span className="text-lg font-semibold">Rooms: {roomCounts[room.id]}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateRoomCount(room.id, -1)}
                      className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-colors duration-200"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateRoomCount(room.id, 1)}
                      className="bg-[#aa8453] text-black p-2 rounded-full hover:bg-[#d5a464] transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total amount summary */}
        {totalAmount > 0 && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg text-white shadow-xl">
            <h3 className="text-xl font-bold text-[#aa8453] mb-4">Booking Summary</h3>

            {/* Show selected rooms */}
            <div className="space-y-2 mb-4">
              {roomData.map(room => (
                roomCounts[room.id] > 0 && (
                  <div key={`summary-${room.id}`} className="flex justify-between text-lg">
                    <span>{roomCounts[room.id]} x {room.name}</span>
                    <span>{formatCurrency(room.price * roomCounts[room.id] * nights)}</span> {/* Adjusted to show total per room per nights */}
                  </div>
                )
              ))}
            </div>

            <div className="flex justify-between font-bold text-2xl border-t border-gray-700 pt-4">
              <span>Total for {nights} {nights === 1 ? 'night' : 'nights'}</span>
              <span>{formatCurrency(totalAmount * nights)}</span> {/* Total for all rooms for all nights */}
            </div>
          </div>
        )}

        {/* Continue booking button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleContinueBooking}
            className="bg-[#aa8453] text-black font-bold px-8 py-4 rounded hover:bg-[#6a5438] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? 'Processing...' : 'Continue Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomBooking;