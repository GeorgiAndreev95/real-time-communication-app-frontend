import { useState } from "react";
import { useParams } from "react-router";

import type { ServerChannel } from "../../types";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { updateServerChannel } from "../../slices/serverSlice";
import { createChannel, updateChannel } from "../../services/channelService";
import classes from "./CreateChannelModal.module.css";

type ChannelModalProps = {
    onClose: () => void;
    labelText: string;
    channel: ServerChannel | null;
};

const CreateChannelModal = ({
    onClose,
    labelText,
    channel,
}: ChannelModalProps) => {
    const dispatch = useAppDispatch();
    const { serverId } = useParams();
    const [name, setName] = useState("");

    const isCreating = labelText === "Create Channel";

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isCreating) {
            try {
                const { data } = await createChannel(name, serverId!);
                console.log(data);
            } catch (error) {
                console.error("Error creating server:", error);
            }
        } else {
            try {
                const data = await updateChannel(channel!.id, name);
                dispatch(updateServerChannel(data.channel));
            } catch (error) {
                console.error("Error updating server:", error);
            }
        }

        console.log("Creating server:", { name });
        onClose();
    };

    return (
        <div className={classes.modalOverlay} onClick={onClose}>
            <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
                <div className={classes.textWrapper}>
                    <h2>{labelText}</h2>
                </div>

                <form onSubmit={handleSubmit} className={classes.formWrapper}>
                    <div className={classes.formGroup}>
                        <label>Channel Name</label>
                        <input
                            type="text"
                            name="name"
                            autoComplete="off"
                            value={name}
                            placeholder={channel?.name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className={classes.modalActions}>
                        <button
                            className={classes.cancelBtn}
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${classes.submitBtn} ${
                                name.length === 0 ? classes.disabled : ""
                            }`}
                        >
                            {labelText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateChannelModal;
