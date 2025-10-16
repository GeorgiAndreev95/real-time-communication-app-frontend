import { Outlet, useParams } from "react-router";

import type { UserServer } from "../../types";
import { useAppSelector } from "../../hooks/reduxHooks";
import ServerChannels from "../../components/ServerChannels/ServerChannels";
// import classes from "./Server.module.css";

const Server = () => {
    const { serverId } = useParams();
    const userServers = useAppSelector((state) => state.server.userServers);
    const server = userServers?.find(
        (server: UserServer) => server.server.id === +serverId!
    );

    return (
        <div>
            <ServerChannels server={server} />
            <Outlet />
        </div>
    );
};

export default Server;
