import React from "react";
import { ShieldCheck, MoonStar, Bookmark, Utensils, Trophy, Bed, Phone, Flower } from "lucide-react";

const Service = () => {
  return (
    <div className="bg-[#121212] text-white">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://duruthemes.com/demo/html/cappa/demo1-dark/img/slider/2.jpg" 
            alt="Luxury Hotel Services" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <h1 className="text-lg tracking-[5px] uppercase text-[#aa8453]">THE ULTIMATE LUXURY</h1>
            <h2 className="text-5xl md:text-7xl font-serif mt-4 mb-6">Our Services</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Discover a range of exclusive amenities and personalized services designed to enhance your stay
            </p>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="py-24 px-4 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-[#aa8453] font-semibold text-lg tracking-widest uppercase">WELCOME TO THE HOTEL</h3>
            <h2 className="text-4xl md:text-5xl font-serif mt-3 mb-6">Premium Services</h2>
            <div className="h-[1px] w-24 bg-[#aa8453] mx-auto mb-6"></div>
            <p className="text-white/70 max-w-3xl mx-auto">
              Experience luxury redefined with our comprehensive range of services tailored to exceed your expectations.
              Our dedicated team is committed to providing an unforgettable experience throughout your stay.
            </p>
          </div>
          
          {/* Services List in Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {/* Service Item 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#aa8453]/20 flex items-center justify-center">
                  <Bed className="text-[#aa8453] size-8" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-serif mb-3">Room Service</h4>
                <p className="text-white/70">
                  Enjoy gourmet dining in the comfort of your room with our 24-hour room service. Our menu features a selection of international and local cuisine prepared by our talented chefs.
                </p>
              </div>
            </div>
            
            {/* Service Item 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#aa8453]/20 flex items-center justify-center">
                  <MoonStar className="text-[#aa8453] size-8" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-serif mb-3">Night Comfort</h4>
                <p className="text-white/70">
                  Experience undisturbed rest with our signature bedding, soundproof rooms, and evening turndown service that includes aromatherapy options to enhance your sleep quality.
                </p>
              </div>
            </div>
            
            {/* Service Item 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#aa8453]/20 flex items-center justify-center">
                  <Utensils className="text-[#aa8453] size-8" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-serif mb-3">Fine Dining</h4>
                <p className="text-white/70">
                  Savor exceptional culinary creations at our award-winning restaurant featuring seasonal menus, premium wines, and attentive service in an elegant atmosphere.
                </p>
              </div>
            </div>
            
            {/* Service Item 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#aa8453]/20 flex items-center justify-center">
                  <ShieldCheck className="text-[#aa8453] size-8" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-serif mb-3">Safety & Security</h4>
                <p className="text-white/70">
                  Rest assured with our comprehensive security systems, including 24/7 surveillance, secure access controls, and trained security personnel ensuring your safety.
                </p>
              </div>
            </div>
            
            {/* Service Item 5 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#aa8453]/20 flex items-center justify-center">
                  <Flower className="text-[#aa8453] size-8" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-serif mb-3">Gym & Yoga</h4>
                <p className="text-white/70">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident vero eos error quas
                   beatae dolore illum debitis exercitationem velit, voluptates delectus voluptatibus, reiciendis, maiores 
                   odit fugiat numquam fuga facilis praesentium?
                </p>
              </div>
            </div>
            
            {/* Service Item 6 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#aa8453]/20 flex items-center justify-center">
                  <Trophy className="text-[#aa8453] size-8" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-serif mb-3">Premium Amenities</h4>
                <p className="text-white/70">
                  Enjoy luxury toiletries, plush robes, slippers, and carefully curated in-room amenities designed to enhance your comfort and convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Service Highlight */}
      <div className="bg-[#151515] py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6 flex flex-col justify-center">
              <h3 className="text-[#aa8453] font-semibold tracking-widest uppercase">SIGNATURE EXPERIENCE</h3>
              <h2 className="text-4xl font-serif">Wellness & Spa</h2>
              <p className="text-white/70">
                Immerse yourself in tranquility at our award-winning spa sanctuary. Our skilled therapists combine ancient healing traditions with modern techniques to create personalized experiences that rejuvenate your body and mind.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Bookmark className="text-[#aa8453] size-5" />
                  <span>Therapeutic massages and body treatments</span>
                </li>
                <li className="flex items-center gap-3">
                  <Bookmark className="text-[#aa8453] size-5" />
                  <span>Facial treatments using premium skincare products</span>
                </li>
                <li className="flex items-center gap-3">
                  <Bookmark className="text-[#aa8453] size-5" />
                  <span>Steam room, sauna, and relaxation lounges</span>
                </li>
                <li className="flex items-center gap-3">
                  <Bookmark className="text-[#aa8453] size-5" />
                  <span>Indoor heated pool with hydrotherapy features</span>
                </li>
              </ul>
              {/* <div className="pt-4">
                <button className="bg-[#aa8453] hover:bg-[#96744a] text-white py-3 px-8 uppercase tracking-wider text-sm transition-colors duration-300">
                  Book Treatment
                </button>
              </div> */}
            </div>
            <div className="relative">
              <img 
                src="https://duruthemes.com/demo/html/cappa/demo1-dark/img/spa/1.jpg" 
                alt="Spa and Wellness" 
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact / Reservation */}
      <div className="bg-[#1a1a1a] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Ready to experience our premium services?</h2>
          <p className="text-white/70 mb-8">
            Contact our reservations team to book your stay and discover the ultimate in luxury hospitality.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <div className="flex items-center gap-3">
              <Phone className="text-[#aa8453] size-6" />
              <span className="text-xl font-serif">+234 000 456 77</span>
            </div>
            {/* <button className="bg-[#aa8453] hover:bg-[#96744a] text-white py-3 px-8 uppercase tracking-wider text-sm transition-colors duration-300">
              Make a Reservation
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;