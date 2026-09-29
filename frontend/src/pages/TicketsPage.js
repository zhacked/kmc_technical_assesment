import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(null);

  const statusLabels = {
    todo: 'To Do',
    ongoing: 'Ongoing',
    done: 'Done'
  };

  const statusColors = {
    todo: '#3b82f6',
    ongoing: '#f59e0b',
    done: '#10b981'
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setError('');
      const response = await axios.get(`${API_URL}/tickets`);
      const ticketData = response.data.data || response.data;
      console.log('API Response:', response.data);
      console.log('Tickets:', ticketData);
      if (ticketData && ticketData.length > 0) {
        console.log('First ticket:', ticketData[0]);
      }
      setTickets(ticketData);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus, e) => {
    e.preventDefault();
    e.stopPropagation();

    setUpdating(ticketId);
    try {
      await axios.patch(`${API_URL}/tickets/${ticketId}`, { status: newStatus });
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
      setSuccess('Ticket status updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update ticket status');
    } finally {
      setUpdating(null);
    }
  };

  const getTicketsByStatus = (status) => {
    return tickets.filter(t => t.status === status);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#999';
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusOrder = ['todo', 'ongoing', 'done'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder[(currentIndex + 1) % statusOrder.length];
  };

  if (loading) return <div className="loading">Loading tickets...</div>;

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <div className="header-content">
          <h1>📋 Ticket Board</h1>
          <p className="header-subtitle">Manage your support tickets</p>
        </div>
        <Link to="/tickets/create" className="btn-primary btn-create">
          New Ticket
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {tickets.length === 0 ? (
        <div className="empty-state">
          <p>No tickets yet. <Link to="/tickets/create">Create one</Link></p>
        </div>
      ) : (
        <div className="kanban-board">
          {['todo', 'ongoing', 'done'].map((status) => {
            const ticketsInColumn = getTicketsByStatus(status);

            return (
              <div key={status} className="kanban-column">
                <div className="column-header" style={{ borderTopColor: statusColors[status] }}>
                  <div className="column-title">
                    <span className="status-indicator" style={{ backgroundColor: statusColors[status] }} />
                    <h2>{statusLabels[status]}</h2>
                  </div>
                  <span className="column-count">{ticketsInColumn.length}</span>
                </div>
                <div className="cards-list">
                  {ticketsInColumn.map((ticket) => (
                    <div key={ticket.id} className="ticket-card">
                      <Link to={`/tickets/${ticket.id}`} className="card-content">
                        <div className="card-header">
                          <span className="ticket-id">#{ticket.id}</span>
                          <span
                            className="priority-dot"
                            style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                            title={ticket.priority}
                          />
                        </div>
                        <h3 className="card-title">{ticket.title}</h3>
                        <p className="card-description">{ticket.description?.substring(0, 80)}...</p>
                      </Link>
                      <div className="card-footer">
                        <span className="priority-badge" style={{ borderColor: getPriorityColor(ticket.priority), color: getPriorityColor(ticket.priority) }}>
                          {ticket.priority}
                        </span>
                        <div className="status-actions">
                          {status !== 'done' && (
                            <button
                              onClick={(e) => updateTicketStatus(ticket.id, getNextStatus(ticket.status), e)}
                              disabled={updating === ticket.id}
                              className="btn-move"
                              title={`Move to ${statusLabels[getNextStatus(ticket.status)]}`}
                            >
                              {updating === ticket.id ? '...' : 'move'}
                            </button>
                          )}
                          {status !== 'todo' && (
                            <button
                              onClick={(e) => updateTicketStatus(ticket.id, 'todo', e)}
                              disabled={updating === ticket.id}
                              className="btn-move btn-back-to"
                              title="Move back to To Do"
                            >
                              revert
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {ticketsInColumn.length === 0 && (
                    <div className="empty-column">No tickets in {statusLabels[status]}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
