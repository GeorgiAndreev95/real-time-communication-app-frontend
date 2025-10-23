import axiosInstance from "../../axiosInstance";

export const getMessages = async (channelId: number) => {
    try {
        const { data } = await axiosInstance.get(
            `/channel/${channelId}/message`
        );
        return data.messages;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createMessage = async (channelId: number, content: string) => {
    try {
        const { data } = await axiosInstance.post(
            `/channel/${channelId}/message`,
            {
                content,
            }
        );
        console.log(data.message);
        return data.message;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
