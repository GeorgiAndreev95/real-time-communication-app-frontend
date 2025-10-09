import { Routes, Route } from "react-router";
import Login from "./components/Login/Login";
import AuthLayout from "./components/AuthLayout/AuthLayout";

function App() {
    return (
        <>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
