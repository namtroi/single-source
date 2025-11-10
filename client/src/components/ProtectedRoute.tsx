import type { PropsWithChildren, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../app/store';

// This component protects routes that require authentication
export default function ProtectedRoute({ children }: PropsWithChildren): ReactElement | null {
  const { isAuthenticated} = useSelector((s: RootState) => s.auth);
  const location = useLocation();

  // If you track auth hydration/loading, prevent flicker:
  if (status === 'loading') {
    return <div>Checking session…</div>;
  }
// Redirect unauthenticated users to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

   // If no child component is passed, render nothing
  if (!children) return null;

  // Render the protected child component
  return children as ReactElement;
}