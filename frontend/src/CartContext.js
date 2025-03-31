import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        const existingItem = cartItems.find(cartItem => cartItem.name === item.name);

        if (existingItem) {
            setCartItems(cartItems.map(cartItem =>
                cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            ));
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (item) => {
        setCartItems(cartItems.filter(cartItem => cartItem.name !== item.name));
    };

    const updateCartQuantity = (item, quantity) => {
        if (quantity <= 0) {
            removeFromCart(item);
        } else {
            setCartItems(cartItems.map(cartItem =>
                cartItem.name === item.name ? { ...cartItem, quantity } : cartItem
            ));
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartQuantity }}>
            {children}
        </CartContext.Provider>
    );
};