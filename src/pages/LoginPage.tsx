// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Ошибка авторизации");
      }

      const data = await response.json();
      
      setToken(data.accessToken); // сохраняем токен
      setUser(data.user)

      setSuccess(true);
      setTimeout(() => {
        navigate("/feed");
      }, 1500); // через 1.5 секунды переходим
    } catch (err: any) {
      setError(err.message || "Ошибка входа");
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <input placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
      <input placeholder="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Войти</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Авторизация прошла успешно!</p>}
    </div>
  );
};

export default LoginPage;
