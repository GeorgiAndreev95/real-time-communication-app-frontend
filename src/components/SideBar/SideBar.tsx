import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";

import { FaCirclePlus } from "react-icons/fa6";

import type { UserServer } from "../../types";
import { getUserServers } from "../../services/serverService";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { setUserServers } from "../../slices/serverSlice";
import classes from "./SideBar.module.css";
import { getUserPreference } from "../../services/userPreferenceService";

type SideBarProps = {
    onOpenModal: () => void;
    modalState: boolean;
};

const SideBar = ({ onOpenModal, modalState }: SideBarProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userServers = useAppSelector((state) => state.server.userServers);
    const { serverId } = useParams<{ serverId: string }>();

    const [animateState, setAnimateState] = useState<
        "idle" | "transitioning" | "selected"
    >("idle");

    useEffect(() => {
        const fetchUserServers = async () => {
            try {
                const data = await getUserServers();
                dispatch(setUserServers(data.userServers));
            } catch (error) {
                console.error("Error fetching servers:", error);
            }
        };

        fetchUserServers();
    }, [dispatch, modalState]);

    useEffect(() => {
        if (!serverId) return;

        setAnimateState("transitioning");

        const timeout = setTimeout(() => {
            setAnimateState("selected");
        }, 50);

        return () => clearTimeout(timeout);
    }, [serverId]);

    const handleServerClick = async (server: UserServer) => {
        const serverId = server.serverId;

        try {
            let lastChannelId = await getUserPreference(serverId);

            if (!lastChannelId && server.server.channels?.length) {
                lastChannelId = server.server.channels[0].id;
            }

            if (lastChannelId) {
                navigate(`/channels/${serverId}/${lastChannelId}`);
            }
        } catch (error) {
            console.error("Error navigating to server:", error);
        }
    };

    return (
        <>
            <div className={classes.sideBar}>
                {userServers && (
                    <div className={classes.userServers}>
                        {userServers.map((server: UserServer) => {
                            const { image, name } = server.server;
                            const isActive = +serverId! === server.serverId;
                            const isTransitioning =
                                animateState === "transitioning";
                            return (
                                <div
                                    key={server.serverId}
                                    className={`${classes.userServer} ${
                                        isActive ? classes.active : ""
                                    }`}
                                    onClick={() => handleServerClick(server)}
                                >
                                    <div className={classes.indicatorWrapper}>
                                        <span
                                            className={`${
                                                classes.selectIndicator
                                            } ${
                                                isTransitioning
                                                    ? classes.transitioning
                                                    : ""
                                            } ${
                                                isActive &&
                                                animateState === "selected"
                                                    ? classes.selected
                                                    : ""
                                            }`}
                                        ></span>
                                    </div>
                                    <div className={classes.serverWrapper}>
                                        {!server.server.image ? (
                                            <div className={classes.serverIcon}>
                                                {name.charAt(0).toUpperCase()}
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
                                    </div>
                                </div>
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
            <Outlet />
        </>
    );
};

export default SideBar;
