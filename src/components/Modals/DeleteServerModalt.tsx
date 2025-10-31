import { useState } from "react";
import { useParams } from "react-router";

import { deleteServer } from "../../services/serverService";
import classes from "./CreateChannelModal.module.css";

type DeleteUserServer = {
    onClose: () => void;
    serverName: string;
};

const DeleteServerModal = ({ onClose, serverName }: DeleteUserServer) => {
    const { serverId } = useParams();
    const [name, setName] = useState("");

    const isMatch = serverName === name;
    console.log(isMatch);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!isMatch) return;

        try {
            const { data } = await deleteServer(+serverId!);
            console.log(data);
        } catch (error) {
            console.error("Error deleting server:", error);
        }

        onClose();
    };

    return (
        <div className={classes.modalOverlay} onClick={onClose}>
            <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
                <div className={classes.textWrapper}>
                    <h3>Delete '{serverName}'</h3>

                    <div className={classes.warning}>
                        <p>
                            Are you sure you want to delete{" "}
                            <span>{serverName}</span>? This action cannot be
                            undone.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={classes.formWrapper}>
                    <div className={classes.formGroup}>
                        <label>Enter server name</label>
                        <input
                            type="text"
                            name="name"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {!isMatch && (
                            <div className={classes.errorMsg}>
                                You didn't enter the server name correctly
                            </div>
                        )}
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
                            Delete Server
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeleteServerModal;
