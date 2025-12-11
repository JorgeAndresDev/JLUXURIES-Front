
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, total, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-white mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-400 mb-8">Parece que aún no has agregado nada.</p>
          <Link to="/products" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Explorar Colección
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-4xl font-bold text-white mb-10 tracking-tight">Tu Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-[#1E6BFF]/50 hover:bg-white/10 transition-all cursor-pointer group"
              onClick={() => navigate(`/admin/product/${item.id_producto}`)}
            >
              <div className="flex items-center space-x-6 w-full sm:w-auto">
                <div className="h-24 w-24 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-[#1E6BFF]/30 transition-colors">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.ProductsName || "Product"}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#1E6BFF] transition-colors">
                    {item.ProductsName || `Producto #${item.id_producto}`}
                  </h3>
                  {item.categoria && (
                    <p className="text-xs text-purple-400 mb-1">{item.categoria}</p>
                  )}
                  <p className="text-gray-400 text-sm">Cantidad: <span className="text-white font-medium">{item.cantidad}</span></p>
                  <p className="text-[#1E6BFF] font-bold text-lg mt-1">${item.precio_unitario.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCart(item.id_producto);
                }}
                className="text-gray-400 hover:text-red-400 p-2 rounded-full hover:bg-red-400/10 transition-all self-end sm:self-center"
                title="Eliminar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 sticky top-24">
            <h3 className="text-2xl font-bold text-white mb-6">Resumen del Pedido</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span className="font-medium">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Envío</span>
                <span className="text-green-400 font-medium">Gratis</span>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-gray-300">Total</span>
                <span className="text-3xl font-bold text-white">${total.toLocaleString()}</span>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-[#1E6BFF] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/30 transform hover:scale-[1.02]">
              Proceder al Pago
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-4 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-medium py-3 rounded-xl transition-all text-sm"
            >
              Vaciar Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
