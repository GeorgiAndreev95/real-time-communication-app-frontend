import { useEffect } from "react";
import { socket } from "../socket";

import { addChannelMessage } from "../slices/channelSlice";
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

        // const handleDeletedMessage = (messageId: number) => {
        //     queryClient.setQueryData<Message[]>(
        //         ["channelMessages", channelId],
        //         (oldMessages) => {
        //             if (!oldMessages) {
        //                 return [];
        //             }

        //             return oldMessages.filter(
        //                 (oldMessage) => oldMessage.id != messageId
        //             );
        //         }
        //     );
        // };

        socket.emit("joinChannel", channelId);

        socket.on("newMessage", handleNewMessage);

        // socket.on("deleted_message", handleDeletedMessage);

        return () => {
            socket.emit("leaveChannel", channelId);
            socket.off("newMessage", handleNewMessage);
            // socket.off("deletedMessage", handleDeletedMessage);
        };
    }, [channelId, dispatch]);
};
