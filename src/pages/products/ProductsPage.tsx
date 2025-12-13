import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if product is out of stock
    if (product.Quantity <= 0) {
      setToast({ message: 'Producto agotado', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      // Get user from localStorage
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

      setToast({ message: '¡Producto agregado al carrito!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (error: any) {
      console.error("Error al agregar al carrito:", error);
      setToast({
        message: error.message || 'Error al agregar al carrito',
        type: 'error'
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
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

      <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Nuestra Colección</h1>

      {/* Optimized Grid - 4 columns on XL screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.idProducts}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#1E6BFF] hover:shadow-[0_0_20px_#1E6BFF30] hover:scale-[1.03] transition-all duration-150 group cursor-pointer"
            onClick={() => navigate(`/product/${product.idProducts}`)}
          >
            {/* Smaller Image Container */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image_url || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"}
                alt={product.ProductsName}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

              {/* Compact Category Badge */}
              <div className="absolute top-2 right-2 bg-purple-600/90 px-2.5 py-1 rounded-lg text-xs font-semibold text-white">
                {product.categoria}
              </div>

              {/* Compact Stock Indicator */}
              <div className={`absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-xs font-medium ${product.Quantity > 10
                ? 'bg-green-600/90 text-white'
                : product.Quantity > 0
                  ? 'bg-yellow-600/90 text-white'
                  : 'bg-red-600/90 text-white'
                }`}>
                {product.Quantity > 10
                  ? `${product.Quantity} disponibles`
                  : product.Quantity > 0
                    ? `¡Solo ${product.Quantity} ${product.Quantity === 1 ? 'queda' : 'quedan'}!`
                    : 'Agotado'}
              </div>
            </div>

            {/* Compact Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-[#1E6BFF] transition-colors line-clamp-1">
                {product.ProductsName}
              </h3>

              <p className="text-gray-400 text-xs mb-3 line-clamp-2 h-8">{product.Description}</p>

              {/* Compact Price & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Precio</p>
                  <span className="text-xl font-bold text-[#1E6BFF]">${product.Price.toLocaleString()}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={product.Quantity <= 0}
                  className={`bg-[#1E6BFF]/20 border border-[#1E6BFF]/30 text-[#1E6BFF] font-semibold py-2 px-3 rounded-lg transition-all duration-150 ${product.Quantity <= 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#1E6BFF] hover:text-white hover:border-[#1E6BFF]'
                    }`}
                  title={product.Quantity <= 0 ? 'Producto agotado' : 'Agregar al carrito'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
