import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import GlareHover from "../common/GlareHover";

const ProductCarousel = () => {
  const { products, loading } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 300;
      scrollRef.current.scrollBy({ left: -(cardWidth + 24), behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 300;
      scrollRef.current.scrollBy({ left: (cardWidth + 24), behavior: "smooth" });
    }
  };

  if (loading) {
    return <div className="w-full h-64 flex items-center justify-center text-gray-500">Cargando productos...</div>;
  }

  return (
    <section className="relative py-12 w-full bg-gray-50 dark:bg-gradient-to-b dark:from-black dark:to-gray-900 overflow-hidden transition-colors duration-300">
      {/* Título */}
      <div className="px-6 sm:px-12 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white drop-shadow-[0_0_10px_rgba(30,107,255,0.3)] dark:drop-shadow-[0_0_10px_#1E6BFF] mb-2">
            Productos Destacados
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Lo mejor de nuestra colección para ti.</p>
        </div>

        {/* Botones de navegación (Desktop) */}
        <div className="hidden sm:flex gap-4">
          <button
            onClick={scrollLeft}
            className="bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 p-3 rounded-full border border-gray-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-[#1E6BFF] transition-all group shadow-sm dark:shadow-none"
          >
            <span className="text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#1E6BFF]">◀</span>
          </button>
          <button
            onClick={scrollRight}
            className="bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 p-3 rounded-full border border-gray-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-[#1E6BFF] transition-all group shadow-sm dark:shadow-none"
          >
            <span className="text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#1E6BFF]">▶</span>
          </button>
        </div>
      </div>

      {/* Contenedor Carrusel */}
      <div className="relative w-full group">
        {/* Botones Flotantes (Mobile/Tablet Hover) */}
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-black/70 p-3 rounded-full border border-gray-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-[#1E6BFF] opacity-0 group-hover:opacity-100 transition-all sm:hidden shadow-lg"
        >
          <span className="text-gray-900 dark:text-white">◀</span>
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-black/70 p-3 rounded-full border border-gray-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-[#1E6BFF] opacity-0 group-hover:opacity-100 transition-all sm:hidden shadow-lg"
        >
          <span className="text-gray-900 dark:text-white">▶</span>
        </button>

        {/* Carrusel Scroll - Optimizado */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto px-6 sm:px-12 pb-8 scrollbar-hide snap-x snap-mandatory w-full"
        >
          {products.map((product) => (
            <GlareHover
              key={product.idProducts}
              onClick={() => navigate(`/product/${product.idProducts}`, { state: { from: '/' } })}
              className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] xl:w-[18vw] bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-[#1E6BFF] hover:shadow-[0_0_20px_rgba(30,107,255,0.2)] dark:hover:shadow-[0_0_20px_#1E6BFF30] hover:scale-[1.03] transition-all duration-150 snap-center overflow-hidden cursor-pointer group/card shadow-md dark:shadow-none"
              glareColor="#1E6BFF"
              glareOpacity={0.12}
              glareAngle={-30}
              glareSize={220}
              transitionDuration={700}
            >
              {/* Imagen Optimizada */}
              <div className="h-40 sm:h-44 w-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                <img
                  src={product.image_url || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"}
                  alt={product.ProductsName}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover/card:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                {/* Badge de categoría - Sin blur */}
                <div className="absolute top-2 right-2 bg-purple-600/90 px-2.5 py-1 rounded-lg text-xs font-semibold text-white">
                  {product.categoria}
                </div>

                {/* Stock badge - Sin blur */}
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

              {/* Contenido Compacto */}
              <div className="p-4 bg-white dark:bg-transparent transition-colors">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 truncate group-hover/card:text-blue-600 dark:group-hover/card:text-[#1E6BFF] transition-colors">
                  {product.ProductsName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2 h-8 leading-snug">{product.Description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Precio</p>
                    <p className="text-blue-600 dark:text-[#1E6BFF] font-bold text-lg">
                      ${product.Price.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-[#1E6BFF]/20 p-2 rounded-lg border border-blue-200 dark:border-[#1E6BFF]/30 group-hover/card:bg-blue-600 dark:group-hover/card:bg-[#1E6BFF] transition-colors duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-[#1E6BFF] group-hover/card:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </GlareHover>
          ))}
        </div>
      </div>

      {/* Scrollbar hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ProductCarousel;
