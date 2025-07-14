// src/pages/PaymentCallback.js (React-like, styled)
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react'; // Icons for success/failure

function PaymentCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState('Verifying your payment...');
    const [error, setError] = useState(null);
    const [reservationData, setReservationData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    useEffect(() => {
        const verifyPayment = async () => {
            setIsLoading(true);
            const paystackReference = searchParams.get('reference') || searchParams.get('trxref');
            const flutterwaveTransactionId = searchParams.get('transaction_id');

            let endpoint = '';
            let params = {};

            if (paystackReference) {
                endpoint = '/api/v1/hotel/payment/paystack/verify';
                params = { reference: paystackReference };
            } else if (flutterwaveTransactionId) {
                endpoint = '/api/v1/hotel/payment/flutterwave/verify';
                params = { transaction_id: flutterwaveTransactionId };
            } else {
                setError('No payment reference or transaction ID found. Payment status unknown.');
                setPaymentStatus('Payment Status Unknown');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${endpoint}?${new URLSearchParams(params).toString()}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Payment verification failed. Please try again or contact support.');
                }

                setPaymentStatus('Payment Successful!');
                setReservationData(data.reservation);
                // Optionally redirect after a short delay
                // setTimeout(() => navigate(`/reservations/${data.reservation.id}`), 3000);

            } catch (err) {
                setError(err.message);
                setPaymentStatus('Payment Failed');
                console.error('Verification error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                {isLoading ? (
                    <>
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#aa8453]"></div>
                        </div>
                        <h1 className="text-xl font-bold text-gray-300">{paymentStatus}</h1>
                    </>
                ) : (
                    <>
                        {error ? (
                            <>
                                <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
                                <h1 className="text-3xl font-extrabold text-red-400">Payment Failed!</h1>
                                <p className="text-red-300 mt-2">{error}</p>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                                <h1 className="text-3xl font-extrabold text-green-400">Payment Successful!</h1>
                                <p className="text-gray-300 mt-2">{paymentStatus}</p>
                                {reservationData && (
                                    <div className="mt-6 bg-gray-900 p-5 rounded-md text-left">
                                        <h2 className="text-xl font-bold text-[#aa8453] mb-3">Reservation Confirmed</h2>
                                        <p className="text-sm text-gray-400"><strong>Reservation ID:</strong> <span className="float-right">{reservationData.id}</span></p>
                                        <p className="text-sm text-gray-400"><strong>Room:</strong> <span className="float-right">{reservationData.roomDetails} ({reservationData.roomNumber})</span></p>
                                        <p className="text-sm text-gray-400"><strong>Total Paid:</strong> <span className="float-right">{formatCurrency(reservationData.totalPrice)}</span></p>
                                        <p className="text-sm text-gray-400 mt-2">You will receive a confirmation email shortly.</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => navigate(reservationData ? `/reservations/${reservationData.id}` : '/reservations')}
                                    className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-[#aa8453] hover:bg-[#d5a464] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#aa8453]"
                                >
                                    View My Reservation
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default PaymentCallback;