import { useState } from "react";

import { createChannel } from "../../services/channelService";
import classes from "./CreateChannelModal.module.css";
import { useParams } from "react-router";

const CreateChannelModal = ({ onClose }: { onClose: () => void }) => {
    const { serverId } = useParams();
    const [name, setName] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const { data } = await createChannel(name, serverId!);
            console.log(data);
        } catch (error) {
            console.error("Error creating server:", error);
        }

        console.log("Creating server:", { name });
        onClose();
    };

    return (
        <div className={classes.modalOverlay} onClick={onClose}>
            <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
                <div className={classes.textWrapper}>
                    <h2>Create Channel</h2>
                </div>

                <form onSubmit={handleSubmit} className={classes.formWrapper}>
                    <div className={classes.formGroup}>
                        <label>Channel Name</label>
                        <input
                            type="text"
                            name="name"
                            autoComplete="off"
                            value={name}
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
                            Create Channel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateChannelModal;
