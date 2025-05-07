// src/api/feedApi.ts
import {useAuth} from "../context/AuthContext"
  
export const joinEvent = async (eventId: number): Promise<void> => {
    const userJson = localStorage.getItem("user");
    const token = localStorage.getItem("token"); // Используем токен, а не id
    
    if (!userJson || !token) {
        throw new Error("Требуется авторизация");
    }

    const user = JSON.parse(userJson);
    if (!user?.id) {
        throw new Error("Неверные данные пользователя");
    }

    const payload = {
        eventId,
        userId: user.id // Предполагая, что бэкенд ожидает userId
    };

    const response = await fetch("http://localhost:8000/event-members", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Правильный заголовок авторизации
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.text(); // Лучше text(), чем json() для универсальности
        throw new Error(errorData || "Ошибка при добавлении к мероприятию");
    }
};