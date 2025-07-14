import React, { useState, useEffect } from "react";

const Hero = () => {
    const sliders = [
        {
          id: '1',
          imgSrc: 'https://duruthemes.com/demo/html/cappa/demo1-dark/img/slider/1.jpg',
          alt: 'Luxury Hotel Slide',
          title: 'LUXURY HOTEL & BEST RESORT',
          description: 'ENJOY A LUXURY EXPERIENCE',
          button: { text: 'ROOMS & SUITES' },
        },
        {
          id: '2',
          imgSrc: 'https://duruthemes.com/demo/html/cappa/demo1-dark/img/slider/2.jpg',
          alt: 'Relaxation Slide',
          title: 'UNIQUE PLACE TO RELAX AND ENJOY',
          description: 'THE PERFECT BASE FOR YOU',
          button: { text: 'ROOMS & SUITES' },
        },
        {
          id: '3',
          imgSrc: 'https://duruthemes.com/demo/html/cappa/demo1-dark/img/slider/3.jpg',
          alt: 'Luxury Experience Slide',
          title: 'THE ULTIMATE LUXURY EXPERIENCE',
          description: 'ENJOY THE BEST MOMENTS OF LIFE',
          button: { text: 'ROOMS & SUITES' },
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageLoadError, setImageLoadError] = useState(false);

    // Automatic sliding
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliders.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(slideInterval);
    }, [sliders.length]);

    // Image error handling
    const handleImageError = () => {
        setImageLoadError(true);
    };

    const StarRating = () => {
        return (
            <div className="flex justify-center items-center mb-4 transform translate-y-10 opacity-0 transition-all duration-700 ease-out group-[.active]:translate-y-0 group-[.active]:opacity-100">
                {[...Array(5)].map((_, index) => (
                    <svg 
                        key={index} 
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-[#aa8453] fill-current"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {sliders.map((slider, index) => (
                <div 
                    key={slider.id} 
                    className={`
                        absolute inset-0 transition-opacity duration-500 ease-in-out
                        ${currentSlide === index ? 'opacity-100 group active' : 'opacity-0'}
                    `}
                >
                    {/* Background Image */}
                    {!imageLoadError ? (
                        <img 
                            src={slider.imgSrc} 
                            alt={slider.alt} 
                            onError={handleImageError}
                            className="absolute inset-0 w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gray-800"></div>
                    )}

                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                    <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="text-center text-white px-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl">
                            <StarRating />
                            <p className="
                                text-xs sm:text-sm md:text-base mb-2 sm:mb-4 tracking-widest uppercase font-serif
                                transform translate-y-10 opacity-0 transition-all duration-700 ease-out delay-300
                                group-[.active]:translate-y-0 group-[.active]:opacity-100
                            ">
                                {slider.title}
                            </p>
                            <h2 className="
                                text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-widest mb-4 sm:mb-6 md:mb-8 uppercase font-serif
                                transform translate-y-10 opacity-0 transition-all duration-700 ease-out delay-500
                                group-[.active]:translate-y-0 group-[.active]:opacity-100
                            ">
                                {slider.description}
                            </h2>
                            <a 
                                href="#room" 
                                className="
                                    inline-block border-2 border-white text-white py-2 px-4 
                                    sm:py-3 sm:px-6 md:py-3 md:px-8
                                    text-sm sm:text-base
                                    uppercase tracking-wider font-semibold
                                    transform translate-y-10 opacity-0 transition-all duration-700 ease-out delay-700
                                    group-[.active]:translate-y-0 group-[.active]:opacity-100
                                    hover:bg-white hover:text-black 
                                "
                            >
                                {slider.button?.text}
                            </a>
                        </div>
                    </div>
                </div>
            ))}

            <div className="absolute top-1/2 right-2 sm:right-4 md:right-8 transform -translate-y-1/2 flex flex-col space-y-2 z-20">
                {sliders.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition duration-300 ${
                            currentSlide === index 
                                ? 'bg-white' 
                                : 'bg-white/50 hover:bg-white/75'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Hero;