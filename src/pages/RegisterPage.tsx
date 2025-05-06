// src/pages/Register.tsx
import { useState } from "react";

const RegisterPage = () => {
  const [form, setForm] = useState({
    login: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Ошибка регистрации");
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.accessToken); // сохраняем токен

      // TODO: перенаправить пользователя или показать сообщение
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации");
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <input name="login" placeholder="Логин" value={form.login} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} />
      <input name="name" placeholder="Имя" value={form.name} onChange={handleChange} />
      <input name="surname" placeholder="Фамилия" value={form.surname} onChange={handleChange} />
      <textarea name="description" placeholder="Описание" value={form.description} onChange={handleChange} />
      <button onClick={handleRegister}>Зарегистрироваться</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RegisterPage;
