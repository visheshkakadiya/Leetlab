import { Navigate, Outlet } from "react-router-dom";
import { currentUser } from "../store/Slices/authSlice.js";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";

const AdminRoute = () => {

  const authUser = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth?.isLoading);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  if (authUser.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
export default AdminRoute