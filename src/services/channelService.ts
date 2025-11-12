import axiosInstance from "../../axiosInstance.ts";

export const getServerChannels = async (serverId: number) => {
    try {
        const { data } = await axiosInstance.get(`/server/${serverId}/channel`);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createChannel = async (name: string, serverId: string) => {
    try {
        const { data } = await axiosInstance.post(
            `/server/${serverId}/channel`,
            {
                name,
                serverId,
            }
        );

        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateChannel = async (channelId: string, name: string) => {
    try {
        const { data } = await axiosInstance.put(
            `server/channel/${channelId}`,
            {
                name,
            }
        );
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteChannel = async (channelId: number) => {
    try {
        const response = await axiosInstance.delete(
            `server/channel/${channelId}`
        );
        console.log(response);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
