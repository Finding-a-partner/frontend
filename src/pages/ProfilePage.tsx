import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi } from '../api/userApi';

interface User {
  id: number;
  login: string;
  email: string;
  name: string;
  surname: string;
  description: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userJson = localStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;

        const userId = id ?? user.id;

        console.log("userId:", userId, id, localStorage.getItem('userId'))
        if (!userId) {
          setError('Не удалось определить пользователя');
          return;
        }

        const userData = await userApi.getUserById(Number(userId));
        setUser(userData);
      } catch (err) {
        setError('Ошибка загрузки данных пользователя');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Пользователь не найден</div>;

  return (
    <div className="profile-container">
      <h1>Профиль пользователя</h1>
      {!id && <button onClick={handleLogout}>Выйти</button>}

      <div className="profile-info">
        <h2>{user.name} {user.surname}</h2>
        <p>Логин: {user.login}</p>
        <p>Email: {user.email}</p>
        <p>Описание: {user.description}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
