import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import type { ServerChannel, UserServer } from "../../types";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { setServerChannels } from "../../slices/serverSlice";
import { getServerChannels } from "../../services/channelService";
import classes from "./ServerChannels.module.css";

type ServerChannelProps = {
    server?: UserServer;
};

const ServerChannels = ({ server }: ServerChannelProps) => {
    const [channels, setChannels] = useState<ServerChannel[]>([]);
    const { serverId, channelId } = useParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchChannels = async () => {
            if (!serverId) return;
            const data = await getServerChannels(+serverId);
            setChannels(data.serverChannels);
            dispatch(setServerChannels(data.serverChannels));
        };

        fetchChannels();
    }, [dispatch, serverId]);

    return (
        <div className={classes.channelsWrapper}>
            <div className={classes.channelsContentWrapper}>
                <div className={classes.serverName}>
                    <p>{server?.server.name}</p>
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
    );
};

export default ServerChannels;
