import { useEffect, useState } from "react";
import FeedCard from "../components/FeedCard";

interface FeedResponse {
  id: number;
  createdAt: string;
  ownerId: number;
  ownerType: string;
  title: string;
  description?: string;
  visibility: string;
  time: string;
  date: string;
}

const FeedPage = () => {
  const [feed, setFeed] = useState<FeedResponse[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8000/feed", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Ошибка загрузки ленты");
        }

        const data: FeedResponse[] = await response.json();
        setFeed(data);
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки");
      }
    };

    fetchFeed();
  }, []);

  return (
    <div>
      <h2>Новостная лента</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {feed.length === 0 && !error ? (
        <p>Нет мероприятий</p>
      ) : (
        feed.map((item) => (
          <FeedCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            date={item.date}
            time={item.time}
            ownerType={item.ownerType}
            ownerId={item.ownerId}
            visibility={item.visibility}
          />
        ))
      )}
    </div>
  );
};

export default FeedPage;
