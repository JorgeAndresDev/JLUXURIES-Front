import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleBasedRouteProps {
    requiredRole: 'admin' | 'client';
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== requiredRole) {
        // Redirect to home if user doesn't have permission
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RoleBasedRoute;
