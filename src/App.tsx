import { Routes, Route } from "react-router";
import Login from "./components/Login/Login";

function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
            <p>Placeholder</p>
        </>
    );
}

export default App;
