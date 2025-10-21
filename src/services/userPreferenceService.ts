import axiosInstance from "../../axiosInstance";

export const saveUserPreference = async (
    serverId: number,
    channelId: number
) => {
    try {
        const { data } = await axiosInstance.post(
            `/server/${serverId}/${channelId}/preference`
        );
        return data;
    } catch (error) {
        console.error("Error saving preference:", error);
        throw error;
    }
};

export const getUserPreference = async (serverId: number) => {
    try {
        const { data } = await axiosInstance.get(
            `/server/${serverId}/preference`
        );

        return data.lastChannelId || null;
    } catch (error) {
        console.error("Error fetching user preference:", error);
        throw error;
    }
};
