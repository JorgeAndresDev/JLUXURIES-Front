import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const { logout, isAuthenticated, user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const mobileFirstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (isMenuOpen) {
      setTimeout(() => mobileFirstLinkRef.current?.focus(), 60);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const mobilePanelVariants = {
    hidden: { y: -18, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.06 } },
    exit: { y: -12, opacity: 0 },
  };

  const itemVariants = {
    hidden: { y: -6, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand (prominent) */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/src/assets/Jlogo.png" alt="Luxury 2" className="h-24 w-auto" />
            </Link>
          </div>

          {/* Desktop compact nav with icons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2L2 9h2v7h4v-4h4v4h4V9h2L10 2z" /></svg>
              <span className="hidden sm:inline text-sm">Inicio</span>
            </Link>

            <Link to="/products" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h3v3H4v-2zM9 3h3v3H9V3zm7 0h1a1 1 0 011 1v3h-4V3zM3 9h3v3H3V9zm6 0h3v3H9V9zm6 0h1v3h-4V9zM3 15h3v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM9 15h3v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2zm6 0h1a1 1 0 001-1v-2h-3v3z" /></svg>
              <span className="hidden sm:inline text-sm">Colección</span>
            </Link>

            <Link to="/cart" className="relative flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
              <span className="hidden sm:inline text-sm">Carrito</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cart.length}</span>
              )}
            </Link>

            {/* Theme Toggle (Desktop) */}
            <div className="hidden lg:block ml-2">
              <ThemeToggle />
            </div>

            {/* User or Login */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">{user?.nombre?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}</div>
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.12 }} className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50">
                      {user?.role === 'admin' && (<Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors" onClick={() => setIsUserMenuOpen(false)}>Admin</Link>)}
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors" onClick={() => setIsUserMenuOpen(false)}>Perfil</Link>
                      <div className="border-t border-gray-100 dark:border-white/10 my-1"></div>
                      <button onClick={() => { setIsUserMenuOpen(false); handleLogout(); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-white/5 transition-colors">Cerrar Sesión</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="ml-2 px-4 py-2 rounded-xl text-white font-semibold bg-blue-600 dark:bg-blue-600/30 border border-blue-600 dark:border-blue-500/40 backdrop-blur-md shadow-md dark:shadow-lg hover:shadow-lg hover:bg-blue-700 dark:hover:shadow-[0_0_18px_#1E6BFF] dark:hover:bg-blue-600/40 dark:hover:text-white dark:hover:border-blue-400/60 transition-all duration-300">Iniciar Sesión</Link>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
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

      {/* Mobile Menu (slide-over) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setIsMenuOpen(false)} />

            <motion.div id="mobile-menu" key="panel" initial="hidden" animate="visible" exit="exit" variants={mobilePanelVariants} className="md:hidden fixed top-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 z-50 transition-colors duration-300">
              <div className="px-4 pt-6 pb-6">
                <motion.nav aria-label="Mobile" initial="hidden" animate="visible" exit="hidden">
                  <motion.div variants={itemVariants}>
                    <Link ref={mobileFirstLinkRef} to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-800 dark:text-white text-lg font-semibold py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2L2 9h2v7h4v-4h4v4h4V9h2L10 2z" /></svg>
                      <span>Inicio</span>
                    </Link>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Link to="/products" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-lg py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h3v3H4v-2zM9 3h3v3H9V3zm7 0h1a1 1 0 011 1v3h-4V3zM3 9h3v3H3V9zm6 0h3v3H9V9zm6 0h1v3h-4V9zM3 15h3v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM9 15h3v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2zm6 0h1a1 1 0 001-1v-2h-3v3z" /></svg>
                      <span>Colección</span>
                    </Link>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="relative flex items-center gap-3 text-gray-700 dark:text-gray-300 text-lg py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6h15l-1.5 9h-11z" /><circle cx="9" cy="20" r="1" /><circle cx="19" cy="20" r="1" /></svg>
                      <span>Carrito</span>
                      {cart.length > 0 && (
                        <span className="ml-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cart.length}</span>
                      )}
                    </Link>
                  </motion.div>

                  {isAuthenticated ? (
                    <>
                      {user?.role === 'admin' && (
                        <motion.div variants={itemVariants}>
                          <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-lg py-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a2 2 0 012-2h10a2 2 0 012 2v2h-2V4H5v12h6v2H5a2 2 0 01-2-2V4z" /></svg>
                            <span>Admin</span>
                          </Link>
                        </motion.div>
                      )}

                      <motion.div variants={itemVariants}>
                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-lg py-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a4 4 0 110 8 4 4 0 010-8zm0 10a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          <span>Perfil</span>
                        </Link>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="w-full text-left flex items-center gap-3 text-red-400 block py-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path d="M3 10a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>
                          <span>Cerrar Sesión</span>
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div variants={itemVariants}>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-lg py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M3 8a4 4 0 014-4h6a4 4 0 014 4v6a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" /></svg>
                        <span>Iniciar Sesión</span>
                      </Link>
                    </motion.div>
                  )}

                  {/* Theme Toggle (Mobile) */}
                  <motion.div variants={itemVariants} className="pt-4 mt-4 border-t border-white/10 flex justify-center">
                    <ThemeToggle />
                  </motion.div>
                </motion.nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
