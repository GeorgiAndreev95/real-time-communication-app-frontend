import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useAppDispatch } from "../../hooks/reduxHooks";
import { deleteServer } from "../../services/serverService";
import { removeUserServer } from "../../slices/serverSlice";
import classes from "./DeleteServerModal.module.css";

type DeleteUserServer = {
    onClose: () => void;
    serverName: string;
};

const DeleteServerModal = ({ onClose, serverName }: DeleteUserServer) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { serverId } = useParams();
    const [name, setName] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (name.trim().toLowerCase() !== serverName.toLowerCase()) {
            setErrorMsg("You didn't enter the server name correctly");
            return;
        }

        try {
            await deleteServer(+serverId!);
            dispatch(removeUserServer(+serverId!));
            navigate("/");
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
                            <span className={classes.serverName}>
                                {serverName}
                            </span>
                            ? This action cannot be undone.
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
                        {errorMsg && (
                            <div className={classes.errorMsg}>{errorMsg}</div>
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
