import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Reservation = ({ onSubmit }) => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        checkIn: '',
        checkOut: '',
        adults: '1',
        children: '0',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear specific field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ''}));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{11}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Invalid phone number';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        // Check-in date validation
        if (!formData.checkIn) {
            newErrors.checkIn = 'Check-in date is required';
        // } else if (checkInDate < today) {
        //     newErrors.checkIn = 'Check-in date cannot be in the past';
        }

        // Check-out date validation
        if (!formData.checkOut) {
            newErrors.checkOut = 'Check-out date is required';
        } else if (checkOutDate <= checkInDate) {
            newErrors.checkOut = 'Check-out date must be after check-in date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkRoomAvailability = () => {
        // Simulate room availability check - always return true to proceed
        const guests = parseInt(formData.adults) + parseInt(formData.children);
        const nights = Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24));
        
        // Always return true for this implementation to proceed to room booking
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Check room availability
            const isAvailable = checkRoomAvailability();
            
            if (isAvailable) {
                // Pass form data to parent component via onSubmit prop
                onSubmit(formData);
                
                // Navigate to room booking page after successful form submission
                navigate('/roombooking');
            } else {
                // No rooms available
                alert('Sorry, no rooms available for the selected dates and guests.');
            }
        }
    };

    return (
        <>
          <div className="relative w-full h-[70vh]">
            <img 
              src="https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/8.jpg" 
              alt="Hotel lobby" 
              className="w-full h-full object-cover"
            />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white font-serif tracking-wider mb-4">RESERVATION</h1>
          <div className="w-20 h-1 bg-[#aa8453]"></div>
        </div>
        </div>
        <div className="p-6 rounded min-h-screen flex items-center justify-center bg-[#1b1b1b] ">
            <div className="bg-black shadow-2xl rounded-xl w-full max-w-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-[#aa8453]">Make a Reservation</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">Name</label>
                            <input 
                                type="text" 
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full block border rounded-md p-2 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">Phone Number</label>
                            <input 
                                type="tel" 
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full block border rounded-md p-2 ${
                                    errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="1234567890"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full block border rounded-md p-2 ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="checkIn" className="block text-sm font-medium text-white mb-1">Check-in Date</label>
                            <input 
                                type="date" 
                                id="checkIn"
                                name="checkIn"
                                value={formData.checkIn}
                                onChange={handleChange}
                                className={`w-full block border rounded-md p-2 ${
                                    errors.checkIn ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}
                        </div>
                        <div>
                            <label htmlFor="checkOut" className="block text-sm font-medium text-white mb-1">Check-out Date</label>
                            <input 
                                type="date" 
                                id="checkOut"
                                name="checkOut"
                                value={formData.checkOut}
                                onChange={handleChange}
                                className={`w-full block border rounded-md p-2 ${
                                    errors.checkOut ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="adults" className="block text-sm font-medium text-white mb-1">Adults</label>
                            <select 
                                id="adults"
                                name="adults"
                                value={formData.adults}
                                onChange={handleChange}
                                className="w-full block border border-gray-300 rounded-md p-2"
                            >
                                {[1,2,3,4,5].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                                <option value="5+">5+</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="children" className="block text-sm font-medium text-white mb-1">Children</label>
                            <select 
                                id="children"
                                name="children"
                                value={formData.children}
                                onChange={handleChange}
                                className="w-full block border border-gray-300 rounded-md p-2"
                            >
                                {[0,1,2,3,4,5].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                                <option value="5+">5+</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-white mb-1">Special Requests</label>
                        <textarea 
                            id="notes"
                            name="notes"
                            rows={4} 
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full block border border-gray-300 rounded-md p-2"
                            placeholder="Any special requests or additional information"
                        ></textarea>
                    </div>

                    <div className="text-center">
                        <button 
                            type="submit" 
                            className="w-full bg-[#aa8453] text-white py-2 px-4 rounded-md hover:bg-[#d5a464] transition duration-300"
                        >
                            Check Availability
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default Reservation;