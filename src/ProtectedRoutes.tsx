import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "./hooks/reduxHooks";

const ProtectedRoutes = () => {
    const token = useAppSelector((state) => state.auth.token);

    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
