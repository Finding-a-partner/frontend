import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 20px",
      backgroundColor: "#eee",
    }}>
      <div>
        <Link to="/login">Вход</Link> | 
        <Link to="/register">Регистрация</Link> | 
        <Link to="/feed">Новости</Link> | 
        <Link to="/users">Пользователи</Link> | 
        <Link to="/friends">Друзья</Link> |
        {user && (
          <>
          console.log(userId);
            <Link to={`/users/${user.id}`}>Профиль</Link>
          </>
        )}
      </div>
      {user && (
        <div>
          {user.name} {user.surname} ({user.login})
        </div>
      )}
    </nav>
  );
};

export default Navbar;
