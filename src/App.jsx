import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Workshop from './pages/Workshop';
import Foundry from './pages/Foundry';
import Myr from './pages/Myr';
import Archive from './pages/Archive';
import Login from './pages/Login';

const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();
    // For development/MVP, we might want to bypass auth if needed, but per requirements:
    // "Security rules should restrict write access to only authenticated users"
    // For now, let's redirect to login if not authenticated.
    return currentUser ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="workshop" element={<Workshop />} />
                        <Route path="foundry" element={<Foundry />} />
                        <Route path="myr" element={<Myr />} />
                        <Route path="archive" element={<Archive />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
