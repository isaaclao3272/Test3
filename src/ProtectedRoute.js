import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
    const { authToken } = useAuth();

    if (!authToken) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
