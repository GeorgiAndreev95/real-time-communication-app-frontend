import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router";

import { FaCirclePlus } from "react-icons/fa6";

import type { UserServer } from "../../types";
import { getUserServers } from "../../services/serverService";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { setUserServers } from "../../slices/serverSlice";
import classes from "./SideBar.module.css";

const SideBar = () => {
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
                console.log(data.userServers);
                dispatch(setUserServers(data.userServers));
            } catch (error) {
                console.error("Error fetching servers:", error);
            }
        };

        fetchUserServers();
    }, [dispatch]);

    useEffect(() => {
        if (!serverId) return;

        setAnimateState("transitioning");

        const timeout = setTimeout(() => {
            setAnimateState("selected");
        }, 50);

        return () => clearTimeout(timeout);
    }, [serverId]);

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
                                    className={classes.userServer}
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
                                        <Link
                                            to={`/server/${server.serverId}`}
                                            className={classes.serverIcon}
                                        >
                                            {!image
                                                ? name.charAt(0).toUpperCase()
                                                : image}
                                            <span className={classes.tooltip}>
                                                {name}
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className={classes.createServer}>
                    <div className={classes.createButtonWrapper}>
                        <Link
                            to="/server/create"
                            className={classes.createButtonIcon}
                        >
                            <FaCirclePlus />
                            <span className={classes.tooltip}>
                                Add a Server
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
};

export default SideBar;
