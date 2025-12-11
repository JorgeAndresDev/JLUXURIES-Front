import { useState, useEffect, useCallback } from 'react';
import { getProducts, deleteProduct as deleteProductService } from '../services/Products';
import type { Product } from '../types';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getProducts();
            setProducts(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Error al cargar los productos");
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteProduct = useCallback(async (id: number) => {
        try {
            await deleteProductService(id);
            setProducts(prev => prev.filter(p => p.idProducts !== id));
            return true;
        } catch (err) {
            console.error("Error deleting product:", err);
            return false;
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        fetchProducts,
        deleteProduct
    };
};
