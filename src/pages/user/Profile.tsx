

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

    // Calculate cart total
    const cartTotal = cart.reduce((acc, item) => acc + (item.precio_unitario * item.cantidad), 0);

    return (
        <div className="min-h-screen w-full bg-gray-950 text-white pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements - Optimized */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Compact Header */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Compact Avatar */}
                            <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg ring-2 ring-white/10">
                                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{user?.nombre || 'Usuario'}</h1>
                                <p className="text-gray-400 text-sm">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-5 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-150 text-sm font-semibold"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Card 1: Información Personal */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-xl">
                        <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Información Personal
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Nombre Completo</label>
                                <div className="text-white font-medium text-sm">{user?.nombre || 'No registrado'}</div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Email</label>
                                <div className="text-white font-medium text-sm break-all">{user?.email}</div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Rol</label>
                                <div className="inline-block px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 text-xs font-semibold">
                                    {user?.role || 'Cliente'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Contacto & Dirección */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-xl">
                        <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            Contacto & Ubicación
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Teléfono</label>
                                <div className="text-white font-medium text-sm">{user?.telefono || 'No registrado'}</div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Dirección</label>
                                <div className="text-white font-medium text-sm">{user?.direccion || 'No registrada'}</div>
                            </div>
                            {user?.role === 'admin' && (
                                <div className="pt-2">
                                    <button
                                        onClick={() => navigate(`/admin/edit-client/${user.id_cliente}`)}
                                        className="w-full py-2 px-4 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-600/30 transition-all duration-150 text-sm font-semibold"
                                    >
                                        Editar Información
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card 3: Carrito */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-xl">
                        <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                            Mi Carrito ({cart.length})
                        </h3>
                        {cart.length === 0 ? (
                            <div className="text-center py-6">
                                <div className="bg-white/5 p-3 rounded-full mb-3 inline-block">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-sm mb-3">Tu carrito está vacío</p>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                                >
                                    Explorar productos →
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {/* Show max 3 items */}
                                {cart.slice(0, 3).map((item) => (
                                    <div key={item.id_carrito} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                        {item.image_url && (
                                            <img
                                                src={item.image_url}
                                                alt={item.ProductsName || 'Producto'}
                                                className="w-10 h-10 rounded-lg object-cover border border-white/10"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium text-xs truncate">{item.ProductsName || `Producto #${item.id_producto}`}</p>
                                            <p className="text-gray-400 text-xs">Cant: {item.cantidad}</p>
                                        </div>
                                        <span className="text-blue-400 font-semibold text-xs">${item.precio_unitario.toLocaleString()}</span>
                                    </div>
                                ))}
                                {cart.length > 3 && (
                                    <p className="text-gray-400 text-xs text-center py-1">+{cart.length - 3} más</p>
                                )}
                                <div className="pt-2 border-t border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400 text-sm">Total:</span>
                                        <span className="text-white font-bold text-lg">${cartTotal.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate('/cart')}
                                        className="w-full py-2 px-4 bg-blue-600/30 border border-blue-500/50 rounded-lg text-white font-semibold hover:bg-blue-600/40 hover:shadow-[0_0_15px_#1E6BFF30] transition-all duration-150 text-sm"
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
    );
};

export default Profile;
