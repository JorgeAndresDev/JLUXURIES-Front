import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { logout, isAuthenticated, user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 w-24 h-24">
            <a href="/">
              <img
                src="/src/assets/Jlogo.png"
                alt="Luxury 2"
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Inicio
              </Link>
              <Link to="/products" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Colección
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors relative">
                    Carrito
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>

                  {/* User Dropdown Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                      className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {user?.nombre?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span>{user?.nombre || 'Usuario'}</span>
                      <svg
                        className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-white/10 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                              Admin
                            </div>
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Perfil
                          </div>
                        </Link>
                        <div className="border-t border-white/10 my-1"></div>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            Cerrar Sesión
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" className="px-4 py-2 rounded-xl text-white font-semibold bg-blue-600/30 border border-blue-500/40 backdrop-blur-md shadow-lg hover:shadow-[0_0_18px_#1E6BFF] hover:bg-blue-600/40 hover:text-white hover:border-blue-400/60 transition-all duration-300">
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Inicio
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Colección
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Carrito ({cart.length})
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
