import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "./hooks/reduxHooks";

const ProtectedRoutes = () => {
    const user = useAppSelector((state) => state.auth.user);

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
