import React from 'react';
import {House,Utensils,Flower,Gamepad2,CalendarFold,Dumbbell } from 'lucide-react'

const Services = () => {
  const amenities = [
    {
      icon: <House />,
      title: 'Laundry Services',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.'
    },
    {
      icon:<Utensils />,
      title: 'Food & Restaurant',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.'
    },
    {
      icon:<Flower />,
      title: 'Spa & Fitness',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.'
    },
    {
      icon:<Gamepad2 />,
      title: 'Rooms & Suite',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.'
    },
    {
      icon:<CalendarFold />,
      title: 'Event & Party',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.'
    },
    {
      icon:<Dumbbell />,
      title: 'GYM & Yoga',
      description: 'Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 bg-[#000]">
      <div className="grid md:grid-cols-3 gap-6">
        {amenities.map((amenity, index) => (
          <div 
            key={index} 
            className="flex flex-col hover:bg-[#867155] items-center text-center p-6 bg-[#1b1b1b] rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-[#aa8453] text-white p-4 rounded-full mb-4">
              {amenity.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{amenity.title}</h3>
            <p className="text-white text-sm">{amenity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;