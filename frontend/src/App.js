import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import CreateTicketPage from './pages/CreateTicketPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="app-container">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/tickets"
              element={<PrivateRoute><TicketsPage /></PrivateRoute>}
            />
            <Route
              path="/tickets/:id"
              element={<PrivateRoute><TicketDetailPage /></PrivateRoute>}
            />
            <Route
              path="/tickets/create"
              element={<PrivateRoute><CreateTicketPage /></PrivateRoute>}
            />
            <Route path="/" element={<Navigate to="/tickets" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
