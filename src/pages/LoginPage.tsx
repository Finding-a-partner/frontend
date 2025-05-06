// src/pages/Login.tsx
import { useState } from "react";

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

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
      setToken(data.token); // сохраняем токен
      localStorage.setItem("token", data.token); // можно сохранить в localStorage
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
    </div>
  );
};

export default LoginPage;
