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
        <Link to="/login">Login</Link> | 
        <Link to="/register">Register</Link> | 
        <Link to="/feed">Feed</Link> | 
        <Link to="/users">Пользователи</Link> | 
        <Link to="/friends">Друзья</Link> |
        <Link to="/userpage">Профиль</Link>
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
