import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AuthRedirectProps {
  children: ReactNode;
}

/**
 * AuthRedirect component that redirects authenticated users to the tasks page
 * when they try to access the login or landing page.
 * Non-authenticated users can access these pages normally.
 */
const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is authenticated and trying to access login or home page, redirect to tasks
  if (isAuthenticated && (location.pathname === "/login" || location.pathname === "/")) {
    return <Navigate to="/tasks" replace />;
  }

  // Otherwise, render the children (login page or landing page)
  return <>{children}</>;
};

export default AuthRedirect;
