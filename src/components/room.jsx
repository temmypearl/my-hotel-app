import React from "react";
import { Bed, Bath, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Rooms = () => {
  const navigate = useNavigate();
  const roomData = [
    {
      id: 1,
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/1.jpg",
      price: "NGN1000/Night",
      name: "Double Deluxe",
      bed: 3,
      bath: 2,
      wifi: true,
      description: "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem."
    },
    {
      id: 2,
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/2.jpg",
      price: "NGN1200/Night",
      name: "Royal Standard",
      bed: 3,
      bath: 2,
      wifi: true,
      description: "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem."
    },
    {
      id: 3,
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/3.jpg",
      price: "NGN1400/Night",
      name: "Royal Executive",
      bed: 3,
      bath: 2,
      wifi: true,
      description: "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem."
    },
    {
      id: 4,
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/4.jpg",
      price: "NGN1500/Night",
      name: "Executive Suite",
      bed: 3,
      bath: 2,
      wifi: true,
      description: "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem."
    },
    {
      id: 5,
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/2.jpg",
      price: "NGN1700/Night",
      name: "Luxury King Bed",
      bed: 3,
      bath: 2,
      wifi: true,
      description: "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem."
    },
    {
      id: 6,
      image: "https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/7.jpg",
      price: "NGN2000/Night",
      name: "Premium Suite",
      bed: 3,
      bath: 2,
      wifi: true,
      description: "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem."
    }
  ];

  return (
    <div className="bg-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h6 className="text-[#aa8453] font-medium mb-2 sm:mb-3 flex items-center justify-center">
            <span className="hidden sm:inline-block w-8 md:w-12 h-px bg-[#aa8453] mr-2 md:mr-4"></span>
            OUR ROOMS
            <span className="hidden sm:inline-block w-8 md:w-12 h-px bg-[#aa8453] ml-2 md:ml-4"></span>
          </h6>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">
            Explore Our <span className="text-[#aa8453]">ROOMS</span>
          </h2>
        </div>

        {/* Responsive grid - adjusts based on screen size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {roomData.map((room) => (
            <div key={room.id} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-48 sm:h-56 md:h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-[#aa8453] text-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-medium">
                  {room.price}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 sm:mb-0">{room.name}</h3>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 sm:w-5 sm:h-5 text-[#aa8453]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap border-b border-gray-200 pb-3 sm:pb-4 mb-3 sm:mb-4">
                  <div className="flex items-center mr-4 mb-2 sm:mb-0">
                    <Bed className="text-[#aa8453] mr-1 sm:mr-2" size={16} />
                    <span className="text-sm sm:text-base text-gray-600">{room.bed} Bed</span>
                  </div>
                  <div className="flex items-center mr-4 mb-2 sm:mb-0">
                    <Bath className="text-[#aa8453] mr-1 sm:mr-2" size={16} />
                    <span className="text-sm sm:text-base text-gray-600">{room.bath} Bath</span>
                  </div>
                  <div className="flex items-center mb-2 sm:mb-0">
                    <Wifi className="text-[#aa8453] mr-1 sm:mr-2" size={16} />
                    <span className="text-sm sm:text-base text-gray-600">Wifi</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{room.description}</p>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button className="bg-[#aa8453] hover:bg-[#9b7d55] text-white text-sm sm:text-base font-medium py-2 px-4 sm:px-6 rounded transition duration-300 flex items-center justify-center">
                    VIEW DETAIL
                  </button>
                 <button
                    onClick={() => navigate("/reservation")}
                    className="bg-[#aa8453] hover:bg-[#9b7d55] text-white text-sm sm:text-base font-medium py-2 px-4 sm:px-6 rounded transition duration-300 flex items-center justify-center"
                    type="button"
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
