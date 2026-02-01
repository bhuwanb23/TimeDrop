import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';
import { Alert } from 'react-native';

// Action types
const actionTypes = {
    SET_CART_ITEMS: 'SET_CART_ITEMS',
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_CART_TOTALS: 'SET_CART_TOTALS',
};

// Initial state
const initialState = {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    loading: false,
    error: null,
};

// Cart reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_CART_ITEMS:
            const items = action.payload || [];
            const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return {
                ...state,
                items,
                totalItems,
                totalAmount,
                loading: false,
                error: null,
            };

        case actionTypes.ADD_ITEM:
            const newItem = action.payload;
            const existingItemIndex = state.items.findIndex(item => item.productId === newItem.productId);

            let updatedItems;
            if (existingItemIndex >= 0) {
                // If item already exists, update the quantity
                updatedItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            } else {
                // Add new item
                updatedItems = [...state.items, newItem];
            }

            const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const newTotalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return {
                ...state,
                items: updatedItems,
                totalItems: newTotalItems,
                totalAmount: newTotalAmount,
                loading: false,
                error: null,
            };

        case actionTypes.REMOVE_ITEM:
            const productIdToRemove = action.payload;
            const filteredItems = state.items.filter(item => item.productId !== productIdToRemove);

            const remainingTotalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
            const remainingTotalAmount = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return {
                ...state,
                items: filteredItems,
                totalItems: remainingTotalItems,
                totalAmount: remainingTotalAmount,
                loading: false,
                error: null,
            };

        case actionTypes.UPDATE_QUANTITY:
            const { productId, quantity } = action.payload;
            if (quantity <= 0) {
                // If quantity is 0 or less, remove the item
                return cartReducer(state, { type: actionTypes.REMOVE_ITEM, payload: productId });
            }

            const updatedQuantities = state.items.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            );

            const updatedTotalItems = updatedQuantities.reduce((sum, item) => sum + item.quantity, 0);
            const updatedTotalAmount = updatedQuantities.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            return {
                ...state,
                items: updatedQuantities,
                totalItems: updatedTotalItems,
                totalAmount: updatedTotalAmount,
                loading: false,
                error: null,
            };

        case actionTypes.CLEAR_CART:
            return {
                ...state,
                items: [],
                totalItems: 0,
                totalAmount: 0,
                loading: false,
                error: null,
            };

        case actionTypes.SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };

        case actionTypes.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        case actionTypes.SET_CART_TOTALS:
            return {
                ...state,
                totalItems: action.payload.totalItems,
                totalAmount: action.payload.totalAmount,
            };

        default:
            return state;
    }
};

// Cart Context
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from AsyncStorage on initial render
    useEffect(() => {
        loadCartFromStorage();
    }, []);

    // Save cart to storage whenever items change
    useEffect(() => {
        saveCartToStorage();
    }, [state.items]);

    // Load cart from AsyncStorage
    const loadCartFromStorage = async () => {
        try {
            const cartData = await AsyncStorage.getItem('cart');
            if (cartData) {
                const parsedCart = JSON.parse(cartData);
                dispatch({ type: actionTypes.SET_CART_ITEMS, payload: parsedCart });
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
        }
    };

    // Save cart to AsyncStorage
    const saveCartToStorage = async () => {
        try {
            await AsyncStorage.setItem('cart', JSON.stringify(state.items));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    };

    // Add item to cart
    const addItem = async (product, quantity = 1) => {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        try {
            // Validate stock availability if product has stock info
            if (product.stock_quantity !== undefined && product.stock_quantity < quantity) {
                throw new Error(`Only ${product.stock_quantity} items available in stock`);
            }

            const cartItem = {
                productId: product.id || product._id,
                product: product,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image || product.image_url,
                quantity: quantity,
                size: product.size || 'N/A',  // Default to 'N/A' if not provided
                color: product.color || 'N/A', // Default to 'N/A' if not provided
            };

            dispatch({ type: actionTypes.ADD_ITEM, payload: cartItem });
        } catch (error) {
            dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
            throw error;
        }
    };

    // Remove item from cart
    const removeItem = (productId) => {
        dispatch({ type: actionTypes.REMOVE_ITEM, payload: productId });
    };

    // Update item quantity
    const updateQuantity = (productId, quantity) => {
        dispatch({
            type: actionTypes.UPDATE_QUANTITY,
            payload: { productId, quantity }
        });
    };

    // Clear entire cart
    const clearCart = () => {
        dispatch({ type: actionTypes.CLEAR_CART });
    };

    // Get cart total
    const getCartTotal = () => {
        return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    // Get cart item count
    const getCartItemCount = () => {
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
    };

    // Sync cart with backend (if user is logged in)
    const syncCartWithBackend = async () => {
        try {
            // Check if user is authenticated
            const token = await apiService.getAuthToken();
            if (!token) {
                // If not logged in, just use local storage
                return;
            }

            dispatch({ type: actionTypes.SET_LOADING, payload: true });

            // For now, we'll just log that we would sync with backend
            // In a real implementation, you would call backend endpoints
            console.log('Would sync cart with backend:', state.items);

            // Example of how you might sync with backend:
            // await apiService.cart.updateCart(state.items);

        } catch (error) {
            dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
            console.error('Error syncing cart with backend:', error);
        } finally {
            dispatch({ type: actionTypes.SET_LOADING, payload: false });
        }
    };

    // Context value
    const value = {
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        syncCartWithBackend,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};