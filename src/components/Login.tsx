import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../slice/authSlice";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, User, AlertTriangle } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("https://sonil-dev.void.co.mz/api/v4/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }
  
      const data = await response.json();
      console.log("login",data)
      dispatch(setUser({ user: data.user, token: data.token })); // Salvar no Redux
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
              Login
            </h2>
            <p className="text-gray-300 text-sm">Bem-vindo de volta. Faça login para continuar.</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-lg flex items-center space-x-3">
              <AlertTriangle className="text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 pl-10 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2 text-white" />
              ) : (
                <span>Entrar</span>
              )}
            </button>
          </form>

          <div className="text-center text-sm text-gray-400 mt-4">
            <a href="/forgot-password" className="hover:text-blue-400 transition">
              Esqueceu sua senha?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;