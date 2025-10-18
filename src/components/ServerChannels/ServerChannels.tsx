import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getServerChannels } from "../../services/channelService";
import type { ServerChannel, UserServer } from "../../types";
import classes from "./ServerChannels.module.css";

type ServerChannelProps = {
    server?: UserServer;
};

const ServerChannels = ({ server }: ServerChannelProps) => {
    const [channels, setChannels] = useState<ServerChannel[]>([]);
    const { serverId } = useParams();

    useEffect(() => {
        const getChannels = async () => {
            const channels = await getServerChannels(+serverId!);
            setChannels(channels.serverChannels);
        };

        getChannels();
    }, [serverId]);

    return (
        <div className={classes.channelsWrapper}>
            <div className={classes.channelsContentWrapper}>
                <div className={classes.serverName}>
                    <p>{server?.server.name}</p>
                </div>
                <div className={classes.channelsContainer}>
                    {channels.map((channel: ServerChannel) => {
                        return (
                            <Link
                                key={channel.id}
                                to={`${channel.id}`}
                                className={classes.channelName}
                            >
                                {channel.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ServerChannels;
