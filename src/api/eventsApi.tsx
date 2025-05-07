import EventsPage from '../pages/EventsPage'
import { Owner, Group } from '../types';

// Типы для TypeScript
export type OwnerType = 'USER' | 'GROUP';

export interface EventResponse {
  id: number;
  ownerId: number;
  ownerType: OwnerType;
  title: string;
  description: string | null;
  time: string;
  date: string;
}


const API_BASE_URL = 'http://localhost:8000'; // Замените на ваш базовый URL

const eventApi = {
    
  /**
   * Получает все мероприятия для текущего пользователя
   */
  getUserEvents: async (): Promise<EventResponse[]> => {
    try {
        const userJson = localStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;

      const response = await fetch(`${API_BASE_URL}/event-members/user/${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.json()
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  },
  getOwnerInfo: async (ownerId: number, ownerType: OwnerType): Promise<Owner | Group> => {
    try {
      if (ownerType === 'USER') {
        const response = await fetch(`${API_BASE_URL}/users/${ownerId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.status}`);
        }
        
        return await response.json() as Owner;
      } else {
        const response = await fetch(`${API_BASE_URL}/groups/${ownerId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch group: ${response.status}`);
        }
        
        return await response.json() as Group;
      }
    } catch (error) {
      console.error('Error fetching owner info:', error);
      throw error; // Важно пробросить ошибку дальше
    }
  }

 };

export default eventApi;