import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getItem } from "../../services/Products";
import type { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchProduct();
        // Scroll to top when page loads or product changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await getItem(Number(id));
            setProduct(response.data);
        } catch (err: any) {
            console.error(err);
            setError("Error al cargar el producto");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!product) return;

        // Check if product is out of stock
        if (product.Quantity <= 0) {
            setToast({ message: 'Producto agotado', type: 'error' });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                setToast({ message: 'Error: No se encontró información del usuario', type: 'error' });
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            const user = JSON.parse(storedUser);
            if (!user.id_cliente) {
                setToast({ message: 'Error: Usuario sin ID de cliente', type: 'error' });
                return;
            }

            await addToCart({
                id_cliente: user.id_cliente,
                id_producto: product.idProducts,
                cantidad: 1,
                precio_unitario: product.Price,
                productStock: product.Quantity // Pass stock for validation
            });
            setToast({ message: '¡Producto agregado al carrito exitosamente!', type: 'success' });
            setTimeout(() => setToast(null), 3000);
        } catch (error: any) {
            console.error("Error al agregar al carrito:", error);
            setToast({
                message: error.message || 'Error al agregar al carrito. Intenta nuevamente.',
                type: 'error'
            });
            setTimeout(() => setToast(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-20 pb-8">
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E6BFF]"></div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 pt-20 pb-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl mb-6">
                        <p className="text-lg font-semibold">{error || "Producto no encontrado"}</p>
                    </div>
                    <Link
                        to="/admin/products"
                        className="inline-flex items-center gap-2 text-[#1E6BFF] hover:text-blue-400 font-semibold"
                    >
                        ← Volver a productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-16 pb-4">
            {/* Toast Notification */}
            {/* Toast Notification - Optimized */}
            {toast && (
                <div className="fixed top-20 right-4 z-50 animate-[slideIn_0.2s_ease-out]">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border ${toast.type === 'success'
                        ? 'bg-green-600/95 border-green-400/50 text-white'
                        : 'bg-red-600/95 border-red-400/50 text-white'
                        }`}>
                        {toast.type === 'success' ? (
                            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        <span className="font-medium text-sm">{toast.message}</span>
                        <button
                            onClick={() => setToast(null)}
                            className="ml-1 hover:opacity-80 transition-opacity"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                {/* Header - Más compacto */}
                <div className="mb-3">
                    <Link
                        to="/admin/products"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Volver a productos
                    </Link>
                    <h1 className="text-xl font-bold text-white tracking-tight mt-1">Detalles del Producto</h1>
                </div>

                {/* Two Cards Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                    {/* Card 1: Image */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden p-3 md:p-4">
                        <div className="flex items-center justify-center bg-black/20 rounded-xl border border-white/10 h-[280px] md:h-[400px]">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.ProductsName}
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">Sin imagen</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Information */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden p-4">
                        <div className="space-y-3">
                            {/* Product Name */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{product.ProductsName}</h2>
                                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                                    {product.categoria}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-3">
                                <p className="text-xs text-gray-400">Precio</p>
                                <p className="text-3xl font-bold text-green-400">${product.Price.toFixed(2)}</p>
                            </div>

                            {/* Stock, Color, and ID */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                                    <p className="text-xs text-gray-400 mb-1">Stock</p>
                                    <span
                                        className={`inline-block px-2 py-1 rounded text-xs font-bold ${product.Quantity > 10
                                            ? "bg-green-500/20 text-green-400"
                                            : product.Quantity > 0
                                                ? "bg-yellow-500/20 text-yellow-400"
                                                : "bg-red-500/20 text-red-400"
                                            }`}
                                    >
                                        {product.Quantity > 10
                                            ? `${product.Quantity} unidades`
                                            : product.Quantity > 0
                                                ? `¡Solo ${product.Quantity}!`
                                                : 'Agotado'}
                                    </span>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                                    <p className="text-xs text-gray-400 mb-1">Color</p>
                                    <p className="text-sm font-semibold text-white truncate">{product.color}</p>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                                    <p className="text-xs text-gray-400 mb-1">ID</p>
                                    <p className="text-sm font-mono text-gray-300">#{product.idProducts}</p>
                                </div>
                            </div>

                            {/* Description */}
                            {product.Description && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                    <p className="text-xs text-gray-400 mb-2">Descripción</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {product.Description}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-2 pt-2">
                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.Quantity <= 0}
                                    className={`w-full py-3 px-4 rounded-xl font-bold shadow-lg transform transition-all duration-150 flex items-center justify-center gap-2 ${product.Quantity <= 0
                                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-900/30 hover:scale-[1.02]'
                                        } text-white`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                    {product.Quantity <= 0 ? 'Agotado' : 'Agregar al Carrito'}
                                </button>

                                {/* Edit and Close Buttons - Admin only for Edit */}
                                <div className="flex gap-2">
                                    {user?.role === 'admin' && (
                                        <Link
                                            to={`/admin/edit-product/${product.idProducts}`}
                                            className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#1E6BFF] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/30 transform hover:scale-[1.02] transition-all text-center text-sm"
                                        >
                                            Editar
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => navigate(user?.role === 'admin' ? '/admin/products' : '/products')}
                                        className={`py-2.5 border border-white/10 hover:bg-white/5 text-white rounded-xl font-semibold transition-all text-sm ${user?.role === 'admin' ? 'px-4' : 'flex-1'
                                            }`}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
