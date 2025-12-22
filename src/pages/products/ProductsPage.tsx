import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GlareHover from '../../components/common/GlareHover';

const ProductsPage = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.ProductsName.toLowerCase().includes(query) ||
      product.categoria.toLowerCase().includes(query) ||
      product.color.toLowerCase().includes(query) ||
      (product.Description && product.Description.toLowerCase().includes(query))
    );
  });

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

      <div className="mb-8">
        {/* Header Row - Title and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Nuestra Colección</h1>

          {/* Search Bar */}
          <div className="relative w-full md:w-auto md:min-w-[400px] lg:min-w-[500px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos por nombre, categoría, color..."
              className="w-full px-5 py-3 pl-12 bg-gray-100 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 dark:focus:border-[#1E6BFF] focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#1E6BFF]/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all shadow-sm dark:shadow-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        {searchQuery && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        )}
      </div>

      {/* Optimized Grid - 4 columns on XL screens */}
      {filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-gray-400 text-lg mb-2">No se encontraron productos</p>
          <p className="text-gray-500 text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <GlareHover
              key={product.idProducts}
              onClick={() => navigate(`/product/${product.idProducts}`, { state: { from: '/products' } })}
              className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden hover:border-blue-500 dark:hover:border-[#1E6BFF] hover:shadow-[0_0_20px_rgba(30,107,255,0.2)] dark:hover:shadow-[0_0_20px_#1E6BFF30] hover:scale-[1.03] transition-all duration-150 group/card cursor-pointer shadow-md dark:shadow-none"
              glareColor="#1E6BFF"
              glareOpacity={0.12}
              glareAngle={-30}
              glareSize={180}
              transitionDuration={700}
            >
              {/* Smaller Image Container */}
              <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={product.image_url || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"}
                  alt={product.ProductsName}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover/card:scale-110"
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
              <div className="p-4 bg-white dark:bg-transparent transition-colors">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 group-hover/card:text-blue-600 dark:group-hover/card:text-[#1E6BFF] transition-colors line-clamp-1">
                  {product.ProductsName}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2 h-8 leading-snug">{product.Description}</p>

                {/* Compact Price & Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Precio</p>
                    <span className="text-xl font-bold text-blue-600 dark:text-[#1E6BFF]">${product.Price.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.Quantity <= 0}
                    className={`bg-blue-50 dark:bg-[#1E6BFF]/20 border border-blue-200 dark:border-[#1E6BFF]/30 text-blue-600 dark:text-[#1E6BFF] font-semibold py-2 px-3 rounded-lg transition-all duration-150 group-hover/card:bg-blue-600 dark:group-hover/card:bg-[#1E6BFF] group-hover/card:text-white group-hover/card:border-blue-600 dark:group-hover/card:border-[#1E6BFF] ${product.Quantity <= 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-600 hover:text-white hover:border-blue-600'
                      }`}
                    title={product.Quantity <= 0 ? 'Producto agotado' : 'Agregar al carrito'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </button>
                </div>
              </div>
            </GlareHover>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
