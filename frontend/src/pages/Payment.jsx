import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = ({ completePayment = () => {} }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [upiId, setUpiId] = useState('');
    const navigate = useNavigate();

    const handlePayment = async (e) => {
        e.preventDefault();

        const paymentInfo = {
            method: paymentMethod,
            cardNumber,
            expiryDate,
            cvv,
            upiId
        };

        try {
            const response = await fetch('http://localhost:5000/api/payments/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentInfo),
            });

            if (response.ok) {
                const result = await response.json();
                completePayment(result);  // Call the completePayment function with the result
                alert("Payment Successful! Redirecting to Order Tracking...");
                navigate('/order'); // Redirect to order tracking page
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('An error occurred while processing the payment. Please try again later.');
        }
    };

    return (
        <div className="payment-page container">
            <h2 className="text-center mb-4">Payment</h2>
            <div className="payment-options mb-4">
                <button 
                    className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline-primary'} me-2`} 
                    onClick={() => setPaymentMethod('card')}
                >
                    Credit/Debit Card
                </button>
                <button 
                    className={`btn ${paymentMethod === 'upi' ? 'btn-primary' : 'btn-outline-primary'} me-2`} 
                    onClick={() => setPaymentMethod('upi')}
                >
                    UPI Payment
                </button>
                <button 
                    className={`btn ${paymentMethod === 'cod' ? 'btn-primary' : 'btn-outline-primary'}`} 
                    onClick={() => setPaymentMethod('cod')}
                >
                    Cash on Delivery
                </button>
            </div>

            {paymentMethod === 'card' && (
                <form onSubmit={handlePayment} className="payment-form card-form">
                    <div className="mb-3">
                        <label>Card Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Expiry Date</label>
                        <input
                            type="text"
                            className="form-control"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>CVV</label>
                        <input
                            type="text"
                            className="form-control"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100">Pay Now</button>
                </form>
            )}

            {paymentMethod === 'upi' && (
                <form onSubmit={handlePayment} className="payment-form upi-form">
                    <div className="mb-3">
                        <label>Enter UPI ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100">Pay via UPI</button>
                </form>
            )}

            {paymentMethod === 'cod' && (
                <div className="cod-info text-center mt-4">
                    <h5>Cash on Delivery Selected</h5>
                    <button onClick={handlePayment} className="btn btn-success w-100 mt-3">Confirm Order</button>
                </div>
            )}
        </div>
    );
};

export default Payment;