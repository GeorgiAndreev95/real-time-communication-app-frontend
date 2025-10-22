import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import AuthLayout from "./pages/AuthLayout/AuthLayout";
import MainPage from "./pages/MainPage/MainPage";
import Server from "./pages/Server/Server";
import NoServerSelected from "./components/NoSelectedServer/NoServerSelected";
import NoChannelSelected from "./components/NoChannelSelected/NoChannelSelected";
import ProtectedRoutes from "./ProtectedRoutes";
import Channel from "./components/Channel/Channel";

function App() {
    const location = useLocation();

    return (
        <>
            <Routes location={location}>
                <Route element={<AuthLayout />}>
                    <Route
                        path="/login"
                        element={
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.key}
                                    initial={{ opacity: 0, y: -40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -40 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "backOut",
                                    }}
                                >
                                    <Login />
                                </motion.div>
                            </AnimatePresence>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.key}
                                    initial={{ opacity: 0, y: -40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -40 }}
                                    transition={{
                                        duration: 0.33,
                                        ease: "backOut",
                                    }}
                                >
                                    <Signup />
                                </motion.div>
                            </AnimatePresence>
                        }
                    />
                </Route>
                <Route element={<ProtectedRoutes />}>
                    <Route path="/" element={<MainPage />}>
                        <Route index element={<NoServerSelected />} />
                        <Route path="/channels/:serverId" element={<Server />}>
                            <Route index element={<NoChannelSelected />} />
                            <Route path=":channelId" element={<Channel />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
