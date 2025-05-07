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

const MyProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

        const userId =  user.id;

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
  }, [navigate]);

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
      <h1>Личный профиль</h1>
      <button onClick={handleLogout}>Выйти</button>
      
      <div className="profile-info">
        <h2>{user.name} {user.surname}</h2>
        <p>Логин: {user.login}</p>
        <p>Email: {user.email}</p>
        <p>Описание: {user.description}</p>
      </div>
   {/* Навигационные кнопки */}
   <div className="navigation-buttons" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
   <button 
     onClick={() => navigate('/friends')}
     style={{ padding: '10px 20px', cursor: 'pointer' }}
   >
     Друзья
   </button>
   
   <button 
     onClick={() => navigate('/groups')}
     style={{ padding: '10px 20px', cursor: 'pointer' }}
   >
     Группы
   </button>

   <button 
     onClick={() => navigate('/events')}
     style={{ padding: '10px 20px', cursor: 'pointer' }}
   >
     Мероприятия
   </button>
   
   <button 
     onClick={() => navigate('/chats')}
     style={{ padding: '10px 20px', cursor: 'pointer' }}
   >
     Чаты
   </button>
 </div>
</div>
);
};

export default MyProfilePage;
