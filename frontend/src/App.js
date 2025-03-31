import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import Mainpage from './pages/Mainpage';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import OrderTracking from './pages/Order';
import AdminDashboard from './pages/Admin';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './index.css';

const App = () => {
    const [cartItems, setCartItems] = useState([]);

    // Load Cart from Local Storage
    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem('token'); // Assuming you have a token for authentication
            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/cart', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setCartItems(data);
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                }
            }
        };

        fetchCart();
    }, []);

    // Cart Functions
    const addToCart = async (item) => {
        const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            const updatedCart = cartItems.map(cartItem =>
                cartItem.name === item.name ? 
                { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            );
            setCartItems(updatedCart);
            await updateCartInBackend(updatedCart);
        } else {
            const newCart = [...cartItems, { ...item, quantity: 1 }];
            setCartItems(newCart);
            await updateCartInBackend(newCart);
        }
    };

    const removeFromCart = async (item) => {
        const updatedCart = cartItems.filter(cartItem => cartItem.name !== item.name);
        setCartItems(updatedCart);
        await updateCartInBackend(updatedCart);
    };

    const updateCartQuantity = async (item, quantity) => {
        if (quantity <= 0) {
            await removeFromCart(item);
        } else {
            const updatedCart = cartItems.map(cartItem =>
                cartItem.name === item.name ? { ...cartItem, quantity } : cartItem
            );
            setCartItems(updatedCart);
            await updateCartInBackend(updatedCart);
        }
    };

    const updateCartInBackend = async (cart) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await fetch('http://localhost:5000/api/cart', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(cart),
                });
            } catch (error) {
                console.error('Error updating cart in backend:', error);
            }
        }
    };

    // Order Placement
    const placeOrder = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return false;
        }

        const storedUser  = JSON.parse(localStorage.getItem('user'));
        if (!storedUser ?.email) {
            alert("User  not found! Please log in.");
            return false;
        }

        const newOrder = {
            items: cartItems.map(item => ({
                ...item,
                id: item.id || Date.now()
            })),
            total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
            deliveryAddress: storedUser .address || "Not Provided",
            estimatedDelivery: "Less Than 4 Hours",
            status: 0,
            userEmail: storedUser .email,
            createdAt: new Date().toISOString()
        };

        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newOrder),
            });

            setCartItems([]);
            return true;
        } catch (error) {
            console.error('Error placing order:', error);
            return false;
        }
    };

        // Layout for routes with navbar and footer
        const LayoutWithNavFooter = () => (
            <>
                <Navbar />
                <Outlet />
                <Footer />
            </>
        );
    
        return (
            <Router>
                <Routes>
                    {/* Mainpage without navbar/footer */}
                    <Route path="/" element={<Mainpage />} />
                    
                    {/* All other routes with navbar/footer */}
                    <Route element={<LayoutWithNavFooter />}>
                        <Route path="/homepage" element={<Homepage />} />
                        <Route path="/menu" element={<Menu addToCart={addToCart} />} />
                        <Route 
                            path="/cart" 
                            element={<Cart 
                                cartItems={cartItems}
                                removeFromCart={removeFromCart}
                                updateCartQuantity={updateCartQuantity}
                            />} 
                        />
                        <Route path="/payment" element={<Payment completePayment={placeOrder} />} />
                        <Route path="/order" element={<OrderTracking />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                    </Route>
                </Routes>
            </Router>
        );
    };
    
    export default App;