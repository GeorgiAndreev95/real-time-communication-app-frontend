import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { FaTrashCan, FaPen } from "react-icons/fa6";

import type { Message, ServerChannel, UserServer } from "../../types";
import {
    createMessage,
    getMessages,
    deleteMessage,
} from "../../services/messageService";
import { saveUserPreference } from "../../services/userPreferenceService";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useSocket } from "../../hooks/useSocket";
import {
    deleteChannelMessage,
    setChannelMessages,
} from "../../slices/channelSlice";
import classes from "./Channel.module.css";

const Channel = () => {
    const dispatch = useAppDispatch();
    const { serverId, channelId } = useParams();

    const [content, setContent] = useState("");
    const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

    const textareaRef = useRef<HTMLInputElement>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const messages = useAppSelector((state) => state.channel.channelMessages);
    const user = useAppSelector((state) => state.auth.user);
    const userServers: UserServer[] = useAppSelector(
        (state) => state.server.userServers
    );
    const channels: ServerChannel[] = useAppSelector(
        (state) => state.server.serverChannels
    );

    const selectedServer = userServers?.find(
        (server) => server.serverId === +channelId!
    );
    const userRole = selectedServer?.roleId;
    const canEdit = userRole === 1 || userRole === 2;
    const selectedChannel = channels?.find(
        (channel) => channel.id === +channelId!
    );
    const currentUserId = user.id;

    useSocket(+channelId!);

    const groupMessages = (
        messages: Message[],
        timeWindowMs = 5 * 60 * 1000
    ) => {
        const grouped: { sender: Message["sender"]; messages: Message[] }[] =
            [];

        for (const msg of messages) {
            const lastGroup = grouped[grouped.length - 1];

            if (
                lastGroup &&
                lastGroup.sender.id === msg.sender.id &&
                new Date(msg.createdAt).getTime() -
                    new Date(
                        lastGroup.messages[
                            lastGroup.messages.length - 1
                        ].createdAt
                    ).getTime() <
                    timeWindowMs
            ) {
                lastGroup.messages.push(msg);
            } else {
                grouped.push({ sender: msg.sender, messages: [msg] });
            }
        }

        return grouped;
    };

    const autoGrow = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";

            textarea.style.height = textarea.scrollHeight + "px";

            const maxHeight = 200;
            if (textarea.scrollHeight > maxHeight) {
                textarea.style.overflowY = "auto";
                textarea.style.height = maxHeight + "px";
            } else {
                textarea.style.overflowY = "hidden";
            }
        }
    };

    const handleDeleteClick = (messageId: number) => {
        setMessageToDelete(messageId);
        dialogRef.current?.showModal();
    };

    const onDeleteHandler = async (messageId: number) => {
        try {
            await deleteMessage(messageId);
            dispatch(deleteChannelMessage(messageId));
            setMessageToDelete(null);
            dialogRef.current?.close();
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContent(event.target.value);
        autoGrow();
    };

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await createMessage(+channelId!, content);
            setContent("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    useEffect(() => {
        const fetchMessagesAndSavePref = async () => {
            if (!serverId || !channelId) return;

            try {
                const channelMessages = await getMessages(+channelId!);
                dispatch(setChannelMessages(channelMessages));

                await saveUserPreference(+serverId!, +channelId!);
            } catch (err) {
                console.error(
                    "Error loading channel or saving preference:",
                    err
                );
            }
        };

        fetchMessagesAndSavePref();
    }, [channelId, dispatch, serverId]);

    useEffect(() => {
        autoGrow();
    }, [content]);

    return (
        <div className={classes.channelWrapper}>
            <div className={classes.channelContentWrapper}>
                <div className={classes.channelHeader}>
                    <h3 className={classes.channelTitle}>
                        {selectedChannel?.name}
                    </h3>
                </div>
                <div className={classes.messagesContainer}>
                    {groupMessages(messages).map((group, groupIndex) => {
                        const firstMsg = group.messages[0];
                        const restMsgs = group.messages.slice(1);
                        const date = new Date(
                            group.messages[0].createdAt
                        ).toLocaleString("en-GB", {
                            year: "2-digit",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        });

                        return (
                            <div
                                key={groupIndex}
                                className={classes.messageGroup}
                            >
                                <div className={classes.messageHeader}>
                                    <img
                                        className={classes.profilePicture}
                                        src={`http://localhost:3000${group.sender.profilePicture}`}
                                        alt={group.sender.username}
                                    />
                                    <div className={classes.contentWrapper}>
                                        <div
                                            className={classes.usernameAndDate}
                                        >
                                            <div className={classes.username}>
                                                {group.sender.username}
                                            </div>
                                            <div className={classes.date}>
                                                {date}
                                            </div>
                                        </div>
                                        <div className={classes.content}>
                                            <p>{firstMsg.content}</p>
                                            {(firstMsg.sender.id ===
                                                currentUserId ||
                                                canEdit) && (
                                                <div
                                                    className={
                                                        classes.buttonsWrapper
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            classes.editButton
                                                        }
                                                    >
                                                        <FaPen />
                                                    </div>
                                                    <div
                                                        className={
                                                            classes.deleteButton
                                                        }
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                firstMsg.id
                                                            )
                                                        }
                                                    >
                                                        <FaTrashCan />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {restMsgs.map((msg) => {
                                    const timePosted = new Date(
                                        msg.createdAt
                                    ).toLocaleString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });

                                    return (
                                        <div
                                            className={classes.singleMessage}
                                            key={msg.id}
                                        >
                                            <span
                                                className={`${classes.date} ${classes.hoverTime}`}
                                            >
                                                {timePosted}
                                            </span>
                                            <div
                                                className={
                                                    classes.groupedContent
                                                }
                                            >
                                                <p key={msg.id}>
                                                    {msg.content}
                                                </p>
                                                {msg.sender.id ===
                                                    currentUserId && (
                                                    <div
                                                        className={
                                                            classes.buttonsWrapper
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                classes.editButton
                                                            }
                                                        >
                                                            <FaPen />
                                                        </div>
                                                        <div
                                                            className={
                                                                classes.deleteButton
                                                            }
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    msg.id
                                                                )
                                                            }
                                                        >
                                                            <FaTrashCan />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                <form className={classes.inputForm} onSubmit={onSubmitHandler}>
                    <input
                        className={classes.inputField}
                        name="content"
                        required
                        placeholder={`Message #${selectedChannel?.name}`}
                        value={content}
                        onChange={onInputChange}
                        ref={textareaRef}
                        autoComplete="off"
                    />
                </form>

                <dialog ref={dialogRef}>
                    <div className={classes.dialogText}>
                        <h3>Delete Message</h3>
                        <p>Are you sure you want to delete this message?</p>
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
                            onClick={() => onDeleteHandler(messageToDelete!)}
                        >
                            Delete
                        </button>
                    </div>
                </dialog>
            </div>
        </div>
    );
};

export default Channel;
