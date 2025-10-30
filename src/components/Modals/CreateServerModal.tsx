import { useState, type ChangeEvent } from "react";
import { BiSolidCamera } from "react-icons/bi";

import { createServer } from "../../services/serverService";
import classes from "./CreateServerModal.module.css";

const CreateServerModal = ({ onClose }: { onClose: () => void }) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    // const [fileName, setFileName] = useState<string>("No file chosen");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const { data } = await createServer(name, image);
            console.log(data);
        } catch (error) {
            console.error("Error creating server:", error);
        }

        console.log("Creating server:", { name, image });
        onClose();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;
        if (selectedFile) {
            // setFileName(selectedFile.name);
            setImage(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            console.log(image);
        } else {
            // setFileName("No file chosen");
            setImage(null);
            setPreviewUrl(null);
        }
    };

    return (
        <div className={classes.modalOverlay} onClick={onClose}>
            <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
                <div className={classes.textWrapper}>
                    <h2>Create Your Server</h2>
                    <p>
                        Your server is where you and your friends hang out. Make
                        yours and start chatting.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={classes.formWrapper}>
                    <div className={classes.formGroupOne}>
                        <label
                            htmlFor="file-upload"
                            className={`${classes.customFileButton} ${
                                previewUrl ? classes.previewUrl : ""
                            }`}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Server preview"
                                    className={classes.previewImage}
                                />
                            ) : (
                                <>
                                    <BiSolidCamera
                                        className={classes.cameraImg}
                                    />
                                    <p>UPLOAD</p>
                                </>
                            )}
                        </label>
                        <input
                            className={classes.hiddenFileUpload}
                            type="file"
                            name="image"
                            id="file-upload"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className={classes.formGroupTwo}>
                        <label>
                            Server Name
                            <span className={classes.required}>*</span>
                        </label>
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
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateServerModal;
