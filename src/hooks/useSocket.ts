import { useEffect } from "react";
import { socket } from "../socket";

import {
    addChannelMessage,
    editChannelMessage,
    deleteChannelMessage,
} from "../slices/channelSlice";
import { useAppDispatch } from "./reduxHooks";
import type { Message } from "../types";

export const useSocket = (channelId: number | undefined) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!channelId) {
            return;
        }

        if (!socket.connected) {
            socket.connect();
            console.log("Connected");
        }

        const handleNewMessage = (newMessage: Message) => {
            dispatch(addChannelMessage(newMessage));
        };

        const handleMessageEdited = (updatedMessage: Message) => {
            dispatch(editChannelMessage(updatedMessage));
        };

        const handleMessageDeleted = ({ messageId }: { messageId: number }) => {
            dispatch(deleteChannelMessage(messageId));
        };

        socket.emit("joinChannel", channelId);

        socket.on("newMessage", handleNewMessage);
        socket.on("messageEdited", handleMessageEdited);
        socket.on("messageDeleted", handleMessageDeleted);

        return () => {
            socket.emit("leaveChannel", channelId);
            socket.off("newMessage", handleNewMessage);
            socket.off("messageEdited", handleMessageEdited);
            socket.off("messageDeleted", handleMessageDeleted);
        };
    }, [channelId, dispatch]);
};
