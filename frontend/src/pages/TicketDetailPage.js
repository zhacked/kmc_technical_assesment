import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setError('');
      const response = await axios.get(`${API_URL}/tickets/${id}`);
      setTicket(response.data.ticket);
      setComments(response.data.ticket.comments || []);
    } catch (err) {
      setError('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(
        `${API_URL}/tickets/${id}/comments`,
        { body: commentBody }
      );
      setComments([...comments, response.data]);
      setCommentBody('');
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading ticket...</div>;
  if (!ticket) return <div className="error-message">Ticket not found</div>;

  return (
    <div className="page-container">
      <button onClick={() => navigate('/tickets')} className="btn-back">
        ← Back to Tickets
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="ticket-detail">
        <div className="ticket-header">
          <div>
            <h1>{ticket.title}</h1>
            <p className="ticket-id">Ticket #{ticket.id}</p>
          </div>
          <div className="ticket-badges">
            <span className={`status-badge status-${ticket.status}`}>
              {ticket.status}
            </span>
            <span className={`priority-badge priority-${ticket.priority}`}>
              {ticket.priority}
            </span>
          </div>
        </div>

        <div className="ticket-info">
          <div className="info-group">
            <label>Created by</label>
            <p>{ticket.customer?.name}</p>
          </div>
          <div className="info-group">
            <label>Created</label>
            <p>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</p>
          </div>
          {ticket.assigned_to && (
            <div className="info-group">
              <label>Assigned to</label>
              <p>{ticket.assigned_to}</p>
            </div>
          )}
        </div>

        <div className="ticket-description">
          <h2>Description</h2>
          <p>{ticket.description}</p>
        </div>

        <div className="comments-section">
          <h2>Comments ({comments.length})</h2>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="empty-state">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <strong>{comment.user?.name}</strong>
                    <span className="comment-time">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="comment-body">{comment.body}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="comment-form">
            <h3>Add Comment</h3>
            <div className="form-group">
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Type your comment here..."
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
