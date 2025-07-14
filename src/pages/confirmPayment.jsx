import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from 'axios';

// Key for storing reservation details in local storage
const LOCAL_STORAGE_RESERVATION_KEY = 'confirmedReservationDetails';

function ConfirmPayment() {
    const { reservationId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [reservationDetails, setReservationDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
    const [paymentStatusMessage, setPaymentStatusMessage] = useState('');

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paystackReference = queryParams.get('reference');
        const flutterwaveTransactionId = queryParams.get('transaction_id');
        const flutterwaveRef = queryParams.get('flw_ref'); // Another common Flutterwave ref
        const trxref = queryParams.get('trxref'); // Common for Paystack on callback

        let reference = paystackReference || flutterwaveTransactionId || flutterwaveRef || trxref;

        const handleVerificationOrFetch = async () => {
            const accessToken = sessionStorage.getItem('accessToken');

            // --- NEW: Attempt to load from local storage first ---
            try {
                const storedDetailsString = localStorage.getItem(LOCAL_STORAGE_RESERVATION_KEY);
                if (storedDetailsString) {
                    const storedDetails = JSON.parse(storedDetailsString);
                    // Only use stored details if they match the current reservationId
                    if (storedDetails.id === reservationId) {
                        setReservationDetails(storedDetails);
                        setPaymentStatusMessage('Loaded details from cache.');
                        setLoading(false);
                        // If we loaded from cache and there's no new reference, we're done.
                        if (!reference) {
                            return;
                        }
                    } else {
                        // If stored details are for a different reservation, clear them
                        localStorage.removeItem(LOCAL_STORAGE_RESERVATION_KEY);
                    }
                }
            } catch (e) {
                console.error("Failed to load reservation details from local storage:", e);
                localStorage.removeItem(LOCAL_STORAGE_RESERVATION_KEY); // Clear corrupted data
            }
            // --- END NEW ---

            if (!accessToken) {
                alert("Your session has expired or is invalid. Please log in again.");
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                navigate('/login');
                setLoading(false);
                return;
            }

            if (reference) {
                setIsVerifyingPayment(true);
                setLoading(true); // Ensure loading state is active if not already from local storage check
                setError(null);
                setPaymentStatusMessage('Verifying your payment...');

                try {
                    const response = await axios.get(
                        `http://localhost:4000/api/v1/payment/verify/?reference=${reference}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            }
                        }
                    );
                    console.log('Payment verification response:', response.data);
                    const fetchedDetails = response.data.reservation;
                    setReservationDetails(fetchedDetails);
                    setPaymentStatusMessage('Payment verified successfully!');
                    
                    // --- NEW: Store fetched details in local storage ---
                    localStorage.setItem(LOCAL_STORAGE_RESERVATION_KEY, JSON.stringify(fetchedDetails));
                    // --- END NEW ---

                    // Clear any temporary payment initiation responses
                    localStorage.removeItem('PaystackPaymentInitiationResponse');
                    localStorage.removeItem('flutterwavePaymentInitiationResponse');

                } catch (err) {
                    console.error('Payment verification error:', err);
                    if (axios.isAxiosError(err) && err.response) {
                        if (err.response.status === 401) {
                            alert('Your session has expired or is invalid. Please log in again.');
                            sessionStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                            navigate('/login');
                        } else {
                            setError(err.response.data?.message || 'Payment verification failed. Please try again or contact support.');
                            setPaymentStatusMessage('Payment verification failed.');
                        }
                    } else {
                        setError('An unexpected error occurred during payment verification.');
                        setPaymentStatusMessage('An unexpected error occurred.');
                    }
                } finally {
                    setIsVerifyingPayment(false);
                    setLoading(false);
                }
            } else if (reservationId && !reservationDetails) { // Only fetch if not already loaded from local storage
                setLoading(true);
                setError(null);
                setPaymentStatusMessage('Fetching reservation details...');
                try {
                    const response = await axios.get(
                        `http://localhost:4000/api/v1/reservations/${reservationId}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            }
                        }
                    );
                    const fetchedDetails = response.data.reservation;
                    setReservationDetails(fetchedDetails);
                    setPaymentStatusMessage('Reservation details loaded.');

                    // --- NEW: Store fetched details in local storage ---
                    localStorage.setItem(LOCAL_STORAGE_RESERVATION_KEY, JSON.stringify(fetchedDetails));
                    // --- END NEW ---

                } catch (err) {
                    console.error('Failed to fetch reservation details:', err);
                    if (axios.isAxiosError(err) && err.response) {
                        if (err.response.status === 401) {
                            alert('Your session has expired or is invalid. Please log in again.');
                            sessionStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                            navigate('/login');
                        } else if (err.response.status === 404) {
                            setError('Reservation not found.');
                        } else {
                            setError(err.response.data?.message || 'Failed to load reservation details.');
                        }
                    } else {
                        setError('An unexpected error occurred.');
                    }
                } finally {
                    setLoading(false);
                }
            } else if (!reservationId && !reference) { // No ID or reference, and not loaded from storage
                 setError("No reservation ID or payment reference provided.");
                 setLoading(false);
            }
            // If reservationDetails is already set from local storage and no new reference, do nothing.
        };

        handleVerificationOrFetch();
    }, [reservationId, location.search, navigate]); // Depend on reservationId and search params

    const handlePaystackPayment = async () => {
        setError(null);
        setPaymentStatusMessage(''); // Clear previous status messages
        const accessToken = sessionStorage.getItem('accessToken');

        if (!accessToken) {
            alert("Your session has expired or is invalid. Please log in again.");
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            navigate('/login');
            return;
        }

        if (!reservationDetails || reservationDetails.paymentStatus === 'paid') {
            setError("Reservation is already paid or details are missing.");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:4000/api/v1/payment/paystack/initialize',
                { reservationId: reservationDetails.id, email: reservationDetails.emailAddress, amount: reservationDetails.totalPrice },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                }
            );

            if (response.data && response.data.authorization_url) {
                localStorage.setItem('PaystackPaymentInitiationResponse', JSON.stringify({ reference: response.data.reference }));
                window.location.href = response.data.authorization_url;
            } else {
                setError("Could not get Paystack authorization URL from backend.");
            }

        } catch (err) {
            console.error('Paystack error:', err);
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401) {
                    alert('Your session has expired or is invalid. Please log in again.');
                    sessionStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                    navigate('/login');
                } else {
                    setError(err.response.data?.message || 'Paystack initialization failed');
                }
            } else {
                setError('An unexpected error occurred during Paystack initialization.');
            }
        }
    };

    const handleFlutterwavePayment = async () => {
        setError(null);
        setPaymentStatusMessage(''); // Clear previous status messages
        const accessToken = sessionStorage.getItem('accessToken');

        if (!accessToken) {
            alert("Your session has expired or is invalid. Please log in again.");
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            navigate('/login');
            return;
        }

        if (!reservationDetails || reservationDetails.paymentStatus === 'paid') {
            setError("Reservation is already paid or details are missing.");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:4000/api/v1/payment/flutterwave/initialize',
                { reservationId: reservationDetails.id, email: reservationDetails.emailAddress, amount: reservationDetails.totalPrice },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                }
            );

            localStorage.setItem('flutterwavePaymentInitiationResponse', JSON.stringify(response.data));

            if (response.data && response.data.paymentLink) {
                window.location.href = response.data.paymentLink;
            } else {
                setError("Could not get Flutterwave payment link from backend.");
            }
        } catch (err) {
            console.error('Flutterwave error:', err);
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401) {
                    alert('Your session has expired or is invalid. Please log in again.');
                    sessionStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                    navigate('/login');
                } else {
                    setError(err.response.data?.message || 'Flutterwave initialization failed');
                }
            } else {
                setError('An unexpected error occurred during Flutterwave initialization.');
            }
        }
    };

    // Calculate nights for display
    const checkInDate = reservationDetails?.checkInDate ? new Date(reservationDetails.checkInDate) : null;
    const checkOutDate = reservationDetails?.checkOutDate ? new Date(reservationDetails.checkOutDate) : null;
    const nights = (checkInDate && checkOutDate && checkInDate < checkOutDate)
        ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24))
        : 0;

    if (loading || isVerifyingPayment) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <Loader className="animate-spin h-10 w-10 text-[#aa8453]" />
            <p className="ml-3 text-xl text-[#aa8453]">{paymentStatusMessage || 'Loading reservation details...'}</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="bg-red-800 p-6 rounded-md text-center">
                <XCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
                <p className="text-red-500 text-xl font-bold">Error:</p>
                <p className="mt-2 text-white">{error}</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 bg-[#aa8453] text-black px-6 py-2 rounded hover:bg-[#d5a464]"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );

    if (!reservationDetails) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <p className="text-gray-400 text-xl">No reservation details available.</p>
        </div>
    );

    const isPaid = reservationDetails.paymentStatus === 'paid';

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-[#aa8453]">
                        {isPaid ? "Reservation Confirmed & Paid" : "Confirm Your Reservation"}
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        {isPaid ? "Here is your payment receipt and booking details." : "Review your booking and choose a payment method."}
                    </p>
                </div>

                <div className="bg-gray-900 p-6 rounded-md shadow-inner">
                    <h2 className="text-xl font-bold text-[#aa8453] mb-4 flex items-center">
                        <CheckCircle className="mr-2 h-6 w-6" /> Booking Summary
                    </h2>
                    <div className="space-y-2 text-gray-300">
                        <p><strong>Reservation ID:</strong> <span className="float-right">{reservationDetails.id}</span></p>
                        <p><strong>Name:</strong> <span className="float-right">{reservationDetails.name}</span></p>
                        <p><strong>Email:</strong> <span className="float-right">{reservationDetails.emailAddress}</span></p>

                        {reservationDetails.roomAllocations && reservationDetails.roomAllocations.length > 0 ? (
                            <>
                                <p className="font-bold text-gray-200 pt-2">Rooms Booked:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    {reservationDetails.roomAllocations.map((room, index) => (
                                        <li key={index} className="flex justify-between">
                                            <span>{room.numberOfRooms} x {room.roomType}</span>
                                            <span>{formatCurrency(room.numberOfRooms * room.roomPrice * nights)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p>No specific room allocations found.</p>
                        )}

                        <p><strong>Check-in:</strong> <span className="float-right">{new Date(reservationDetails.checkInDate).toLocaleDateString()}</span></p>
                        <p><strong>Check-out:</strong> <span className="float-right">{new Date(reservationDetails.checkOutDate).toLocaleDateString()}</span></p>
                        <p><strong>Nights:</strong> <span className="float-right">{nights}</span></p>
                        <p><strong>Adults:</strong> <span className="float-right">{reservationDetails.noOfAdult}</span></p>
                        <p><strong>Children:</strong> <span className="float-right">{reservationDetails.noOfChildren}</span></p>
                        {reservationDetails.specialRequest && <p><strong>Special Request:</strong> <span className="float-right">{reservationDetails.specialRequest}</span></p>}

                        <div className="border-t border-gray-700 my-3 pt-3">
                            <p className="text-lg font-bold text-[#aa8453]">Total Price: <span className="float-right">{formatCurrency(reservationDetails.totalPrice)}</span></p>
                            <p className="text-sm text-gray-400">
                                Payment Status: <span className={`float-right font-semibold ${isPaid ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {reservationDetails.paymentStatus}
                                </span>
                            </p>
                            {isPaid && reservationDetails.paymentRefrence && (
                                <p className="text-sm text-gray-400">
                                    Payment Reference: <span className="float-right text-gray-200">{reservationDetails.paymentRefrence}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {!isPaid && ( // Only show payment buttons if not yet paid
                    <div className="space-y-4">
                        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                        <button
                            onClick={handlePaystackPayment}
                            className="w-full flex justify-center items-center bg-[#aa8453] hover:bg-[#d5a464] text-black font-medium py-3 px-4 rounded-md transition duration-300"
                            disabled={isVerifyingPayment}
                        >
                            <CreditCard className="mr-2 h-5 w-5" /> Pay with Paystack
                        </button>
                        <button
                            onClick={handleFlutterwavePayment}
                            className="w-full flex justify-center items-center bg-[#aa8453] hover:bg-[#d5a464] text-black font-medium py-3 px-4 rounded-md transition duration-300"
                            disabled={isVerifyingPayment}
                        >
                            <CreditCard className="mr-2 h-5 w-5" /> Pay with Flutterwave
                        </button>
                    </div>
                )}

                <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                    <Lock className="mr-1 h-3 w-3" /> Your payment is secured by industry-standard encryption.
                </div>
                {isPaid && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Go to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConfirmPayment;