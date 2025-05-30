import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OTPPage = ({ userEmail, onVerificationComplete, onBack }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      setError('Please paste only numbers');
      return;
    }

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:4005/api/v1/auth/users/verify-account', {
        verificationCode: otpString  // Updated to match backend
      });

      console.log('OTP verification successful:', response.data);
      setSuccess(true);

      setTimeout(() => {
        if (onVerificationComplete) {
          onVerificationComplete();
        } else {
          navigate('/login'); // fallback navigation
        }
      }, 2000);

    } catch (err) {
      console.error('OTP verification failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:4005/api/v1/auth/users/resend-otp', {
        email: userEmail
      });

      console.log('OTP resent successfully:', response.data);
      setOtp(['', '', '', '', '', '']);
      setError('');
      setSuccess(false);
      inputRefs.current[0]?.focus();
      alert('OTP resent successfully!');

    } catch (err) {
      console.error('Resend OTP failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccess(false);
    inputRefs.current[0]?.focus();
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#1b1b1b] flex items-center justify-center p-4">
        <div className="bg-black rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#aa8453] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#aa8453]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#aa8453] mb-2 font-serif">Verification Successful!</h2>
          <p className="text-gray-300 mb-6 font-serif">Your account has been verified successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1b1b1b] flex items-center justify-center p-4">
      <div className="bg-black rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#aa8453] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#aa8453]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#aa8453] mb-2 font-serif">Verify Your Account</h2>
          <p className="text-gray-300 font-serif">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-[#aa8453] font-medium">{userEmail}</p>
        </div>

        <div>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#aa8453] transition-colors ${
                  error ? 'border-red-500' : digit ? 'border-[#aa8453]' : 'border-gray-600'
                }`}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mb-4 bg-red-900 bg-opacity-20 py-2 px-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full bg-[#aa8453] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#d5a464] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors mb-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              'Verify OTP'
            )}
          </button>

          <div className="flex justify-between items-center text-sm mb-4">
            <button
              onClick={clearOtp}
              className="text-gray-400 hover:text-gray-200 transition-colors"
              disabled={isLoading}
            >
              Clear
            </button>
            <button
              onClick={handleResend}
              className="text-[#aa8453] hover:text-[#d5a464] transition-colors"
              disabled={isLoading}
            >
              Resend Code
            </button>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full text-gray-400 hover:text-gray-200 transition-colors text-sm"
              disabled={isLoading}
            >
              ← Back to Registration
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Didn't receive the code? Check your spam folder or try resending.
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
