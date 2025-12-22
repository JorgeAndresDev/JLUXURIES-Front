import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../services/Products";

export default function CreateProductPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ProductsName: "",
    moto: "",
    Quantity: 0,
    Price: 0,
    color: "",
    Description: "", // Backend espera Description con D mayúscula
    categoria: "",
    image_url: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const productData = {
        ...form,
        Price: parseFloat(form.Price.toString()),
        Quantity: parseInt(form.Quantity.toString(), 10),
      };
      await createProduct(productData);
      setToast({ message: '¡Producto creado exitosamente!', type: 'success' });
      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Hubo un error al crear el producto. Verifique los datos.");
      setToast({ message: 'Error al crear el producto', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border ${toast.type === 'success'
            ? 'bg-green-600/90 border-green-400/50 text-white'
            : 'bg-red-600/90 border-red-400/50 text-white'
            }`}>
            {toast.type === 'success' ? (
              <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-semibold">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-80 transition-opacity"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Crear Nuevo Producto</h1>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-xl dark:shadow-none">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre del producto</label>
              <input
                type="text"
                name="ProductsName"
                value={form.ProductsName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                placeholder="Ej: Casco Integral"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Moto del producto</label>
              <input
                type="text"
                name="moto"
                value={form.moto}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                placeholder="Ej: Honda XR150"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Categoría</label>
              <input
                type="text"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                placeholder="Ej: Seguridad"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Precio</label>
              <input
                type="number"
                name="Price"
                value={form.Price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                min={0}
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cantidad</label>
              <input
                type="number"
                name="Quantity"
                value={form.Quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                min={0}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Color</label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                placeholder="Ej: Negro"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL de la Imagen</label>
            <input
              type="url"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descripción</label>
            <textarea
              name="Description"
              value={form.Description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              rows={4}
              placeholder="Detalles del producto..."
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 py-3.5 px-4 border border-white/10 hover:bg-white/5 text-white rounded-xl font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#1E6BFF] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/30 transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creando..." : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
