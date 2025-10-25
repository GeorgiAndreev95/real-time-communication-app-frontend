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

export const editMessage = async (messageId: number, content: string) => {
    try {
        const { data } = await axiosInstance.put(`/message/${messageId}`, {
            content,
        });
        return data.updatedMessage;
    } catch (error) {
        console.error("Error editing message:", error);
        throw error;
    }
};

export const deleteMessage = async (messageId: number) => {
    try {
        const { data } = await axiosInstance.delete(`/message/${messageId}`);
        return data.message;
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
    }
};
