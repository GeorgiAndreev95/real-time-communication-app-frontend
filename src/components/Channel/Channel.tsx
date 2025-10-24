import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { BsThreeDots } from "react-icons/bs";

import type { Message, ServerChannel } from "../../types";
import { createMessage, getMessages } from "../../services/messageService";
import { saveUserPreference } from "../../services/userPreferenceService";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useSocket } from "../../hooks/useSocket";
import { setChannelMessages } from "../../slices/channelSlice";
import classes from "./Channel.module.css";

const Channel = () => {
    const dispatch = useAppDispatch();
    const [content, setContent] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { serverId, channelId } = useParams();
    const messages = useAppSelector((state) => state.channel.channelMessages);
    const channels: ServerChannel[] = useAppSelector(
        (state) => state.server.serverChannels
    );
    const selectedChannel = channels?.find(
        (channel) => channel.id === +channelId!
    );

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

            // Optional: If you want to limit the growth, you can check:
            const maxHeight = 200; // e.g. 200 pixels
            if (textarea.scrollHeight > maxHeight) {
                textarea.style.overflowY = "auto"; // Re-enable scrolling when max height is hit
                textarea.style.height = maxHeight + "px";
            } else {
                textarea.style.overflowY = "hidden"; // Keep scrollbar hidden while growing
            }
        }
    };

    const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

            const channelMessages = await getMessages(+channelId!);
            dispatch(setChannelMessages(channelMessages));

            saveUserPreference(+serverId!, +channelId).catch(console.error);
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
                        const firstMsg = group.messages[0].content;
                        const restMsgs = group.messages.slice(1);
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
                                                {new Date(
                                                    group.messages[0].createdAt
                                                ).toLocaleString("en-GB", {
                                                    year: "2-digit",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                })}
                                            </div>
                                        </div>
                                        <p className={classes.content}>
                                            {firstMsg}
                                        </p>
                                    </div>
                                </div>

                                {restMsgs.map((msg) => (
                                    <div className={classes.singleMessage}>
                                        <span
                                            className={`${classes.date} ${classes.hoverTime}`}
                                        >
                                            {new Date(
                                                msg.createdAt
                                            ).toLocaleString("en-GB", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                        <div className={classes.groupedContent}>
                                            <p
                                                key={msg.id}
                                                // className={
                                                //     classes.groupedContent
                                                // }
                                            >
                                                {msg.content}
                                            </p>
                                            <div className={classes.moreButton}>
                                                <BsThreeDots />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>

                <form className={classes.inputForm} onSubmit={onSubmitHandler}>
                    <textarea
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
            </div>
        </div>
    );
};

export default Channel;
