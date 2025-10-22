import { useEffect, useState } from "react";
import { useParams } from "react-router";

import type { Message, ServerChannel } from "../../types";
import { createMessage, getMessages } from "../../services/messageService";
import { saveUserPreference } from "../../services/userPreferenceService";
import classes from "./Channel.module.css";
import { useAppSelector } from "../../hooks/reduxHooks";

const Channel = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");
    const { serverId, channelId } = useParams();
    const channels: ServerChannel[] = useAppSelector(
        (state) => state.server.serverChannels
    );
    const selectedChannel = channels?.find(
        (channel) => channel.id === +channelId!
    );

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

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContent(event.target.value);
    };

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await createMessage(+channelId!, content);
        setContent("");
    };

    useEffect(() => {
        const fetchMessagesAndSavePref = async () => {
            if (!serverId || !channelId) return;

            const channelMessages = await getMessages(+channelId!);
            setMessages(channelMessages.messages);

            saveUserPreference(+serverId!, +channelId).catch(console.error);
        };

        fetchMessagesAndSavePref();
    }, [channelId, serverId, messages]);

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
                                    <p
                                        key={msg.id}
                                        className={classes.groupedContent}
                                    >
                                        {msg.content}
                                    </p>
                                ))}
                            </div>
                        );
                    })}
                </div>

                <form className={classes.inputForm} onSubmit={onSubmitHandler}>
                    <input
                        className={classes.inputField}
                        type="text"
                        name="content"
                        required
                        placeholder={`Message #${selectedChannel?.name}`}
                        value={content}
                        onChange={onInputChange}
                        autoComplete="off"
                    />
                </form>
            </div>
        </div>
    );
};

export default Channel;
