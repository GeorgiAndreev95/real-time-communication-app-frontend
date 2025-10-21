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
    };
};

export type ServerChannel = {
    id: number;
    name: string;
    serverId: number;
};

export type Message = {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    sender: {
        id: number;
        profilePicture: string;
        username: string;
    };
};
