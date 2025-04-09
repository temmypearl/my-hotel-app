import React, { useState } from "react";
import { CreditCard, Lock } from "lucide-react";

const Payment = ({ reservationDetails, selectedRooms }) => {
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingZip: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('credit');

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

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    
    // Validation checks
    const isCardValid = validateCardNumber(paymentData.cardNumber);
    
    if (!isCardValid) {
      alert('Invalid card number. Please check and try again.');
      return;
    }

    // Here would be the integration with a payment gateway
    alert('Payment successful! Your booking has been confirmed.');
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
            <input className="mr-2" type="radio" name="paymentMethod" value="credit" checked={paymentMethod === 'credit'}
              onChange={() => setPaymentMethod('credit')}/>
            Credit Card
          </label>
          <label className="flex items-center">
            <input className="mr-2" type="radio" name="paymentMethod" value="paypal"  onChange={() => setPaymentMethod('paypal')}/>
            PayPal
          </label>
        </div>
        
        {paymentMethod === 'credit' ? (
          <form className="space-y-4" onSubmit={handleSubmitPayment}>
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
            <div>
              <label htmlFor="billingZip" className="block text-sm font-medium text-gray-700">Billing Zip Code</label>
              <input 
                type="text" 
                id="billingZip"
                name="billingZip"
                value={paymentData.billingZip}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0,5);
                  setPaymentData(prev => ({...prev, billingZip: value}));
                }}
                maxLength="5"
                required 
                placeholder="12345" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full flex justify-center items-center bg-[#aa8453] hover:bg-[#9a7648] text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#aa8453] mt-6"
            >
              <Lock className="mr-2 h-4 w-4" /> Pay 
            </button>
          </form>
        ) : (
          <div className="mt-6 text-center">
            <p className="mb-4">You will be redirected to PayPal to complete your payment of {formatCurrency(totalAmount)}.</p>
            <button
              onClick={() => alert('Redirecting to PayPal...')}
              className="flex justify-center items-center mx-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue to PayPal
            </button>
          </div>
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