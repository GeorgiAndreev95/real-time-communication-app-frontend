import { Routes, Route, useLocation } from "react-router";

import Login from "./components/Login/Login";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import Signup from "./components/Signup/Signup";
import { AnimatePresence, motion } from "motion/react";

function App() {
    const location = useLocation();

    return (
        <>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route element={<AuthLayout />}>
                        <Route
                            path="/login"
                            element={
                                <motion.div
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
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <motion.div
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
                            }
                        />
                    </Route>
                </Routes>
            </AnimatePresence>
        </>
    );
}

export default App;
