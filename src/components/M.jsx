import React, { useState } from 'react';
import { Wifi, Utensils, Tv, Dumbbell, Clock } from 'lucide-react';

const RoomBooking = () => {
  const [roomCounts, setRoomCounts] = useState({
    junior: 0,
    double: 0,
    deluxe: 0,
    family:0,
    superior:0
  });

  const updateRoomCount = (roomType, increment) => {
    setRoomCounts(prev => ({
      ...prev,
      [roomType]: Math.max(0, prev[roomType] + increment)
    }));
  };

  const roomData = [
    {
      id: 'junior',
      name: 'Junior Suite',
      price: 'NGN145,000',
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/1.jpg",
      date: '03 Apr, 2025'
    },
    {
      id: 'double',
      name: 'Double Suite',
      price: 'NGN150,000',
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/2.jpg",
      date: '03 Apr, 2025'
    },
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      price: 'NGN165,000',
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/3.jpg",
      date: '03 Apr, 2025'
    },
    {
      id: 'family',
      name: 'Family Room',
      price: 'NGN185,000',
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/4.jpg",
      date: '03 Apr, 2025'
    },
    {
      id: 'superior',
      name: 'Superior Room',
      price: 'NGN200,000',
      amenities: ['Breakfast', 'WiFi', 'Gym', 'Satellite TV', 'Restaurant on-site'],
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/7.jpg",
      date: '03 Apr, 2025'
    }
  ];

  const getAmenityIcon = (amenity) => {
    if (amenity.includes('WiFi')) return <Wifi size={16} />;
    if (amenity.includes('Restaurant')) return <Utensils size={16} />;
    if (amenity.includes('TV')) return <Tv size={16} />;
    if (amenity.includes('Gym')) return <Dumbbell size={16} />;
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-black mb-8">Choose Your Prefered Rooms</h1>
      
      <div className="space-y-8">
        {roomData.map((room) => (
          <div key={room.id} className="flex flex-col md:flex-row border rounded-lg overflow-hidden shadow-sm">
            <div className="w-full md:w-1/3">
              <img 
                src={room.image} 
                alt={room.name} 
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="flex-1 p-4 md:p-6 flex flex-col">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-medium text-[#aa8453]">{room.name}</h2>
                  <div className="mt-2">
                    <p className="text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
                      {room.amenities.map((amenity, index) => (
                        <span key={index} className="flex items-center gap-1">
                          {getAmenityIcon(amenity)}
                          <span className="text-sm">{amenity}</span>
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="block text-sm">Rooms</span>
                </div>
              </div>
              
              <div className="mt-auto flex flex-col md:flex-row justify-between items-end">
                <div>
                  <p className="text-[#aa8453] text-2xl font-bold">
                    {room.price}
                    <span className="text-gray-500 text-sm font-normal block">per night</span>
                  </p>
                  
                  <div className="mt-2 flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <p className="text-xs">
                      Cancellation Policy: This booking may be cancelled for free before 12:00pm hotel local time on {room.date}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mt-4 md:mt-0">
                  <button 
                    onClick={() => updateRoomCount(room.id, -1)}
                    className="w-12 h-12 bg-[#aa8453] text-white rounded-md text-2xl font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg">{roomCounts[room.id]}</span>
                  <button 
                    onClick={() => updateRoomCount(room.id, 1)}
                    className="w-12 h-12 bg-[#aa8453] text-white rounded-md text-2xl font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <button className="bg-[#aa8453] hover:bg-[#7b6344] text-white font-medium py-3 px-6 rounded-lg transition duration-300 w-full md:w-auto">
          Continue Booking
        </button>
      </div>
    </div>
  );
};

export default RoomBooking;