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
        id_cliente: user.id_cliente,  // ✅ Usar el ID del usuario logueado
        id_producto: product.idProducts,
        cantidad: 1,
        precio_unitario: product.Price
      });
      setToast({ message: '¡Producto agregado al carrito!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      setToast({ message: 'Error al agregar al carrito', type: 'error' });
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
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border ${toast.type === 'success'
            ? 'bg-green-600/90 border-green-400/50 text-white'
            : 'bg-red-600/90 border-red-400/50 text-white'
            }`}>
            {toast.type === 'success' ? (
              <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-semibold">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-80 transition-opacity"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Nuestra Colección</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.idProducts}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#1E6BFF] hover:shadow-[0_0_30px_#1E6BFF40] hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
            onClick={() => navigate(`/admin/product/${product.idProducts}`)}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={product.image_url || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"}
                alt={product.ProductsName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Category badge */}
              <div className="absolute top-3 right-3 bg-purple-600/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white border border-purple-400/30">
                {product.categoria}
              </div>

              {/* Stock indicator */}
              <div className={`absolute bottom-3 left-3 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium border ${product.Quantity > 10
                ? 'bg-green-600/80 text-white border-green-400/30'
                : product.Quantity > 0
                  ? 'bg-yellow-600/80 text-white border-yellow-400/30'
                  : 'bg-red-600/80 text-white border-red-400/30'
                }`}>
                {product.Quantity > 0 ? `${product.Quantity} disponibles` : 'Agotado'}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#1E6BFF] transition-colors">
                {product.ProductsName}
              </h3>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{product.Description}</p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Precio</p>
                  <span className="text-2xl font-bold text-[#1E6BFF]">${product.Price.toLocaleString()}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="bg-[#1E6BFF]/20 hover:bg-[#1E6BFF] text-[#1E6BFF] hover:text-white font-semibold py-2.5 px-5 rounded-xl transition-all border border-[#1E6BFF]/30 hover:border-[#1E6BFF] flex items-center gap-2 group/btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  <span className="hidden sm:inline">Agregar</span>
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
