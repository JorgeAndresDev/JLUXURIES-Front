import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";

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
    <section className="relative py-12 w-full bg-gradient-to-b from-black to-gray-900 overflow-hidden">
      {/* Título */}
      <div className="px-6 sm:px-12 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_0_10px_#1E6BFF] mb-2">
            Productos Destacados
          </h2>
          <p className="text-gray-400">Lo mejor de nuestra colección para ti.</p>
        </div>

        {/* Botones de navegación (Desktop) */}
        <div className="hidden sm:flex gap-4">
          <button
            onClick={scrollLeft}
            className="bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10 hover:border-[#1E6BFF] transition-all group"
          >
            <span className="text-white group-hover:text-[#1E6BFF]">◀</span>
          </button>
          <button
            onClick={scrollRight}
            className="bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10 hover:border-[#1E6BFF] transition-all group"
          >
            <span className="text-white group-hover:text-[#1E6BFF]">▶</span>
          </button>
        </div>
      </div>

      {/* Contenedor Carrusel */}
      <div className="relative w-full group">
        {/* Botones Flotantes (Mobile/Tablet Hover) */}
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 p-3 rounded-full border border-white/10 hover:border-[#1E6BFF] opacity-0 group-hover:opacity-100 transition-all sm:hidden"
        >
          <span className="text-white">◀</span>
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 p-3 rounded-full border border-white/10 hover:border-[#1E6BFF] opacity-0 group-hover:opacity-100 transition-all sm:hidden"
        >
          <span className="text-white">▶</span>
        </button>

        {/* Carrusel Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-6 sm:px-12 pb-8 scrollbar-hide snap-x snap-mandatory w-full"
        >
          {products.map((product) => (
            <div
              key={product.idProducts}
              onClick={() => navigate(`/admin/product/${product.idProducts}`)}
              className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] xl:w-[18vw]
                         bg-white/5 backdrop-blur-md rounded-2xl border border-white/10
                         hover:border-[#1E6BFF] hover:shadow-[0_0_30px_#1E6BFF40] hover:scale-[1.02]
                         transition-all duration-300 snap-center overflow-hidden cursor-pointer group/card"
            >
              {/* Imagen */}
              <div className="h-48 sm:h-56 w-full bg-gray-800 relative overflow-hidden">
                <img
                  src={product.image_url || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"}
                  alt={product.ProductsName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Badge de categoría */}
                <div className="absolute top-3 right-3 bg-purple-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white border border-purple-400/30">
                  {product.categoria}
                </div>

                {/* Stock badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white border border-white/20">
                  Stock: {product.Quantity}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 truncate group-hover/card:text-[#1E6BFF] transition-colors">
                  {product.ProductsName}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{product.Description}</p>

                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Precio</p>
                    <p className="text-[#1E6BFF] font-bold text-xl">
                      ${product.Price.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-[#1E6BFF]/20 p-2 rounded-lg border border-[#1E6BFF]/30 group-hover/card:bg-[#1E6BFF] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1E6BFF] group-hover/card:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
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
