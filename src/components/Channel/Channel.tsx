import { useEffect, useState } from "react";
import { useParams } from "react-router";

import type { Message, ServerChannel } from "../../types";
import { getServerChannels } from "../../services/channelService";
import { getMessages } from "../../services/messageService";
import { useAppDispatch } from "../../hooks/reduxHooks";
import classes from "./Channel.module.css";
import { setSelectedChannels } from "../../slices/serverSlice";

const Channel = () => {
    const dispatch = useAppDispatch();
    const [messages, setMessages] = useState([]);
    const [channels, setChannels] = useState<ServerChannel[]>([]);
    const { serverId, channelId } = useParams();
    const selectedChannel = channels?.find(
        (channel) => channel.id === +channelId!
    );

    useEffect(() => {
        const fetchChannels = async () => {
            const data = await getServerChannels(+serverId!);
            setChannels(data.serverChannels);
        };

        fetchChannels();
    }, [serverId]);

    useEffect(() => {
        const fetchMessages = async () => {
            const channelMessages = await getMessages(+channelId!);
            setMessages(channelMessages.messages);
        };

        fetchMessages();
    }, [channelId]);

    useEffect(() => {
        if (serverId && channelId) {
            dispatch(
                setSelectedChannels({
                    serverId: +serverId,
                    channelId: +channelId,
                })
            );
        }
    }, [channelId, dispatch, serverId]);

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
