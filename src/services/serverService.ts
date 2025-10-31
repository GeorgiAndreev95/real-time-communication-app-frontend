import axiosInstance from "../../axiosInstance.ts";

export const getUserServers = async () => {
    try {
        const { data } = await axiosInstance.get("/server");
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createServer = async (name: string, image: File | null) => {
    try {
        const formData = new FormData();
        formData.append("name", name);
        if (image) {
            formData.append("image", image);
        }

        const { data } = await axiosInstance.post("/server", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteServer = async (id: number) => {
    try {
        const { data } = await axiosInstance.delete(`/server/${id}`);
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
