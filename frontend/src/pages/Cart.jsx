import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cartItems, updateCartQuantity, removeFromCart }) => {
    const navigate = useNavigate();

    const handleCheckout = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert("Please login to proceed to payment!");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/cart/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`, // Assuming you have a token for authentication
                },
                body: JSON.stringify(cartItems),
            });

            if (response.ok) {
                navigate('/payment');
            } else {
                alert('Failed to proceed to payment. Please try again.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('An error occurred while processing your checkout. Please try again later.');
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="cart-page container">
            <h2 className="text-center">Your Cart</h2>
            {cartItems.length === 0 ? (
                <p className="text-center">Your cart is empty</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="card my-3 p-3 d-flex align-items-center flex-row">
                            <img src={item.image} alt={item.name} className="cart-img me-3" />
                            <div>
                                <h5>{item.name}</h5>
                                <p>Price: ₹{item.price}</p>
                                <div className="d-flex align-items-center">
                                    <button className="btn btn-outline-danger btn-sm me-2" onClick={() => updateCartQuantity(item, item.quantity - 1)}>-</button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button className="btn btn-outline-success btn-sm me-2" onClick={() => updateCartQuantity(item, item.quantity + 1)}>+</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item)}>Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4">
                        <h4>Total: ₹{subtotal.toFixed(2)}</h4>
                        <button className="btn btn-primary w-100" onClick={handleCheckout}>Proceed to Payment</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;