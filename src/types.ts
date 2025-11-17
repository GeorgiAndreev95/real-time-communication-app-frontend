export type ValidationError = { path?: string; msg?: string };

export type UserServer = {
    userId: number;
    serverId: number;
    roleId: number;
    server: {
        id: number;
        image: string | null;
        name: string;
        channels: {
            id: number;
            name: string;
        }[];
        memberships: ServerMember[];
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

export type ServerMember = {
    roleId: number;
    user: {
        id: number;
        username: string;
        profilePicture: string;
    };
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
