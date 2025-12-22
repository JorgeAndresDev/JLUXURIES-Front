import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "../../../services/Clients";

// Definimos la interfaz que coincide con la estructura de tu formulario
// y cumple con la restricción de tipo de la API (TS2345).
interface ClientForm {
    nombre: string;
    email: string;
    password: string;
    telefono: string;
    direccion: string;
    role: "client" | "admin"; // CLAVE: Solo permite estos dos valores literales
}

export default function CreateClientPage() {
    const navigate = useNavigate();

    // Inicializamos el estado usando la interfaz ClientForm
    const [form, setForm] = useState<ClientForm>({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        direccion: "",
        role: "client"
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Manejo específico del rol para asegurar que el tipo se mantenga como literal
        if (name === 'role') {
            // Se usa aserción para confirmar a TypeScript que el valor es uno de los literales esperados.
            setForm({ ...form, role: value as "client" | "admin" });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            await createClient(form as any);
            setToast({ message: '¡Cliente creado exitosamente!', type: 'success' });
            setTimeout(() => navigate("/admin/clients"), 2000);
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.response?.data?.detail || "Hubo un error al crear el cliente. Verifique los datos.");
            setToast({ message: 'Error al crear el cliente', type: 'error' });
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
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Crear Nuevo Cliente</h1>

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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre completo</label>
                            <input
                                type="text"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                placeholder="Ej: Juan Pérez"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                placeholder="ejemplo@correo.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                placeholder="Ej: +57 300 123 4567"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rol de Usuario</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white transition-all"
                        >
                            <option value="client" className="bg-gray-900 text-white">Cliente</option>
                            <option value="admin" className="bg-gray-900 text-white">Administrador</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Dirección</label>
                        <textarea
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                            rows={3}
                            placeholder="Dirección completa..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/clients')}
                            className="flex-1 py-3.5 px-4 border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white rounded-xl font-semibold transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#1E6BFF] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/30 transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creando..." : "Crear Cliente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
