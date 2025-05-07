import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // импортируем useNavigate

type User = {
  id: number;
  name: string;
  surname: string;
  login: string;
  email: string;
  description?: string;
};

type FriendshipStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED";

const TABS: { label: string; status: FriendshipStatus }[] = [
  { label: "Друзья", status: "ACCEPTED" },
  { label: "Исходящие заявки", status: "PENDING" },
  { label: "Отклонённые", status: "REJECTED" },
  { label: "Заблокированные", status: "BLOCKED" },
];

const FriendsPage = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<FriendshipStatus>("PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const fetchFriends = async (status: FriendshipStatus) => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      const res = await fetch(`http://localhost:8000/users/friends/${user.id}?status=${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Ошибка при загрузке друзей");

      const data = await res.json();
      setFriends(data);
    } catch (err: any) {
      setError(err.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchFriends(activeTab);
    }
  }, [activeTab, navigate]);

  return (
    <div>
      <h2>Мои друзья</h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        {TABS.map((tab) => (
          <button
            key={tab.status}
            onClick={() => setActiveTab(tab.status)}
            style={{
              fontWeight: tab.status === activeTab ? "bold" : "normal",
              backgroundColor: tab.status === activeTab ? "#ddd" : "#f5f5f5",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {friends.length === 0 && !loading ? (
          <p>Нет пользователей в этой категории</p>
        ) : (
          friends.map((user) => (
            <div key={user.id} style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
              <strong>{user.name} {user.surname}</strong> ({user.login})<br />
              <small>{user.email}</small><br />
              {user.description && <p>{user.description}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
