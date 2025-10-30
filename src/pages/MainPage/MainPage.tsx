import { useState } from "react";

import SideBar from "../../components/SideBar/SideBar";
import CreateServerModal from "../../components/Modals/CreateServerModal";
import classes from "./MainPage.module.css";
import { Outlet } from "react-router";

const MainPage = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <main className={classes.mainPage}>
            <SideBar
                onOpenModal={() => setShowModal(true)}
                modalState={showModal}
            />
            <Outlet />

            {showModal && (
                <CreateServerModal onClose={() => setShowModal(false)} />
            )}
        </main>
    );
};

export default MainPage;
