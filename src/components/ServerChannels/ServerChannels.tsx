import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";

import { MdKeyboardArrowDown, MdClose } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

import type { ServerChannel, UserServer } from "../../types";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { setServerChannels } from "../../slices/serverSlice";
import { getServerChannels } from "../../services/channelService";
import classes from "./ServerChannels.module.css";
import CreateChannelModal from "../Modals/CreateChannelModal";

type ServerChannelProps = {
    server?: UserServer;
};

const ServerChannels = ({ server }: ServerChannelProps) => {
    const dispatch = useAppDispatch();
    const { serverId, channelId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [channels, setChannels] = useState<ServerChannel[]>([]);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const onDropdownClickHandler = () => {
        setIsOpen((prev) => !prev);
    };

    const onCloseHandler = () => {
        setShowModal(false);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const fetchChannels = async () => {
            if (!serverId) return;
            const data = await getServerChannels(+serverId);
            setChannels(data.serverChannels);
            dispatch(setServerChannels(data.serverChannels));
        };

        fetchChannels();
    }, [dispatch, serverId, showModal]);

    return (
        <>
            <div className={classes.channelsWrapper}>
                <div className={classes.channelsContentWrapper}>
                    <div
                        className={classes.serverNameWrapper}
                        ref={dropdownRef}
                    >
                        <div
                            className={classes.serverName}
                            onClick={onDropdownClickHandler}
                        >
                            <p>{server?.server.name}</p>
                            <div className={classes.openMenuIcon}>
                                {!isOpen ? (
                                    <MdKeyboardArrowDown />
                                ) : (
                                    <MdClose />
                                )}
                            </div>
                        </div>

                        {isOpen && (
                            <div className={classes.dropdownMenuWrapper}>
                                <motion.div
                                    className={classes.dropdownMenu}
                                    initial={{
                                        opacity: 0,
                                        height: 0,
                                        scale: 0,
                                        transformOrigin: "top center",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        height: 200,
                                        scale: 1,
                                    }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "backOut",
                                    }}
                                >
                                    <div
                                        className={classes.createChannelBtn}
                                        onClick={() => setShowModal(true)}
                                    >
                                        <p>Create Channel</p>
                                        <FaCirclePlus
                                            className={
                                                classes.createChannelIcon
                                            }
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                    <div className={classes.channelsContainer}>
                        {channels.map((channel: ServerChannel) => {
                            const isSelected = +channelId! === channel.id;
                            return (
                                <Link
                                    key={channel.id}
                                    to={`${channel.id}`}
                                    className={`${classes.channelName} ${
                                        isSelected ? classes.selected : ""
                                    }`}
                                >
                                    {channel.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {showModal && <CreateChannelModal onClose={onCloseHandler} />}
        </>
    );
};

export default ServerChannels;
