// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Loading from "../dashboard/components/ui/loading/Laoding";



export default function ProtectedRoute({ children }: { children: Element }) {
  const { isAuthenticated ,loading  } = useAuth();
 if (loading) {
    // You can show a loading spinner here if you'd like
    return  <Loading/> ;
  }
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
