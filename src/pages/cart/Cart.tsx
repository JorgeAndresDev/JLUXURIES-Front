import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/common/ConfirmModal';
import Notification from '../../components/common/Notification';
import type { NotificationType } from '../../components/common/Notification';

const Cart = () => {
  const { cart, total, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: async () => { },
    isDanger: false,
  });

  // Notification state
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success' as NotificationType,
    title: '',
    message: '',
  });

  // Show confirmation modal for removing single item
  const handleRemoveItem = (productId: number, productName: string) => {
    setModalConfig({
      title: '¿Eliminar producto?',
      message: `¿Estás seguro de que deseas eliminar "${productName}" del carrito?`,
      onConfirm: async () => {
        try {
          await removeFromCart(productId);
          showNotification('success', 'Producto eliminado', 'El producto ha sido eliminado del carrito exitosamente.');
        } catch (error) {
          showNotification('error', 'Error', 'No se pudo eliminar el producto del carrito.');
          console.error('Error removing item:', error);
        }
      },
      isDanger: true,
    });
    setIsModalOpen(true);
  };

  // Show confirmation modal for clearing cart
  const handleClearCart = () => {
    setModalConfig({
      title: '¿Vaciar carrito?',
      message: '¿Estás seguro de que deseas eliminar todos los productos del carrito? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          await clearCart();
          showNotification('success', 'Carrito vaciado', 'Todos los productos han sido eliminados del carrito.');
        } catch (error) {
          showNotification('error', 'Error', 'No se pudo vaciar el carrito.');
          console.error('Error clearing cart:', error);
        }
      },
      isDanger: true,
    });
    setIsModalOpen(true);
  };

  // Show notification
  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold text-white mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-400 mb-8">Parece que aún no has agregado nada.</p>
          <Link to="/products" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-150">
            Explorar Colección
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-20 pb-12">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Tu Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#1E6BFF]/50 hover:bg-white/10 transition-all duration-150 cursor-pointer group"
              onClick={() => navigate(`/product/${item.id_producto}`)}
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="h-20 w-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-[#1E6BFF]/30 transition-colors">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.ProductsName || "Product"}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-150"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#1E6BFF] transition-colors">
                    {item.ProductsName || `Producto #${item.id_producto}`}
                  </h3>
                  {item.categoria && (
                    <p className="text-xs text-purple-400 mb-1">{item.categoria}</p>
                  )}
                  <p className="text-gray-400 text-sm">Cantidad: <span className="text-white font-medium">{item.cantidad}</span></p>
                  <p className="text-[#1E6BFF] font-bold text-base mt-1">${item.precio_unitario.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(item.id_producto, item.ProductsName || `Producto #${item.id_producto}`);
                }}
                className="text-gray-400 hover:text-red-400 p-2 rounded-full hover:bg-red-400/10 transition-all duration-150 self-end sm:self-center"
                title="Eliminar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              onClick={handleClearCart}
              className="w-full mt-4 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-medium py-3 rounded-xl transition-all text-sm"
            >
              Vaciar Carrito
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDanger={modalConfig.isDanger}
      />

      {/* Notification */}
      <Notification
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
};

export default Cart;
