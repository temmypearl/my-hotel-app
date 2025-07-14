import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Reservation = ({ onSubmit }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
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

    // Check authentication on component mount
    useEffect(() => {
        if (!isAuthenticated) {
            // Store the current path to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', '/reservation');
            // Redirect to login
            navigate('/login');
        } else {
            // Pre-fill form with user data if available
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    name: `${user.firstName} ${user.lastName}`.trim(),
                    email: user.email,
                    phone: user.phoneNumber || ''
                }));
            }
        }
    }, [isAuthenticated, navigate, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        const { name, phone, email, checkIn, checkOut, adults, children } = formData;

        if (!name.trim()) newErrors.name = "Name is required.";
        if (!phone.trim()) newErrors.phone = "Phone number is required.";
        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email address is invalid.";
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

        const checkInDate = new Date(checkIn);
        checkInDate.setHours(0, 0, 0, 0);

        const checkOutDate = new Date(checkOut);
        checkOutDate.setHours(0, 0, 0, 0);


        if (!checkIn) {
            newErrors.checkIn = "Check-in date is required.";
        } else if (checkInDate < today) {
            newErrors.checkIn = "Check-in date cannot be in the past.";
        }

        if (!checkOut) {
            newErrors.checkOut = "Check-out date is required.";
        } else if (checkOutDate <= checkInDate) {
            newErrors.checkOut = "Check-out date must be after check-in date.";
        }

        if (parseInt(adults) < 1) newErrors.adults = "At least one adult is required.";
        if (parseInt(children) < 0) newErrors.children = "Children count cannot be negative.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData); 
        } else {
            alert('Please correct the errors in the form.');
        }
    };

    return (
        <>
          <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
                <h2 className="text-3xl font-bold text-center text-[#aa8453] mb-6">Make a Reservation</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full block border border-gray-300 rounded-md p-2 bg-gray-700 text-white placeholder-gray-400"
                            placeholder="Your full name"
                            required
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full block border border-gray-300 rounded-md p-2 bg-gray-700 text-white placeholder-gray-400"
                            placeholder="Your email address"
                            required
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full block border border-gray-300 rounded-md p-2 bg-gray-700 text-white placeholder-gray-400"
                            placeholder="Your phone number"
                            required
                        />
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="checkIn" className="block text-sm font-medium text-white mb-1">Check-in Date</label>
                            <input
                                type="date"
                                id="checkIn"
                                name="checkIn"
                                value={formData.checkIn}
                                onChange={handleChange}
                                className="w-full block border border-gray-300 rounded-md p-2 bg-gray-700 text-white"
                                required
                            />
                            {errors.checkIn && <p className="text-red-400 text-xs mt-1">{errors.checkIn}</p>}
                        </div>
                        <div>
                            <label htmlFor="checkOut" className="block text-sm font-medium text-white mb-1">Check-out Date</label>
                            <input
                                type="date"
                                id="checkOut"
                                name="checkOut"
                                value={formData.checkOut}
                                onChange={handleChange}
                                className="w-full block border border-gray-300 rounded-md p-2 bg-gray-700 text-white"
                                required
                            />
                            {errors.checkOut && <p className="text-red-400 text-xs mt-1">{errors.checkOut}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="adults" className="block text-sm font-medium text-white mb-1">Adults</label>
                            <select
                                id="adults"
                                name="adults"
                                value={formData.adults}
                                onChange={handleChange}
                                className="w-full block border border-gray-300 rounded-md p-2 bg-gray-700 text-white"
                                required
                            >
                                {[...Array(10).keys()].map(num => (
                                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                                ))}
                            </select>
                            {errors.adults && <p className="text-red-400 text-xs mt-1">{errors.adults}</p>}
                        </div>
                        <div>
                            <label htmlFor="children" className="block text-sm font-medium text-white mb-1">Children</label>
                            <select
                                id="children"
                                name="children"
                                value={formData.children}
                                onChange={handleChange}
                                className="w-full block border border-gray-300 rounded-md p-2 bg-gray-700 text-white"
                                required
                            >
                                { [0,1,2,3,4,5].map(num => (
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
                            className="w-full block border border-gray-300 rounded-md p-2 bg-gray-700 text-white placeholder-gray-400"
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