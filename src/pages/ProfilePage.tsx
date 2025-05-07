import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { useAuth } from "../context/AuthContext";

interface User {
  id: number;
  login: string;
  email: string;
  name: string;
  surname: string;
  description: string;
}

const ProfilePage = () => {
  const [user, setUser_] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { setUser, setToken } = useAuth();

  const currentUserJson = localStorage.getItem("user");
  const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
  const currentUserId = currentUser?.id;

  const isOwnProfile = currentUserId === Number(id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        if (!id) {
          setError('Не удалось определить пользователя');
          return;
        }

        const userData = await userApi.getUserById(Number(id));
        setUser_(userData);
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
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Пользователь не найден</div>;

  return (
    <div className="profile-container">
      <h1>{isOwnProfile ? 'Личный профиль' : 'Профиль пользователя'}</h1>

      {isOwnProfile && (
        <button onClick={handleLogout}>Выйти</button>
      )}

      <div className="profile-info">
        <h2>{user.name} {user.surname}</h2>
        <p>Логин: {user.login}</p>
        <p>Email: {user.email}</p>
        <p>Описание: {user.description}</p>
      </div>

      <div className="navigation-buttons" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        {isOwnProfile ? (
          <>
            <button onClick={() => navigate('/friends')}>Друзья</button>
            <button onClick={() => navigate('/groups')}>Группы</button>
            <button onClick={() => navigate('/events')}>Мероприятия</button>
            <button onClick={() => navigate('/chats')}>Чаты</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate(`/friends/add/${user.id}`)}>Добавить в друзья</button>
            <button onClick={() => navigate(`/chats/new/${user.id}`)}>Написать сообщение</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
