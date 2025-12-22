import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProducts, updateProduct } from "../../../services/Products";
import type { Product } from "../../../types";

export default function EditProductPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [form, setForm] = useState({
        idProducts: 0,
        ProductsName: "",
        moto: "",
        Quantity: 0,
        Price: 0,
        color: "",
        Description: "",
        categoria: "",
        image_url: ""
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoadingData(true);
            const response = await getProducts();
            const product = response.data.find((p: Product) => p.idProducts === Number(id));

            if (product) {
                setForm({
                    idProducts: product.idProducts,
                    ProductsName: product.ProductsName,
                    moto: product.moto,
                    Quantity: product.Quantity,
                    Price: product.Price,
                    color: product.color,
                    Description: product.Description,
                    categoria: product.categoria,
                    image_url: product.image_url || ""
                });
            } else {
                setErrorMsg("Producto no encontrado");
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg("Error al cargar el producto");
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const productData = {
                idProducts: form.idProducts,
                ProductsName: form.ProductsName,
                moto: form.moto,
                Quantity: parseInt(form.Quantity.toString(), 10),
                Price: parseFloat(form.Price.toString()),
                color: form.color,
                Description: form.Description,
                categoria: form.categoria,
                image_url: form.image_url
            };

            await updateProduct(productData);
            navigate("/admin/products");
        } catch (err: any) {
            console.error(err);
            setErrorMsg("Hubo un error al actualizar el producto. Verifique los datos.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="container mx-auto px-4 pt-20 pb-8">
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-[#1E6BFF]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-6xl">
                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errorMsg}
                    </div>
                )}

                <div className="space-y-5 bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-xl dark:shadow-none">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Editar producto</h1>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2 uppercase tracking-wider">Nombre del producto</label>
                            <input
                                type="text"
                                name="ProductsName"
                                value={form.ProductsName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#1E6BFF]/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm"
                                placeholder="Ej: Casco Integral"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2 uppercase tracking-wider">Moto</label>
                            <input
                                type="text"
                                name="moto"
                                value={form.moto}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#1E6BFF]/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm"
                                placeholder="Ej: FZ16"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2 uppercase tracking-wider">Categoría</label>
                            <input
                                type="text"
                                name="categoria"
                                value={form.categoria}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#1E6BFF]/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm"
                                placeholder="Ej: Seguridad"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2 uppercase tracking-wider">Color</label>
                            <input
                                type="text"
                                name="color"
                                value={form.color}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#1E6BFF]/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm"
                                placeholder="Ej: Negro"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2 uppercase tracking-wider">Precio</label>
                            <input
                                type="number"
                                name="Price"
                                value={form.Price}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#1E6BFF]/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm"
                                min={0}
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2 uppercase tracking-wider">Cantidad</label>
                            <input
                                type="number"
                                name="Quantity"
                                value={form.Quantity}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#1E6BFF]/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm"
                                min={0}
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2 uppercase tracking-wider">URL de la Imagen</label>
                            <input
                                type="url"
                                name="image_url"
                                value={form.image_url}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#1E6BFF]/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2 uppercase tracking-wider">Descripción</label>
                        <textarea
                            name="Description"
                            value={form.Description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#1E6BFF]/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm resize-none"
                            rows={2}
                            placeholder="Detalles del producto..."
                            required
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="flex-1 py-3 px-4 border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white rounded-lg font-semibold transition-all text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-blue-600 dark:bg-black/40 border border-blue-600 dark:border-2 dark:border-cyan-400 hover:bg-blue-700 dark:hover:bg-black/60 text-white rounded-lg font-bold shadow-lg shadow-blue-900/30 dark:shadow-[#1E6BFF]/20 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm tracking-wide"
                        >
                            {loading ? "Actualizando..." : "Actualizar Producto"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
