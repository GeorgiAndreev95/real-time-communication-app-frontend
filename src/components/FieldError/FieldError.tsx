import { AnimatePresence, motion } from "motion/react";

import classes from "./FieldError.module.css";

const FieldError = ({
    field,
    errors,
}: {
    field: string;
    errors: { path: string; msg: string }[];
}) => {
    const fieldErrors = errors.filter((e) => e.path === field);
    return (
        <AnimatePresence mode="wait">
            {fieldErrors.length > 0 && (
                <motion.div
                    key={`${field}-error`}
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 22, y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                    className={classes.errorMessage}
                >
                    {fieldErrors.map((e, i) => (
                        <span key={i}>{e.msg}</span>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FieldError;
