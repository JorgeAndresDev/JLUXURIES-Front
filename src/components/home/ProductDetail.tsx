import { useEffect } from "react";

interface Product {
  idProducts: number;
  ProductsName: string;
  Quantity: number;
  Price: number;
  color: string;
  Description: string;
  categoria: string;
}

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetail = ({ product, isOpen, onClose }: ProductDetailProps) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Bloquear scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Overlay con backdrop blur */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 
                      w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-gray-100 dark:border-[#1E6BFF] 
                       shadow-xl dark:shadow-[0_0_50px_#1E6BFF] overflow-hidden">

          {/* Header */}
          <div className="relative p-6 border-b border-gray-100 dark:border-[#1E6BFF]/30">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center dark:drop-shadow-[0_0_10px_#1E6BFF]">
              {product.ProductsName}
            </h2>

            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 bg-gray-100 hover:bg-gray-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 
                         text-gray-500 hover:text-red-500 dark:text-white p-2 rounded-full border border-gray-200 dark:border-red-500
                         dark:hover:shadow-[0_0_15px_#EF4444] transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Columna izquierda - Imagen */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl h-80 
                               flex items-center justify-center border-2 border-[#1E6BFF]/30">
                  <div className="text-center">
                    <svg
                      className="w-24 h-24 mx-auto text-[#1E6BFF]/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-[#1E6BFF]/60 text-sm mt-3">Imagen del producto</p>
                  </div>
                </div>

                {/* Mini galería (placeholder) */}
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="w-16 h-16 bg-gray-700 rounded-lg border border-[#1E6BFF]/20 
                                 hover:border-[#1E6BFF] cursor-pointer transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Columna derecha - Información */}
              <div className="space-y-6">
                {/* Descripción */}
                <div>
                  <h3 className="text-xl font-bold text-[#1E6BFF] mb-3">Descripción</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {product.Description}
                  </p>
                </div>

                {/* Detalles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-[#1E6BFF]/20">
                    <p className="text-gray-400 text-sm">Categoría</p>
                    <p className="text-white font-semibold text-lg">{product.categoria}</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-[#1E6BFF]/20">
                    <p className="text-gray-400 text-sm">Color</p>
                    <p className="text-white font-semibold text-lg">{product.color}</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-[#1E6BFF]/20">
                    <p className="text-gray-400 text-sm">Stock disponible</p>
                    <p className={`text-lg font-bold ${product.Quantity > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                      {product.Quantity} {product.Quantity === 1 ? 'unidad' : 'unidades'}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-[#1E6BFF]/20">
                    <p className="text-gray-400 text-sm">ID Producto</p>
                    <p className="text-white font-semibold text-lg">#{product.idProducts}</p>
                  </div>
                </div>

                {/* Precio y acción */}
                <div className="pt-4 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Precio final</p>
                      <p className="text-4xl font-bold text-emerald-400 drop-shadow-[0_0_15px_#10B981]">
                        ${product.Price.toLocaleString()}
                      </p>
                    </div>

                    <button className="bg-gradient-to-r from-[#1E6BFF] to-[#00FFAA] 
                                      text-white font-bold py-3 px-8 rounded-xl
                                      hover:shadow-[0_0_25px_#1E6BFF] transition-all duration-300
                                      hover:scale-105 active:scale-95">
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;