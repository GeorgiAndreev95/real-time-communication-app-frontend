import axiosInstance from "../../axiosInstance.ts";

export const getUserServers = async () => {
    try {
        const { data } = await axiosInstance.get("/server");

        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createServer = async (name: string, image: File) => {
    try {
        const { data } = await axiosInstance.post("/server", {
            name,
            image,
        });

        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
