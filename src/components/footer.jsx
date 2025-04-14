import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {

    return (
      <>
        <footer className="bg-[#1b1b1b] text-white py-16">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 font-serif">
                <div>
                    <h3 className="text-2xl text-[#aa8453] font-semibold mb-4 uppercase tracking-wider">UI HOTEL</h3>
                    <p className="text-white mb-4">
                        Experience unparalleled luxury and comfort in our exquisite hotel, where every moment is crafted to perfection.
                    </p>
                </div>

                <div>
                    <h4 className="text-xl font-medium mb-4 uppercase tracking-wider text-[#aa8453]">Quick Links</h4>
                    <ul className="space-y-2">
                        {[
                            { name: 'Rooms', link: '#rooms' },
                            { name: 'Suites', link: '#suites' },
                            { name: 'Services', link: '#amenities' },
                            { name: 'Booking', link: '#booking' }
                        ].map((item) => (
                            <li key={item.name}>
                                <a 
                                    href={item.link} 
                                    className="text-white hover:text-[#aa8453] transition duration-300"
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-xl font-medium mb-4 uppercase tracking-wider text-[#aa8453]">Contact</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center space-x-3">
                            <MapPin className="text-[#aa8453]" size={30} />
                            <span>Conference Centre Building, Chaptel Road, University of Ibadan, Ibadan, Nigeria</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Phone className="text-[#aa8453]" size={20} />
                            <span>+234 000 456 77</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Mail className="text-[#aa8453]" size={20} />
                            <span>reservations@luxuryhotel.com</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Clock className="text-[#aa8453]" size={20} />
                            <span>24/7 Customer Support</span>
                        </li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className='text-white'>
                    <h4 className="text-xl font-medium mb-4 uppercase tracking-wider text-[#aa8453]">Newsletter</h4>
                    <p className=" mb-4">
                        Subscribe to receive exclusive offers and updates.
                    </p>
                    <div className="flex">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="w-full px-4 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#aa8453]"
                        />
                        <button 
                            className="bg-[#aa8453] text-black px-4 py-2 hover:bg-[#aa8453] transition duration-300"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </footer>
        <footer>
        <div className="border-t border-gray-800  pt-6 text-center bg-black">
                <p className="text-gray-400">
                    © {new Date().getFullYear()} UI Hotel. All Rights Reserved.
                </p>
                <div className="mt-4 space-x-4">
                    <a href="#privacy" className="text-gray-300 hover:text-white">Privacy Policy</a>
                    <a href="#terms" className="text-gray-300 hover:text-white">Terms of Service</a>
                </div>
            </div>
        </footer>
        </>
    );
};

export default Footer;