import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";

import { FaCirclePlus } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";

import type { UserServer } from "../../types";
import { getUserServers } from "../../services/serverService";
import { getUserPreference } from "../../services/userPreferenceService";
import { setUserServers } from "../../slices/serverSlice";
import { setUser } from "../../slices/authSlice";
import classes from "./SideBar.module.css";

type SideBarProps = {
    onOpenModal: () => void;
    modalState: boolean;
};

const SideBar = ({ onOpenModal, modalState }: SideBarProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userServers = useAppSelector((state) => state.server.userServers);
    const { serverId } = useParams<{ serverId: string }>();

    useEffect(() => {
        const fetchUserServers = async () => {
            try {
                const data = await getUserServers();
                dispatch(setUserServers(data.userServers));
                console.log(data.userServers);
            } catch (error) {
                console.error("Error fetching servers:", error);
            }
        };

        fetchUserServers();
    }, [dispatch, modalState]);

    const serverClickHandler = async (server: UserServer) => {
        const serverId = server.serverId;

        try {
            let lastChannelId = await getUserPreference(serverId);

            lastChannelId =
                lastChannelId ??
                server.server.preferences?.[0]?.lastChannelId ??
                null;

            if (lastChannelId) {
                navigate(`/channels/${serverId}/${lastChannelId}`);
            }
        } catch (error) {
            console.error("Error navigating to server:", error);
        }
    };

    const logoutHandler = () => {
        dispatch(setUser(null));
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <>
            <div className={classes.sideBar}>
                <div className={classes.topContent}>
                    {userServers && (
                        <div className={classes.userServers}>
                            {userServers.map((server: UserServer) => {
                                const { image, name } = server.server;
                                const isActive = +serverId! === server.serverId;

                                return (
                                    <motion.div
                                        key={server.serverId}
                                        className={`${classes.userServer} ${
                                            isActive ? classes.active : ""
                                        }`}
                                        onClick={() =>
                                            serverClickHandler(server)
                                        }
                                        initial={false}
                                        whileHover={isActive ? {} : "hover"}
                                        animate={isActive ? "active" : "idle"}
                                    >
                                        <div
                                            className={classes.indicatorWrapper}
                                        >
                                            <motion.span
                                                className={
                                                    classes.selectIndicator
                                                }
                                                variants={{
                                                    idle: {
                                                        height: 20,
                                                        opacity: 0,
                                                    },
                                                    hover: {
                                                        height: 20,
                                                        opacity: 1,
                                                    },
                                                    active: {
                                                        height: 40,
                                                        opacity: 1,
                                                    },
                                                }}
                                                transition={{
                                                    type: "tween",
                                                    ease: "easeOut",
                                                    duration: 0.2,
                                                }}
                                            />
                                        </div>
                                        <div className={classes.serverWrapper}>
                                            {!server.server.image ? (
                                                <div
                                                    className={`${
                                                        classes.serverIcon
                                                    } ${
                                                        isActive
                                                            ? classes.selectedServer
                                                            : ""
                                                    }`}
                                                >
                                                    {name
                                                        .split(" ")
                                                        .map((word) =>
                                                            word.charAt(0)
                                                        )}
                                                </div>
                                            ) : (
                                                <img
                                                    src={`http://localhost:3000${image}`}
                                                    alt="Server icon"
                                                    className={
                                                        classes.serverIconImg
                                                    }
                                                />
                                            )}
                                            <span className={classes.tooltip}>
                                                {name}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                    <div className={classes.createServer}>
                        <div className={classes.createButtonWrapper}>
                            <a
                                className={classes.createButtonIcon}
                                onClick={onOpenModal}
                            >
                                <FaCirclePlus />
                                <span className={classes.tooltip}>
                                    Add a Server
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={classes.logoutButton}>
                    <div className={classes.logoutButtonWrapper}>
                        <a
                            className={classes.logoutButtonIcon}
                            onClick={logoutHandler}
                        >
                            <TbLogout />
                            <span className={classes.tooltip}>Log Out</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideBar;
