import { useEffect, useState } from "react";
import { useParams } from "react-router";

import type { Message, ServerChannel } from "../../types";
import { getMessages } from "../../services/messageService";
import { saveUserPreference } from "../../services/userPreferenceService";
import classes from "./Channel.module.css";
import { useAppSelector } from "../../hooks/reduxHooks";

const Channel = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const { serverId, channelId } = useParams();
    const channels: ServerChannel[] = useAppSelector(
        (state) => state.server.serverChannels
    );

    const selectedChannel = channels?.find(
        (channel) => channel.id === +channelId!
    );

    useEffect(() => {
        const fetchMessagesAndSavePref = async () => {
            if (!serverId || !channelId) return;

            const channelMessages = await getMessages(+channelId!);
            setMessages(channelMessages.messages);

            saveUserPreference(+serverId!, +channelId).catch(console.error);
        };

        fetchMessagesAndSavePref();
    }, [channelId, serverId]);

    return (
        <div className={classes.channelWrapper}>
            <div className={classes.channelContentWrapper}>
                <div className={classes.channelHeader}>
                    <h3 className={classes.channelTitle}>
                        {selectedChannel?.name}
                    </h3>
                </div>
                <div className={classes.messagesContainer}>
                    {messages.map((msg: Message) => {
                        const date = new Date(msg.createdAt).toLocaleString(
                            "en-GB"
                        );

                        return (
                            <div key={msg.id} className={classes.message}>
                                <img
                                    className={classes.profilePircture}
                                    src={`http://localhost:3000${msg.sender.profilePicture}`}
                                />
                                <div className={classes.contentWrapper}>
                                    <div className={classes.usernameAndDate}>
                                        <div className={classes.username}>
                                            {msg.sender.username}
                                        </div>
                                        <div className={classes.date}>
                                            {date}
                                        </div>
                                    </div>

                                    <p className={classes.content}>
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Channel;
