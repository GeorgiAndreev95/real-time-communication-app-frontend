import axiosInstance from "../../axiosInstance.ts";

export const authenticate = async (email: string, password: string) => {
    try {
        const { data } = await axiosInstance.post("/user/login", {
            email,
            password,
        });
        console.log(data);
        return data.user;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const signup = async (
    email: string,
    username: string,
    password: string,
    confirmPassword: string
) => {
    try {
        const { data } = await axiosInstance.post("/user/signup", {
            email,
            username,
            password,
            confirmPassword,
        });
        console.log(data);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
