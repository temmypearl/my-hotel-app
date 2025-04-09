import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      text: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd et erat magna eos",
      name: "Client Name",
      profession: "Profession",
      image: "https://themewagon.github.io/hotelier/img/testimonial-3.jpg"
    },
    {
      id: 2,
      text: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd et erat magna eos",
      name: "Client Name",
      profession: "Profession",
      image: "https://themewagon.github.io/hotelier/img/testimonial-1.jpg"
    },
    {
      id: 3,
      text: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd et erat magna eos",
      name: "Client Name",
      profession: "Profession",
      image: "https://themewagon.github.io/hotelier/img/testimonial-2.jpg"
    }
  ];

  const nextSlide = () => {
    console.log("Next button clicked, current slide:", currentSlide);
    setCurrentSlide((prev) => {
      const newValue = prev === testimonials.length - 1 ? 0 : prev + 1;
      console.log("Setting new slide value to:", newValue);
      return newValue;
    });
  };

  const prevSlide = () => {
    console.log("Prev button clicked, current slide:", currentSlide);
    setCurrentSlide((prev) => {
      const newValue = prev === 0 ? testimonials.length - 1 : prev - 1;
      console.log("Setting new slide value to:", newValue);
      return newValue;
    });
  };

  React.useEffect(() => {
    console.log("Current slide updated to:", currentSlide);
  }, [currentSlide]);

  return (
    <div className="relative w-full overflow-hidden ">
      <div className="absolute inset-0 bg-gray-800 opacity-30">
        <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800 opacity-80"></div>
      </div>
   
      <div className="relative z-10 px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
       
          <div className="mb-4 text-white">
            Slide {currentSlide + 1} of {testimonials.length}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            <div 
              key={testimonials[currentSlide].id}
              className="bg-white rounded-lg p-6 shadow-lg"
            >
              <p className="text-gray-700 mb-6">{testimonials[currentSlide].text}</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonials[currentSlide].image} 
                  alt={testimonials[currentSlide].name} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{testimonials[currentSlide].name}</h3>
                  <p className="text-gray-600">{testimonials[currentSlide].profession}</p>
                </div>
                
                <div className="ml-auto text-amber-600 text-6xl font-serif">"</div>
              </div>
            </div>
           
            <div 
              key={testimonials[(currentSlide + 1) % testimonials.length].id}
              className="hidden md:block bg-white rounded-lg p-6 shadow-lg"
            >
              <p className="text-gray-700 mb-6">{testimonials[(currentSlide + 1) % testimonials.length].text}</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonials[(currentSlide + 1) % testimonials.length].image} 
                  alt={testimonials[(currentSlide + 1) % testimonials.length].name} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{testimonials[(currentSlide + 1) % testimonials.length].name}</h3>
                  <p className="text-gray-600">{testimonials[(currentSlide + 1) % testimonials.length].profession}</p>
                </div>
                
                <div className="ml-auto text-[#aa8453] text-6xl font-serif">"</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button 
            onClick={prevSlide}
            className= "bg-[#aa8453] text-white p-3 rounded hover:bg-[#997950] transition-colors focus:outline-none focus:ring-2 focus:ring-[#aa8453]"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="bg-[#aa8453] text-white p-3 rounded hover:bg-[#997950] transition-colors focus:outline-none focus:ring-2 focus:ring-[#aa8453]"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;