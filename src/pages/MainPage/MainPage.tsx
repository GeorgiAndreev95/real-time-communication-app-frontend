import { useState } from "react";

import SideBar from "../../components/SideBar/SideBar";
import CreateServerModal from "../../components/CreateServerModal/CreateServerModal";
// import classes from "./MainPage.module.css";

const MainPage = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <main>
            <SideBar
                onOpenModal={() => setShowModal(true)}
                modalState={showModal}
            />
            {showModal && (
                <CreateServerModal onClose={() => setShowModal(false)} />
            )}
        </main>
    );
};

export default MainPage;
