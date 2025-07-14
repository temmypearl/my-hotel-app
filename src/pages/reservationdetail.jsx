
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, RefreshCcw, Info, Calendar, DollarSign, User, Sun } from 'lucide-react'; // Icons

function ReservationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModifyForm, setShowModifyForm] = useState(false);
    const [showRefundForm, setShowRefundForm] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [modifyingData, setModifyingData] = useState({
        checkInDate: '',
        checkOutDate: '',
        noOfAdult: 1,
        noOfChildren: 0,
        specialRequest: '',
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const fetchReservation = async () => {
        try {
            const response = await fetch(`/api/v1/hotel/reservations/${id}`, {
                headers: {
                    // 'Authorization': `Bearer ${token}` // Assuming authentication
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch reservation');
            }
            setReservation(data.reservation);
            // Initialize modifyingData when reservation is fetched
            setModifyingData({
                checkInDate: data.reservation.checkInDate,
                checkOutDate: data.reservation.checkOutDate,
                noOfAdult: data.reservation.noOfAdult,
                noOfChildren: data.reservation.noOfChildren,
                specialRequest: data.reservation.specialRequest,
            });
        } catch (err) {
            setError(err.message);
            console.error('Error fetching reservation:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservation();
    }, [id]);

    const handleModifyFormChange = (e) => {
        const { name, value } = e.target;
        setModifyingData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this reservation? This action cannot be undone.')) return;
        try {
            const response = await fetch(`/api/v1/hotel/reservations/${id}/cancel`, {
                method: 'PATCH',
                headers: {
                    // 'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to cancel reservation');
            }
            alert(data.message);
            fetchReservation(); // Re-fetch to update status
        } catch (err) {
            setError(err.message);
            console.error('Cancel error:', err);
        }
    };

    const handleModifySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/v1/hotel/reservations/${id}/modify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(modifyingData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to modify reservation');
            }
            alert(data.message);
            setShowModifyForm(false);
            fetchReservation(); // Re-fetch to update details
        } catch (err) {
            setError(err.message);
            console.error('Modify error:', err);
        }
    };

    const handleRequestRefund = async () => {
        if (!refundReason.trim()) {
            alert('Please provide a reason for the refund.');
            return;
        }
        if (!window.confirm('Are you sure you want to request a refund?')) return;

        try {
            const response = await fetch(`/api/v1/hotel/payment/refund/request/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: refundReason }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to request refund');
            }
            alert(data.message);
            setShowRefundForm(false);
            setRefundReason('');
            fetchReservation(); // Re-fetch to update status if backend updates it
        } catch (err) {
            setError(err.message);
            console.error('Refund request error:', err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <p className="text-xl text-[#aa8453]">Loading reservation details...</p>
        </div>
    );
    if (error) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <p className="text-red-500 text-xl">Error: {error}</p>
        </div>
    );
    if (!reservation) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <p className="text-gray-400 text-xl">Reservation not found.</p>
        </div>
    );

    const isPendingOrPaid = reservation.paymentStatus === 'Pending' || reservation.paymentStatus === 'paid';
    const isPaid = reservation.paymentStatus === 'paid';
    const isCancelled = reservation.paymentStatus === 'cancelled';
    const isRefunded = reservation.paymentStatus === 'refunded';


    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-[#aa8453]">Reservation Details</h1>
                    <p className="mt-2 text-sm text-gray-400">Detailed information about your booking.</p>
                </div>

                {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

                <div className="bg-gray-900 p-6 rounded-md shadow-inner space-y-3">
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><Info className="mr-2 h-4 w-4" /> Reservation ID:</span>
                        <span>{reservation.id}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><User className="mr-2 h-4 w-4" /> Guest Name:</span>
                        <span>{reservation.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><Info className="mr-2 h-4 w-4" /> Email:</span>
                        <span>{reservation.emailAddress}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><Info className="mr-2 h-4 w-4" /> Phone:</span>
                        <span>{reservation.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><Calendar className="mr-2 h-4 w-4" /> Check-in Date:</span>
                        <span>{new Date(reservation.checkInDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><Calendar className="mr-2 h-4 w-4" /> Check-out Date:</span>
                        <span>{new Date(reservation.checkOutDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><User className="mr-2 h-4 w-4" /> Adults:</span>
                        <span>{reservation.noOfAdult}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><User className="mr-2 h-4 w-4" /> Children:</span>
                        <span>{reservation.noOfChildren}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><Bed className="mr-2 h-4 w-4" /> Room Number:</span>
                        <span>{reservation.roomNumber}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><Info className="mr-2 h-4 w-4" /> Room Type:</span>
                        <span>{reservation.roomDetails}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><Sun className="mr-2 h-4 w-4" /> Room Amenities:</span>
                        <span>{reservation.roomAmanities}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><Info className="mr-2 h-4 w-4" /> Special Request:</span>
                        <span>{reservation.specialRequest || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium flex items-center"><Info className="mr-2 h-4 w-4" /> Payment Reference:</span>
                        <span>{reservation.paymentRefrence || 'N/A'}</span>
                    </div>

                    <div className="border-t border-gray-700 pt-4 mt-4">
                        <div className="flex justify-between items-center text-lg font-bold text-[#aa8453]">
                            <span>Payment Status:</span>
                            <span className={isPaid ? 'text-green-400' : isCancelled ? 'text-red-400' : 'text-yellow-400'}>{reservation.paymentStatus}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold text-[#aa8453] mt-2">
                            <span>Total Price:</span>
                            <span>{formatCurrency(reservation.totalPrice)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    {!isPaid && !isCancelled && !isRefunded && (
                        <>
                            <button
                                onClick={handleCancel}
                                className="flex-1 inline-flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
                            >
                                <Trash2 className="mr-2 h-5 w-5" /> Cancel Reservation
                            </button>
                            <button
                                onClick={() => setShowModifyForm(true)}
                                className="flex-1 inline-flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-[#aa8453] hover:bg-[#d5a464] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#aa8453] transition duration-300"
                            >
                                <Edit className="mr-2 h-5 w-5" /> Modify Reservation
                            </button>
                        </>
                    )}
                    {isPaid && !isRefunded && (
                        <button
                            onClick={() => setShowRefundForm(true)}
                            className="flex-1 inline-flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                        >
                            <RefreshCcw className="mr-2 h-5 w-5" /> Request Refund
                        </button>
                    )}
                    {(isCancelled || isRefunded) && (
                        <p className="text-gray-400 text-center text-lg">
                            This reservation is {isCancelled ? 'cancelled' : 'refunded'}. No further actions.
                        </p>
                    )}
                </div>

                {/* Modify Form Modal/Section */}
                {showModifyForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-700 p-8 rounded-lg shadow-xl max-w-md w-full">
                            <h3 className="text-2xl font-bold text-[#aa8453] mb-6 text-center">Modify Reservation</h3>
                            <form className="space-y-4" onSubmit={handleModifySubmit}>
                                <div>
                                    <label htmlFor="modifyCheckInDate" className="block text-sm font-medium text-gray-300">Check-in Date</label>
                                    <input
                                        type="date"
                                        id="modifyCheckInDate"
                                        name="checkInDate"
                                        value={modifyingData.checkInDate}
                                        onChange={handleModifyFormChange}
                                        required
                                        className="mt-1 block w-full bg-gray-900 text-white border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#aa8453] focus:border-[#aa8453] sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="modifyCheckOutDate" className="block text-sm font-medium text-gray-300">Check-out Date</label>
                                    <input
                                        type="date"
                                        id="modifyCheckOutDate"
                                        name="checkOutDate"
                                        value={modifyingData.checkOutDate}
                                        onChange={handleModifyFormChange}
                                        required
                                        className="mt-1 block w-full bg-gray-900 text-white border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#aa8453] focus:border-[#aa8453] sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="modifyNoOfAdult" className="block text-sm font-medium text-gray-300">Adults</label>
                                    <input
                                        type="number"
                                        id="modifyNoOfAdult"
                                        name="noOfAdult"
                                        value={modifyingData.noOfAdult}
                                        onChange={handleModifyFormChange}
                                        min="1"
                                        required
                                        className="mt-1 block w-full bg-gray-900 text-white border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#aa8453] focus:border-[#aa8453] sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="modifyNoOfChildren" className="block text-sm font-medium text-gray-300">Children</label>
                                    <input
                                        type="number"
                                        id="modifyNoOfChildren"
                                        name="noOfChildren"
                                        value={modifyingData.noOfChildren}
                                        onChange={handleModifyFormChange}
                                        min="0"
                                        className="mt-1 block w-full bg-gray-900 text-white border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#aa8453] focus:border-[#aa8453] sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="modifySpecialRequest" className="block text-sm font-medium text-gray-300">Special Request</label>
                                    <textarea
                                        id="modifySpecialRequest"
                                        name="specialRequest"
                                        rows="2"
                                        value={modifyingData.specialRequest}
                                        onChange={handleModifyFormChange}
                                        className="mt-1 block w-full bg-gray-900 text-white border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#aa8453] focus:border-[#aa8453] sm:text-sm"
                                        placeholder="Enter any special requests"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModifyForm(false)}
                                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#aa8453] hover:bg-[#d5a464] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#aa8453]"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Refund Request Form Modal/Section */}
                {showRefundForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-700 p-8 rounded-lg shadow-xl max-w-md w-full">
                            <h3 className="text-2xl font-bold text-[#aa8453] mb-6 text-center">Request Refund</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="refundReason" className="block text-sm font-medium text-gray-300">Reason for Refund</label>
                                    <textarea
                                        id="refundReason"
                                        rows="4"
                                        placeholder="Please explain why you are requesting a refund..."
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        className="mt-1 block w-full bg-gray-900 text-white border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#aa8453] focus:border-[#aa8453] sm:text-sm"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowRefundForm(false)}
                                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRequestRefund}
                                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Submit Refund Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReservationDetail;