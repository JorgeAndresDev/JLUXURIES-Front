

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen w-full bg-gray-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-12">
                        <div className="h-32 w-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg ring-4 ring-white/10">
                            {user?.nombre ? user.nombre.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl font-bold text-white mb-2">{user?.nombre || 'Usuario'}</h1>
                            <p className="text-gray-400 text-lg mb-4">{user?.email}</p>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-200 text-sm font-semibold"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Información Personal
                            </h3>
                            <div className="bg-black/20 rounded-xl p-6 space-y-4 border border-white/5">
                                <div className="group">
                                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Nombre Completo</label>
                                    <div className="text-white font-medium">{user?.nombre || 'No registrado'}</div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Email</label>
                                    <div className="text-white font-medium">{user?.email}</div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Teléfono</label>
                                    <div className="text-white font-medium">{user?.telefono || 'No registrado'}</div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Dirección</label>
                                    <div className="text-white font-medium">{user?.direccion || 'No registrada'}</div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Rol</label>
                                    <div className="text-white font-medium">{user?.role || 'No registrado'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                                Productos en tu Carrito
                            </h3>
                            <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                                {cart.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="bg-white/5 p-4 rounded-full mb-4 inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-400">Tu carrito está vacío.</p>
                                        <button
                                            onClick={() => navigate('/products')}
                                            className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                        >
                                            Explorar productos &rarr;
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {cart.map((item) => (
                                            <div key={item.id_carrito} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    {item.product?.image_url && (
                                                        <img
                                                            src={item.product.image_url}
                                                            alt={item.product.ProductsName}
                                                            className="w-12 h-12 rounded-lg object-cover border border-white/10"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="text-white font-medium">{item.product?.ProductsName || `Producto #${item.id_producto}`}</p>
                                                        <p className="text-gray-400 text-sm">Cantidad: {item.cantidad}</p>
                                                    </div>
                                                </div>
                                                <span className="text-green-400 font-semibold">${(item.precio_unitario * item.cantidad).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        <div className="pt-3 border-t border-white/10">
                                            <button
                                                onClick={() => navigate('/cart')}
                                                className="w-full py-3.5 px-4 bg-blue-600/30 border border-blue-500/50 rounded-xl text-white font-semibold hover:shadow-[0_0_20px_#1E6BFF] transition-all duration-200 backdrop-blur-md"
                                            >
                                                Ver Carrito Completo
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
