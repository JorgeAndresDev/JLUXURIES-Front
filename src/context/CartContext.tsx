import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import api from '../api/axios';
import type { CartItem } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'estado'>) => Promise<void>;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    loading: boolean;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { isAuthenticated } = useAuth();

    const fetchCart = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user.id_cliente) {
                    const response = await api.get(`/cart/get_cart/${user.id_cliente}`);
                    // Deduplicate items based on id_producto to fix the "adds 5" bug caused by potential backend join issues
                    const uniqueItems = Array.from(
                        new Map(response.data.map((item: CartItem) => [item.id_producto, item])).values()
                    ) as CartItem[];
                    console.log('🛒 Cart items from backend:', uniqueItems);
                    console.log('🛒 First item structure:', uniqueItems[0]);
                    console.log('🛒 All keys in first item:', Object.keys(uniqueItems[0]));
                    console.log('🛒 Full first item:', JSON.stringify(uniqueItems[0], null, 2));
                    setCart(uniqueItems);
                } else {
                    console.warn('User does not have id_cliente, cannot fetch cart');
                    setCart([]);
                }
            }
        } catch (error) {
            console.error("Error fetching cart", error);
            setCart([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    const addToCart = async (item: Omit<CartItem, 'estado'>) => {
        try {
            await api.post('/cart/register_cart', {
                ...item,
                estado: 'activo'
            });
            await fetchCart();
        } catch (error) {
            console.error("Error adding to cart", error);
            throw error;
        }
    };

    const removeFromCart = (productId: number) => {
        console.warn("Remove API not specified, implementing local filter only for UI");
        setCart(prev => prev.filter(item => item.id_producto !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const total = cart.reduce((acc, item) => acc + (item.precio_unitario * item.cantidad), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            loading,
            total
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
