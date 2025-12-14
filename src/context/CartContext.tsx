import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import api from '../api/axios';
import type { CartItem } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'estado'> & { productStock?: number }) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    loading: boolean;
    total: number;
    // <--- CORRECCIÓN TS6133 (Añadido al Type)
    getAvailableStock: (productId: number, productStock: number) => number; 
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

    // Helper function to get available stock for a product
    const getAvailableStock = (productId: number, productStock: number): number => {
        const itemInCart = cart.find(item => item.id_producto === productId);
        const quantityInCart = itemInCart?.cantidad || 0;
        return productStock - quantityInCart;
    }; // <-- Función que ahora será usada

    const addToCart = async (item: Omit<CartItem, 'estado'> & { productStock?: number }) => {
        try {
            // Extract productStock from item (passed from ProductsPage/Carousel)
            const { productStock, ...cartItem } = item;

            // Validate stock if provided
            if (productStock !== undefined) {
                // Check if product is out of stock
                if (productStock <= 0) {
                    throw new Error('Producto agotado');
                }

                // Check if user already has this product in cart
                const itemInCart = cart.find(i => i.id_producto === cartItem.id_producto);
                const currentQuantity = itemInCart?.cantidad || 0;

                // Check if adding would exceed available stock
                if (currentQuantity >= productStock) {
                    throw new Error(`Solo hay ${productStock} unidades disponibles y ya tienes ${currentQuantity} en el carrito`);
                }
            }

            await api.post('/cart/register_cart', {
                ...cartItem,
                estado: 'activo'
            });
            await fetchCart();
        } catch (error) {
            console.error("Error adding to cart", error);
            throw error;
        }
    };

    const removeFromCart = async (productId: number) => {
        try {
            // Find the cart item to get its id_carrito
            const cartItem = cart.find(item => item.id_producto === productId);
            if (!cartItem) {
                console.warn('Product not found in cart');
                return;
            }

            // Call backend API to delete the cart item
            await api.delete(`/cart/delete_cart/${cartItem.id_carrito}`);

            // Update local state after successful deletion
            setCart(prev => prev.filter(item => item.id_producto !== productId));
        } catch (error) {
            console.error("Error removing item from cart", error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            // Delete all cart items from backend
            const deletePromises = cart.map(item =>
                api.delete(`/cart/delete_cart/${item.id_carrito}`)
            );

            await Promise.all(deletePromises);

            // Clear local state after successful deletion
            setCart([]);
        } catch (error) {
            console.error("Error clearing cart", error);
            throw error;
        }
    };

    const total = cart.reduce((acc, item) => acc + (item.precio_unitario * item.cantidad), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            loading,
            total,
            getAvailableStock // <--- CORRECCIÓN TS6133 (Pasado en el value)
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
