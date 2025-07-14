// src/pages/ReservationHistory.js (React-like, styled)
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, DollarSign, Bed } from 'lucide-react'; // Icons

function ReservationHistory() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch('/api/v1/hotel/reservations/history', {
                    headers: {
                        // 'Authorization': `Bearer ${token}` // Assuming user is authenticated
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch reservations');
                }
                setReservations(data.reservations);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching reservations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <p className="text-xl text-[#aa8453]">Loading reservation history...</p>
        </div>
    );
    if (error) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <p className="text-red-500 text-xl">Error: {error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-center text-4xl font-extrabold text-[#aa8453]">My Reservations</h1>
                    <p className="mt-4 text-center text-lg text-gray-400">
                        View and manage your past and upcoming bookings.
                    </p>
                </div>

                {reservations.length === 0 ? (
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                        <p className="text-gray-400 text-xl">You have no reservations yet.</p>
                        <Link to="/book" className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-[#aa8453] hover:bg-[#d5a464]">
                            Book a Room Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reservations.map(reservation => (
                            <div key={reservation.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-[#aa8453] mb-2">Reservation #{reservation.id.substring(0, 8)}...</h3>
                                    <p className={`text-sm mb-3 font-semibold ${reservation.paymentStatus === 'paid' ? 'text-green-400' : reservation.paymentStatus === 'cancelled' ? 'text-red-400' : 'text-yellow-400'}`}>
                                        Status: {reservation.paymentStatus}
                                    </p>
                                    <div className="text-gray-300 space-y-1 text-sm">
                                        <p className="flex items-center"><CalendarCheck className="mr-2 h-4 w-4" /> Check-in: {new Date(reservation.checkInDate).toLocaleDateString()}</p>
                                        <p className="flex items-center"><CalendarCheck className="mr-2 h-4 w-4" /> Check-out: {new Date(reservation.checkOutDate).toLocaleDateString()}</p>
                                        <p className="flex items-center"><Bed className="mr-2 h-4 w-4" /> Room: {reservation.roomDetails} ({reservation.roomNumber})</p>
                                        <p className="flex items-center"><DollarSign className="mr-2 h-4 w-4" /> Total Price: {formatCurrency(reservation.totalPrice)}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        to={`/reservations/${reservation.id}`}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#aa8453] hover:bg-[#d5a464] transition duration-300"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReservationHistory;