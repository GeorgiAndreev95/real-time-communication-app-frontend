export type ValidationError = { path?: string; msg?: string };

export type UserServer = {
    userId: number;
    serverId: number;
    roleId: number;
    server: {
        id: number;
        image: string | null;
        name: string;
        preferences?: {
            lastChannelId: number;
            lastChannel: {
                id: number;
                name: string;
            } | null;
        }[];
    };
};

export type ServerChannel = {
    id: number;
    name: string;
    serverId: number;
};

export type Sender = {
    id: number;
    profilePicture: string;
    username: string;
    memberships: {
        roleId: number;
        serverId: number;
    }[];
};

export type Message = {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    sender: Sender;
};
