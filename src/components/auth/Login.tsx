import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, User, AlertTriangle } from "lucide-react";
import { setUser } from "../../store/auth/authSlice";
import './Login.css'

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginResponse {
  data: {
    user: any;
    token: string;
  };
}

const INITIAL_FORM_STATE: LoginFormData = {
  username: "",
  password: "",
};

const API_URL = "https://sonil-dev.void.co.mz/api/v4/users/login";

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const data: LoginResponse = await response.json();
      dispatch(setUser({ 
        user: data.data.user, 
        token: data.data.token 
      }));
      
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const renderErrorMessage = () => (
    error && (
      <div className="error-message">
        <AlertTriangle className="icon" />
        <p>{error}</p>
      </div>
    )
  );

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <p>Bem-vindo de volta! Faça login para continuar.</p>
        
        {renderErrorMessage()}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <User className="icon" />
            <input
              type="text"
              name="username"
              placeholder="Nome de usuário"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? <Loader2 className="loading" /> : <span>Entrar</span>}
          </button>
        </form>

        <div className="forgot-password">
          <a href="#">Esqueceu sua senha?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;