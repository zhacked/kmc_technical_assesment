import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const CreateTicketPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/tickets`, {
        title,
        description,
        priority,
      });
      navigate(`/tickets/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="create-ticket-container">
      <div className="create-ticket-header">
        <button onClick={() => navigate('/tickets')} className="btn-back-link">
          ← Back to Board
        </button>
        <h1>✨ Create New Ticket</h1>
        <p className="subtitle">Add a new support ticket to your board</p>
      </div>

      <div className="create-ticket-form-wrapper">
        <div className="form-card">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="title">
                  <span className="label-text">Ticket Title</span>
                  <span className="required">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your issue"
                  required
                  className="form-input"
                />
                <span className="char-count">{title.length}/100</span>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="description">
                  <span className="label-text">Description</span>
                  <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed information about your issue..."
                  rows="6"
                  required
                  className="form-textarea"
                ></textarea>
                <span className="char-count">{description.length}/1000</span>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="priority">
                  <span className="label-text">Priority Level</span>
                </label>
                <div className="priority-selector">
                  {['low', 'medium', 'high'].map((p) => (
                    <label key={p} className={`priority-option ${priority === p ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={priority === p}
                        onChange={(e) => setPriority(e.target.value)}
                      />
                      <span className="priority-dot" style={{ backgroundColor: getPriorityColor(p) }}></span>
                      <span className="priority-label">{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-primary btn-create-submit">
                {loading ? 'Creating Ticket...' : '✓ Create Ticket'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/tickets')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="form-preview">
          <div className="preview-card">
            <div className="preview-header">
              <h3>Preview</h3>
            </div>
            <div className="preview-content">
              <div className="preview-title">{title || 'Your ticket title...'}</div>
              <div className="preview-description">
                {description?.substring(0, 120) || 'Your ticket description...'}
                {description?.length > 120 ? '...' : ''}
              </div>
              <div className="preview-footer">
                <span
                  className="preview-priority"
                  style={{ borderColor: getPriorityColor(priority), color: getPriorityColor(priority) }}
                >
                  {priority}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketPage;
