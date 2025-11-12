import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";

import { MdKeyboardArrowDown, MdClose } from "react-icons/md";
import { FaCirclePlus, FaTrashCan, FaPen } from "react-icons/fa6";

import type { ServerChannel, UserServer } from "../../types";
import { useAppDispatch } from "../../hooks/reduxHooks";
import {
    deleteServerChannel,
    setServerChannels,
} from "../../slices/serverSlice";
import {
    deleteChannel,
    getServerChannels,
} from "../../services/channelService";
import classes from "./ServerChannels.module.css";
import CreateChannelModal from "../Modals/CreateChannelModal";
import DeleteServerModal from "../Modals/DeleteServerModalt";

type ServerChannelProps = {
    server: UserServer;
};

const ServerChannels = ({ server }: ServerChannelProps) => {
    const dispatch = useAppDispatch();
    const { serverId, channelId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [showDeleteServerModal, setShowDeleteServerModal] = useState(false);
    const [channels, setChannels] = useState<ServerChannel[]>([]);
    const [channelToDelete, setChannelToDelete] =
        useState<ServerChannel | null>(null);

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const onDropdownClickHandler = () => {
        setIsOpen((prev) => !prev);
    };

    const onCloseChannelModalHandler = () => {
        setShowCreateChannelModal(false);
        setIsOpen(false);
    };

    const onCloseDeleteModalHandler = () => {
        setShowDeleteServerModal(false);
        setIsOpen(false);
    };

    const handleDeleteClick = (channel: ServerChannel) => {
        setChannelToDelete(channel);
        dialogRef.current?.showModal();
    };

    const onDeleteHandler = async (channelId: number) => {
        try {
            await deleteChannel(channelId);
            dispatch(deleteServerChannel(channelId));

            setChannels((prev) =>
                prev.filter((channel) => channel.id !== channelId)
            );

            setChannelToDelete(null);
            dialogRef.current?.close();
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
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
    }, [dispatch, serverId, showCreateChannelModal]);

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
                                        className={classes.dropdownBtn}
                                        onClick={() =>
                                            setShowCreateChannelModal(true)
                                        }
                                    >
                                        <p>Create Channel</p>
                                        <FaCirclePlus
                                            className={
                                                classes.createChannelIcon
                                            }
                                        />
                                    </div>
                                    <div
                                        className={classes.dropdownDeleteBtn}
                                        onClick={() =>
                                            setShowDeleteServerModal(true)
                                        }
                                    >
                                        <p>Delete Server</p>
                                        <FaTrashCan
                                            className={classes.deleteServerIcon}
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
                                <>
                                    <Link
                                        key={channel.id}
                                        to={`${channel.id}`}
                                        className={`${classes.channelName} ${
                                            isSelected ? classes.selected : ""
                                        }`}
                                    >
                                        <p>{channel.name}</p>
                                        <div className={classes.buttonsWrapper}>
                                            <div className={classes.editButton}>
                                                <FaPen />
                                            </div>
                                            <div
                                                className={classes.deleteButton}
                                                onClick={() =>
                                                    handleDeleteClick(channel)
                                                }
                                            >
                                                <FaTrashCan />
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            );
                        })}
                    </div>
                </div>
                <dialog ref={dialogRef}>
                    {channelToDelete && (
                        <>
                            <div className={classes.dialogText}>
                                <h3>Delete Channel</h3>
                                <p>
                                    Are you sure you want to delete{" "}
                                    <span className={classes.modalChannelName}>
                                        {channelToDelete!.name}
                                    </span>
                                    ? This cannot be undone.
                                </p>
                            </div>

                            <div className={classes.dialogButtons}>
                                <button
                                    className={classes.cancelBtn}
                                    onClick={() => dialogRef.current?.close()}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={classes.confirmBtn}
                                    onClick={() =>
                                        onDeleteHandler(channelToDelete.id)
                                    }
                                >
                                    Delete Channel
                                </button>
                            </div>
                        </>
                    )}
                </dialog>
            </div>

            {showCreateChannelModal && (
                <CreateChannelModal onClose={onCloseChannelModalHandler} />
            )}
            {showDeleteServerModal && (
                <DeleteServerModal
                    onClose={onCloseDeleteModalHandler}
                    serverName={server!.server.name}
                />
            )}
        </>
    );
};

export default ServerChannels;
