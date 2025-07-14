import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useAuth } from '../context/AuthContext'; // adjust path if needed

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4005/api/v1/auth/users/login', formData);

            const data = response.data;

            if (!response.status === 200) {
                throw new Error(data.message || 'Login failed');
            }

            // Call login from context to store user + token
            login(data.user, data.token);

            // Redirect to home or dashboard
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1b1b1b]">
            <div className="bg-black text-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#aa8453]">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 text-sm">Email</label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-black rounded border border-gray-300"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-1 text-sm">Password</label>
                        <input 
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-black rounded border border-gray-300"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#aa8453] text-white py-2 rounded hover:bg-[#d5a464] transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
