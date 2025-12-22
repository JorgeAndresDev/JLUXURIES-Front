import logo from '../../assets/Logo.png';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RotatingText from '../common/RotatingText';

export default function Hero() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleScrollToCarousel = () => {
    const carousel = document.getElementById('productos-carousel');
    if (carousel) {
      carousel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden transition-colors duration-300">

      {/* Efecto Neon de Fondo (Visible only in dark mode or adapted) */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 dark:from-blue-600/10 via-transparent to-white dark:to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[160px] bg-blue-400/20 dark:bg-blue-600/30" />

      {/* Contenido */}
      <div className="relative text-center px-4 max-w-3xl">

        <img
          src={logo}
          alt="JLUXURIES"
          className="w-28 md:w-40 mx-auto mb-4 md:mb-6 drop-shadow-[0_0_15px_rgba(30,107,255,0.5)]"
        />

        <h1 className="text-3xl md:text-6xl font-bold text-gray-900 dark:text-white drop-shadow-[0_0_20px_rgba(30,107,255,0.3)] dark:drop-shadow-[0_0_20px_#1E6BFF]">Rueda con estilo</h1>

        <p className="text-gray-600 dark:text-gray-300 text-base md:text-xl mt-3 md:mt-4 px-4">
          Accesorios premium para motos con un toque urbano, moderno y lleno de estilo.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 md:mt-8 px-4">
          <button
            onClick={handleScrollToCarousel}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600/10 dark:bg-blue-600/30 border border-blue-500/50 rounded-xl text-blue-600 dark:text-white font-semibold hover:shadow-[0_0_20px_rgba(30,107,255,0.5)] hover:bg-blue-600 hover:text-white transition backdrop-blur-md"
          >
            Ver productos
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-zinc-800/50 border border-gray-300 dark:border-blue-500/50 rounded-xl text-gray-700 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-blue-600/40 transition backdrop-blur-md"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>

    </section>
  );
}
