import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/JLogo.png';
import ThemeToggle from '../common/ThemeToggle';
import { buttonClass } from '../ui/buttonStyles';

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
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/85 backdrop-blur-md transition-colors dark:border-white/10 dark:bg-slate-950/80">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand (prominent) */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="JLUXURIES" className="h-20 w-auto" />
            </Link>
          </div>

          {/* Desktop compact nav with icons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-600 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2L2 9h2v7h4v-4h4v4h4V9h2L10 2z" /></svg>
              <span className="hidden sm:inline text-sm">Inicio</span>
            </Link>

            <Link to="/products" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-600 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h3v3H4v-2zM9 3h3v3H9V3zm7 0h1a1 1 0 011 1v3h-4V3zM3 9h3v3H3V9zm6 0h3v3H9V9zm6 0h1v3h-4V9zM3 15h3v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM9 15h3v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2zm6 0h1a1 1 0 001-1v-2h-3v3z" /></svg>
              <span className="hidden sm:inline text-sm">Colección</span>
            </Link>

            <Link to="/cart" className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-600 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">
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
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{user?.nombre?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}</div>
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.12 }} className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white py-1 shadow-lift dark:border-white/10 dark:bg-slate-900">
                      {user?.role === 'admin' && (<Link to="/admin" className="block px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5" onClick={() => setIsUserMenuOpen(false)}>Admin</Link>)}
                      {user?.role === 'admin' && (<Link to="/admin/envios" className="block px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5" onClick={() => setIsUserMenuOpen(false)}>Envíos</Link>)}
                      <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5" onClick={() => setIsUserMenuOpen(false)}>Perfil</Link>
                      <div className="my-1 border-t border-slate-100 dark:border-white/10"></div>
                      <button onClick={() => { setIsUserMenuOpen(false); handleLogout(); }} className="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-white/5">Cerrar Sesión</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className={buttonClass('primary', 'sm', 'ml-2')}>Iniciar Sesión</Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <span className="sr-only">{isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
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
            <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="fixed inset-0 z-40 bg-slate-950/40" onClick={() => setIsMenuOpen(false)} />

            <motion.div id="mobile-menu" key="panel" initial="hidden" animate="visible" exit="exit" variants={mobilePanelVariants} className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 md:hidden">
              <div className="px-4 pt-6 pb-6">
                <motion.nav aria-label="Mobile" initial="hidden" animate="visible" exit="hidden">
                  <motion.div variants={itemVariants}>
                    <Link ref={mobileFirstLinkRef} to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 text-lg font-semibold text-slate-900 dark:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2L2 9h2v7h4v-4h4v4h4V9h2L10 2z" /></svg>
                      <span>Inicio</span>
                    </Link>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Link to="/products" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 text-lg text-slate-700 dark:text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-300" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h3v3H4v-2zM9 3h3v3H9V3zm7 0h1a1 1 0 011 1v3h-4V3zM3 9h3v3H3V9zm6 0h3v3H9V9zm6 0h1v3h-4V9zM3 15h3v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM9 15h3v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2zm6 0h1a1 1 0 001-1v-2h-3v3z" /></svg>
                      <span>Colección</span>
                    </Link>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="relative flex items-center gap-3 py-3 text-lg text-slate-700 dark:text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6h15l-1.5 9h-11z" /><circle cx="9" cy="20" r="1" /><circle cx="19" cy="20" r="1" /></svg>
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
                          <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 text-lg text-slate-700 dark:text-slate-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-300" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a2 2 0 012-2h10a2 2 0 012 2v2h-2V4H5v12h6v2H5a2 2 0 01-2-2V4z" /></svg>
                            <span>Admin</span>
                          </Link>
                        </motion.div>
                      )}
                      {user?.role === 'admin' && (
                        <motion.div variants={itemVariants}>
                          <Link to="/admin/envios" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 text-lg text-slate-700 dark:text-slate-300">
                            <Truck className="h-5 w-5 text-slate-500 dark:text-slate-300" />
                            <span>Envíos</span>
                          </Link>
                        </motion.div>
                      )}

                      <motion.div variants={itemVariants}>
                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 text-lg text-slate-700 dark:text-slate-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a4 4 0 110 8 4 4 0 010-8zm0 10a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          <span>Perfil</span>
                        </Link>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="flex w-full items-center gap-3 py-3 text-left text-red-600 dark:text-red-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path d="M3 10a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>
                          <span>Cerrar Sesión</span>
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div variants={itemVariants}>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 text-lg text-slate-700 dark:text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-300" viewBox="0 0 20 20" fill="currentColor"><path d="M3 8a4 4 0 014-4h6a4 4 0 014 4v6a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" /></svg>
                        <span>Iniciar Sesión</span>
                      </Link>
                    </motion.div>
                  )}

                  {/* Theme Toggle (Mobile) */}
                  <motion.div variants={itemVariants} className="mt-4 flex justify-center border-t border-slate-100 pt-4 dark:border-white/10">
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
