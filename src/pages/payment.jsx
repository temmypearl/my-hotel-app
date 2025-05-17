import React, { useState } from "react";
import { CreditCard, Lock, ChevronRight } from "lucide-react";

const Payment = ({ reservationDetails, selectedRooms }) => {
  const [paymentData, setPaymentData] = useState({
    email: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    // Format card number with spaces every 4 digits
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const validateCardNumber = (number) => {
    // Basic Luhn algorithm for card number validation
    const cleanNumber = number.replace(/\s/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return (sum % 10) === 0;
  };

  // const validateEmail = (email) => {
  //   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   return re.test(String(email).toLowerCase());
  // };

  const handleDirectPayment = (e) => {
    e.preventDefault();
    
    // Validation checks
    const isCardValid = validateCardNumber(paymentData.cardNumber);
    const isEmailValid = validateEmail(paymentData.email);
    
    if (!isCardValid) {
      alert('Invalid card number. Please check and try again.');
      return;
    }

    if (!isEmailValid) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    // Normally here you would send the card details to your backend
    // which would make a charge request to Paystack
    // For demo purposes, we'll simulate a successful payment after a delay
    setTimeout(() => {
      setIsLoading(false);
      alert('Payment successful! Your booking has been confirmed.');
    }, 2000);
  };

  const handlePaystackPayment = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(paymentData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      // Make a request to your backend to initialize payment
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: paymentData.email,
          amount: totalAmount * 100, // amount in kobo
          metadata: {
            guest_name: reservationDetails?.name || 'Guest',
            room_selection: roomSummary,
            nights: nights
          }
        }),
      });
      
      const data = await response.json();
      
      if (data.status && data.data && data.data.authorization_url) {
        // Redirect to Paystack checkout page
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error(data.message || 'Could not initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleFlutterwavePayment = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(paymentData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      // Make a request to your backend to initialize payment
      const response = await fetch('/api/payment/flutterwave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: paymentData.email,
          amount: totalAmount,
          name: reservationDetails?.name || 'Guest',
          description: roomSummary,
          redirect_url: window.location.origin + '/payment/confirm'
        }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data && data.data.link) {
        // Redirect to Flutterwave checkout page
        window.location.href = data.data.link;
      } else {
        throw new Error(data.message || 'Could not initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed. Please try again later.');
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Extract booking details
  const { roomCounts = {}, totalAmount = 0, nights = 1 } = selectedRooms || {};
  
  // Room name mapping for display
  const roomTypes = {
    junior: 'Junior Suite',
    double: 'Double Suite',
    deluxe: 'Deluxe Room',
    family: 'Family Room',
    superior: 'Superior Room'
  };

  // Create summary of selected rooms
  const roomSummary = Object.entries(roomCounts)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => `${count} ${roomTypes[type] || type.charAt(0).toUpperCase() + type.slice(1)}${count > 1 ? 's' : ''}`)
    .join(', ');

  return (
    <div className="p-6 rounded min-h-screen flex items-center justify-center bg-[#1b1b1b]"> 
      <div className="bg-white shadow-2xl rounded-xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center text-[#aa8453]">
          <CreditCard className="mr-2" /> Payment Details
        </h2>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-2">Booking Summary</h3>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Guest:</span> {reservationDetails?.name || 'Guest'}</p>
            <p>
              <span className="font-medium">Check-in:</span> {reservationDetails?.checkIn ? new Date(reservationDetails.checkIn).toLocaleDateString() : 'Not specified'}
            </p>
            <p>
              <span className="font-medium">Check-out:</span> {reservationDetails?.checkOut ? new Date(reservationDetails.checkOut).toLocaleDateString() : 'Not specified'}
            </p>
            <p><span className="font-medium">Stay Duration:</span> {nights} {nights === 1 ? 'Night' : 'Nights'}</p>
            <p><span className="font-medium">Room Selection:</span> {roomSummary}</p>
            {totalAmount > 0 && (
              <p className="font-medium text-[#aa8453] mt-2 text-lg">
                Total Amount: {formatCurrency(totalAmount)}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <label className="flex items-center">
            <input 
              className="mr-2" 
              type="radio" 
              name="paymentMethod" 
              value="paystack" 
              checked={paymentMethod === 'paystack'}
              onChange={() => setPaymentMethod('paystack')}
            />
            Paystack
          </label>
          <label className="flex items-center">
            <input 
              className="mr-2" 
              type="radio" 
              name="paymentMethod" 
              value="flutterwave"
              checked={paymentMethod === 'flutterwave'}
              onChange={() => setPaymentMethod('flutterwave')}
            />
            Flutterwave
          </label>
          <label className="flex items-center">
            <input 
              className="mr-2" 
              type="radio" 
              name="paymentMethod" 
              value="direct"
              checked={paymentMethod === 'direct'}
              onChange={() => setPaymentMethod('direct')}
            />
            Direct Card
          </label>
        </div>
        
        {paymentMethod === 'direct' ? (
          <form className="space-y-4" onSubmit={handleDirectPayment}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={paymentData.email}
                onChange={handlePaymentChange}
                required 
                placeholder="youremail@example.com" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Name on Card</label>
              <input 
                type="text" 
                id="cardName"
                name="cardName"
                value={paymentData.cardName}
                onChange={handlePaymentChange}
                required 
                placeholder="John Doe" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
              <input 
                type="text" 
                id="cardNumber"
                name="cardNumber"
                value={formatCardNumber(paymentData.cardNumber)}
                onChange={(e) => {
                  const formattedValue = e.target.value.replace(/[^\d\s]/g, '');
                  setPaymentData(prev => ({...prev, cardNumber: formattedValue}));
                }}
                maxLength="19"
                required 
                placeholder="1234 5678 9012 2346"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input 
                  type="text" 
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={(e) => {
                    // Auto-format expiry date
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 2) {
                      value = `${value.slice(0,2)}/${value.slice(2,4)}`;
                    }
                    setPaymentData(prev => ({...prev, expiryDate: value}));
                  }}
                  maxLength="5"
                  required 
                  placeholder="MM/YY" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" 
                />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                <input 
                  type="text" 
                  id="cvv"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={(e) => {
                    // Limit to 3-4 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0,4);
                    setPaymentData(prev => ({...prev, cvv: value}));
                  }}
                  maxLength="4"
                  required 
                  placeholder="123" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full flex justify-center items-center bg-[#aa8453] hover:bg-[#9a7648] text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#aa8453] mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" /> Pay {formatCurrency(totalAmount)}
                </>
              )}
            </button>
          </form>
        ) : paymentMethod === 'paystack' ? (
          <form className="space-y-4" onSubmit={handlePaystackPayment}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={paymentData.email}
                onChange={handlePaymentChange}
                required 
                placeholder="youremail@example.com" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-4">
                Click the button below to pay securely with Paystack. You will be redirected to Paystack's secure payment page.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-[#0ab259] hover:bg-[#08a050] text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0ab259]"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    Pay with Paystack {formatCurrency(totalAmount)} <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleFlutterwavePayment}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={paymentData.email}
                onChange={handlePaymentChange}
                required 
                placeholder="youremail@example.com" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-4">
                Click the button below to pay securely with Flutterwave. You will be redirected to Flutterwave's secure payment page.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-[#f5a623] hover:bg-[#e09612] text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f5a623]"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    Pay with Flutterwave {formatCurrency(totalAmount)} <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
          <Lock className="mr-1 h-3 w-3" /> 
          Your payment information is secure and encrypted
        </div>
      </div>
    </div>
  );
};

export default Payment;