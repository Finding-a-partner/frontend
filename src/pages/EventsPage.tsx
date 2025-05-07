import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventApi from '../api/eventsApi';
import { Owner, Group } from '../types';

type OwnerType = 'USER' | 'GROUP';

interface EventResponse {
  id: number;
  ownerId: number;
  ownerType: OwnerType;
  title: string;
  description: string | null;
  time: string;
  date: string;
}



const EventsPage = () => {
    const [events, setEvents] = useState<EventResponse[]>([]);
    const [ownerInfo, setOwnerInfo] = useState<Record<string, Owner | Group>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const eventsData = await eventApi.getUserEvents();
        setEvents(eventsData);
        const ownersData: Record<string, Owner | Group> = {};
        
        for (const event of eventsData) {
          const key = `${event.ownerType}_${event.ownerId}`;
          if (!ownerInfo[key]) {
            ownersData[key] = await eventApi.getOwnerInfo(event.ownerId, event.ownerType);
          }
        }
        
        setOwnerInfo(prev => ({ ...prev, ...ownersData }));
      } catch (err) {
        setError('Ошибка загрузки мероприятий');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div>Загрузка мероприятий...</div>;
  if (error) return <div>{error}</div>;

  const renderOwnerInfo = (ownerId: number, ownerType: OwnerType) => {
    const key = `${ownerType}_${ownerId}`;
    const owner = ownerInfo[key];
    
    if (!owner) return <span>Загрузка...</span>;
    
    if (ownerType === 'USER') {
      const userOwner = owner as Owner;
      return (
        <span>
          {userOwner.name} {userOwner.surname} (@{userOwner.login})
        </span>
      );
    } else {
      const groupOwner = owner as Group;
      return (
        <span>
          Группа {groupOwner.name}
        </span>
      );
    }
  };

  return (
    <div className="events-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Мои мероприятия</h1>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Назад
      </button>
      
      {events.length === 0 ? (
        <p style={{ color: '#666' }}>У вас пока нет мероприятий</p>
      ) : (
        <div className="events-list">
          {events.map(event => (
            <div 
              key={event.id} 
              className="event-card" 
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                
              }}
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: '0', color: '#333' }}>{event.title}</h3>
                <div style={{ marginTop: '24px', fontSize: '1em', color: '#333' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Владелец мероприятия:</div>
                {renderOwnerInfo(event.ownerId, event.ownerType)}
                </div>
                <span style={{ 
                  color: '#666',
                  fontSize: '0.9em',
                  backgroundColor: '#f5f5f5',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {formatDateTime(event.date, event.time)}
                </span>
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#555' }}>Описание:</div>
              {event.description && (
                <p style={{ 
                  marginTop: '8px', 
                  color: '#555',
                  fontSize: '0.95em'
                }}>
                  {event.description}
                </p>
              )}
              
              <div style={{ 
                marginTop: '12px', 
                fontSize: '0.85em', 
                color: '#777',
                display: 'flex',
                alignItems: 'center'
              }}>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default EventsPage;