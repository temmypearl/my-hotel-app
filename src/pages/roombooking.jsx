import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Utensils, Tv, Dumbbell, Clock } from 'lucide-react';

const RoomBooking = ({ formData, onContinue }) => {
  const navigate = useNavigate();
  const [roomCounts, setRoomCounts] = useState({
    junior: 0,
    double: 0,
    deluxe: 0,
    family: 0,
    superior: 0
  });

  const updateRoomCount = (roomType, increment) => {
    setRoomCounts(prev => ({
      ...prev,
      [roomType]: Math.max(0, prev[roomType] + increment)
    }));
  };

  // Room data with prices as numbers for calculation
  const roomData = [
    {
      id: 'junior',
      name: 'Double Deluxe',
      price: 145000, // Price as a number for calculations
      displayPrice: 'NGN145,000', // Formatted price for display
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/1.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    },
    {
      id: 'double',
      name: 'Royal Standard',
      price: 150000,
      displayPrice: 'NGN150,000',
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/2.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    },
    {
      id: 'deluxe',
      name: 'Royal Executive',
      price: 165000,
      displayPrice: 'NGN165,000',
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/3.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    },
    {
      id: 'family',
      name: 'Executive Suite',
      price: 185000,
      displayPrice: 'NGN185,000',
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/4.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    },
    {
      id: 'superior',
      name: 'Luxury King',
      price: 200000,
      displayPrice: 'NGN200,000',
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/7.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    },
    {
      id: 'superior',
      name: 'Premium Suite',
      price: 200000,
      displayPrice: 'NGN200,000',
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/7.jpg",
      date: formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '03 Apr, 2025'
    }
  ];

  const getAmenityIcon = (amenity) => {
    if (amenity.includes('WiFi')) return <Wifi size={16} />;
    if (amenity.includes('Restaurant')) return <Utensils size={16} />;
    if (amenity.includes('TV')) return <Tv size={16} />;
    if (amenity.includes('Gym')) return <Dumbbell size={16} />;
    return null;
  };

  // Calculate number of nights
  const calculateNights = () => {
    if (formData?.checkIn && formData?.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    }
    return 1; // Default to 1 night if dates aren't specified
  };

  const nights = calculateNights();

  // Calculate total amount for all selected rooms
  const calculateTotal = () => {
    let total = 0;
    
    // Add up the cost of each room type
    roomData.forEach(room => {
      const count = roomCounts[room.id];
      if (count > 0) {
        total += room.price * count;
      }
    });
    
    // Multiply by number of nights
    total *= nights;
    
    return total;
  };

  const totalAmount = calculateTotal();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleContinueBooking = () => {
    // Check if at least one room is selected
    const totalRooms = Object.values(roomCounts).reduce((sum, count) => sum + count, 0);
    if (totalRooms === 0) {
      alert('Please select at least one room to continue.');
      return;
    }
    
    // Pass selected rooms and total amount to parent component via onContinue prop
    onContinue({ roomCounts, totalAmount, nights });
    
    // Navigate to payment page after room selection
    navigate('/payment');
  };

  // Display reservation summary
  const checkInDate = formData?.checkIn ? new Date(formData.checkIn).toLocaleDateString() : 'Not specified';
  const checkOutDate = formData?.checkOut ? new Date(formData.checkOut).toLocaleDateString() : 'Not specified';

  return (
    <div className="bg-[#1b1b1b] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-[#aa8453] mb-4">Reservation Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-white">
            <div>
              <p className="text-sm text-gray-400">Guest</p>
              <p className="font-medium">{formData?.name || 'Guest'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Check-in</p>
              <p className="font-medium">{checkInDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Check-out</p>
              <p className="font-medium">{checkOutDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Guests</p>
              <p className="font-medium">{formData?.adults || '1'} Adults, {formData?.children || '0'} Children</p>
            </div>
          </div>
          <div className="mt-4 text-white">
            <p className="text-sm text-gray-400">Stay Duration</p>
            <p className="font-medium">{nights} {nights === 1 ? 'Night' : 'Nights'}</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-white mb-10">Choose Your Preferred Rooms</h1>
        <div className="space-y-8">
          {roomData.map((room) => (
            <div key={room.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b border-gray-700 pb-8">
              <div className="md:col-span-4">
                <img src={room.image} alt={room.name} className="w-full h-48 object-cover rounded-md" />
              </div>
              <div className="md:col-span-5 flex flex-col justify-between text-white">
                <h2 className="text-xl font-semibold text-[#aa8453] mb-2">{room.name}</h2>
                <div className="bg-black p-2 rounded-md mb-4">
                  {room.amenities.map((amenity, index) => (
                    <span key={index} className="inline-flex items-center mr-4 mb-2 text-gray-300">
                      <span className="mr-1 text-[#aa8453]">{getAmenityIcon(amenity)}</span>
                      <span className="text-sm">{amenity}</span>
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#aa8453]">
                    {room.displayPrice} <br/>
                    <span className="text-sm font-normal text-gray-400 ml-1">per night</span>
                  </p>
                  <div className="flex items-start mt-2 text-xs text-gray-400">
                    <Clock size={16} className="mr-1 mt-0.5 flex-shrink-0 text-[#aa8453]" />
                    <p>Cancellation Policy: This booking may be cancelled for free before 12:00pm hotel local time on {room.date}</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 flex flex-col items-center justify-center">
                <span className="text-lg font-medium text-[#aa8453] mb-2">Rooms</span>
                <div className="flex items-center border border-gray-700 rounded-md overflow-hidden">
                  <button 
                    onClick={() => updateRoomCount(room.id, -1)}
                    className="bg-[#aa8453] text-white px-4 py-2 font-bold hover:bg-[#6a5438] transition-colors duration-200"
                    type="button"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 text-white">{roomCounts[room.id]}</span>
                  <button 
                    onClick={() => updateRoomCount(room.id, 1)}
                    className="bg-[#aa8453] text-white px-4 py-2 font-bold hover:bg-[#6a5438] transition-colors duration-200"
                    type="button"
                  >
                    +
                  </button>
                </div>
                {roomCounts[room.id] > 0 && (
                  <p className="mt-2 text-white">
                    <span className="text-[#aa8453]">{formatCurrency(room.price * roomCounts[room.id])}</span> per night
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total amount summary */}
        {totalAmount > 0 && (
          <div className="mt-8 bg-black p-6 rounded-lg text-white">
            <h3 className="text-xl font-bold text-[#aa8453] mb-4">Booking Summary</h3>
            
            {/* Show selected rooms */}
            <div className="space-y-2 mb-4">
              {roomData.map(room => (
                roomCounts[room.id] > 0 && (
                  <div key={`summary-${room.id}`} className="flex justify-between">
                    <span>{roomCounts[room.id]} x {room.name}</span>
                    <span>{formatCurrency(room.price * roomCounts[room.id])}</span>
                  </div>
                )
              ))}
            </div>
            
            {/* Duration */}
            <div className="flex justify-between border-t border-gray-700 pt-4 mb-2">
              <span>Duration:</span>
              <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
            </div>
            
            {/* Total */}
            <div className="flex justify-between font-bold text-xl border-t border-gray-700 pt-4">
              <span>Total Amount:</span>
              <span className="text-[#aa8453]">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button 
            onClick={handleContinueBooking}
            className="bg-[#aa8453] text-white px-8 py-3 rounded-md font-medium hover:bg-[#6a5438] transition-colors duration-200"
            type="button"
          >
            Continue Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomBooking;