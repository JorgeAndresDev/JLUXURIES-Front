export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Luces LED Neón",
      price: 120000,
      image: "https://i.imgur.com/zYIlgQF.jpeg",
    },
    {
      id: 2,
      name: "Sliders Anticaída",
      price: 90000,
      image: "https://i.imgur.com/WgNbXAo.jpeg",
    },
    {
      id: 3,
      name: "Manillares Deportivos",
      price: 150000,
      image: "https://i.imgur.com/BHURxmT.jpeg",
    },
  ];

  return (
    <section className="w-full py-16 bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">

        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-bold mb-10 drop-shadow-[0_0_10px_rgba(30,107,255,0.3)] dark:drop-shadow-[0_0_10px_#1E6BFF]">
          Productos Destacados
        </h2>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="
                bg-gray-50 dark:bg-[#0A0F1C] border border-gray-200 dark:border-blue-500/20 rounded-2xl 
                shadow-lg dark:shadow-[0_0_15px_#1E6BFF20] overflow-hidden
                hover:shadow-xl dark:hover:shadow-[0_0_25px_#1E6BFF50] 
                transition duration-300 hover:-translate-y-1
              "
            >
              {/* Imagen */}
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover"
              />

              {/* Info */}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">
                  ${p.price.toLocaleString()}
                </p>

                <button className="w-full py-2 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/40 
                                   hover:bg-blue-100 dark:hover:bg-blue-600/30 transition shadow-none dark:shadow-[0_0_10px_#1E6BFF40] text-blue-600 dark:text-white font-medium">
                  Ver detalle
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
