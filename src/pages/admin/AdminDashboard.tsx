import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Package, Users, FileText, Plus, Eye } from "lucide-react";

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 pt-24 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        Panel de Administración
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Bienvenido, <span className="text-white font-semibold">{user?.nombre || user?.email}</span>
                    </p>
                </div>

                {/* Main Modules Grid - 3 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Productos Module */}
                    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#1E6BFF] hover:shadow-[0_0_30px_#1E6BFF40] transition-all duration-300">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-14 w-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-900/50 transition-all">
                                    <Package className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Productos
                                    </h2>
                                    <p className="text-gray-400 text-xs">Gestión de inventario</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm mb-6">
                                Administra el catálogo de productos, precios y stock.
                            </p>

                            {/* Actions */}
                            <div className="space-y-2">
                                <Link
                                    to="/admin/create-product"
                                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 hover:text-purple-200 transition-all text-sm font-medium"
                                >
                                    <Plus className="h-4 w-4" />
                                    Crear Producto
                                </Link>
                                <Link
                                    to="/admin/products"
                                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-sm font-medium"
                                >
                                    <Eye className="h-4 w-4" />
                                    Ver Inventario
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Clientes Module */}
                    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#1E6BFF] hover:shadow-[0_0_30px_#1E6BFF40] transition-all duration-300">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-900/50 transition-all">
                                    <Users className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Clientes
                                    </h2>
                                    <p className="text-gray-400 text-xs">Gestión de usuarios</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm mb-6">
                                Administra clientes, información de contacto y roles.
                            </p>

                            {/* Actions */}
                            <div className="space-y-2">
                                <Link
                                    to="/admin/create-client"
                                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all text-sm font-medium"
                                >
                                    <Plus className="h-4 w-4" />
                                    Crear Cliente
                                </Link>
                                <Link
                                    to="/admin/clients"
                                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-sm font-medium"
                                >
                                    <Eye className="h-4 w-4" />
                                    Ver Todos
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Audit Logs Module */}
                    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#1E6BFF] hover:shadow-[0_0_30px_#1E6BFF40] transition-all duration-300">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-14 w-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-900/50 transition-all">
                                    <FileText className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Auditoría
                                    </h2>
                                    <p className="text-gray-400 text-xs">Registro de acciones</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm mb-6">
                                Historial completo de acciones del sistema.
                            </p>

                            {/* Actions */}
                            <div className="space-y-2">
                                <Link
                                    to="/admin/audit-logs"
                                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-300 hover:text-green-200 transition-all text-sm font-medium"
                                >
                                    <Eye className="h-4 w-4" />
                                    Ver Historial Completo
                                </Link>
                                <Link
                                    to={`/admin/audit-logs/user/${user?.id_cliente}`}
                                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-sm font-medium"
                                >
                                    <FileText className="h-4 w-4" />
                                    Mis Acciones
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Access Footer */}
                <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                        <Link
                            to="/profile"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Mi Perfil →
                        </Link>
                        <span className="text-gray-600">•</span>
                        <Link
                            to="/"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Ver Tienda →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
