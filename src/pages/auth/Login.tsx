import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('=== FULL LOGIN RESPONSE ===');
      console.log('Full response.data:', JSON.stringify(response.data, null, 2));
      console.log('access_token:', response.data.access_token);
      console.log('usuario:', response.data.usuario);
      console.log('typeof usuario:', typeof response.data.usuario);

      const { access_token, usuario } = response.data;

      // Handle if usuario is a string (just the name) or an object
      let userObject;
      if (typeof usuario === 'string') {
        // If backend only returns name, create a user object
        userObject = {
          email: email,
          nombre: usuario
        };
        console.warn('⚠️ Backend returned usuario as string. Missing: id_cliente, telefono, direccion');
      } else {
        // If backend returns full object
        userObject = usuario;
        console.log('✅ Backend returned usuario as object:', userObject);
      }

      console.log('User object to save:', userObject);
      login(access_token, userObject);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-950 text-white">
      {/* Left Side - Image/Brand (Hidden on mobile, visible on lg) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
        <img
          src="/src/assets/logo.png"
          alt="Luxury Motorcycle"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        {/* Background Elements for Mobile/Tablet */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden lg:hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md z-10">
          <div className="lg:hidden text-center mb-10">
            <img src="/src/assets/Logo.png" alt="JLUXURIES" className="w-32 h-auto mx-auto" />
          </div>

          <h2 className="text-3xl font-bold mb-2">Bienvenido de nuevo</h2>
          <p className="text-gray-400 mb-8">Ingresa tus credenciales para acceder a tu cuenta.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500 transition-all"
                placeholder="nombre@ejemplo.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-300">Contraseña</label>
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">¿Olvidaste tu contraseña?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-blue-600/30 border border-blue-500/50 rounded-xl text-white font-semibold hover:shadow-[0_0_20px_#1E6BFF] transition-all duration-200 backdrop-blur-md mt-2"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-white font-semibold hover:text-blue-400 transition-colors">
              Regístrate ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
