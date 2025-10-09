import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
// import { useAppSelector } from "../../hooks/reduxHooks";
import axios from "axios";

import { signup } from "../../services/authenticationService";
import FieldError from "../FieldError/FieldError";
import classes from "./Signup.module.css";

import type { ValidationError } from "../../types";

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errors, setErrors] = useState<{ path: string; msg: string }[]>([]);

    // const token = useAppSelector((state) => state.auth.token);

    // useEffect(() => {
    //     if (token) {
    //         navigate("/home");
    //     }
    // }, [navigate, token]);

    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>
        setEmail(event.target.value);
    const onUsernameChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>
        setUsername(event.target.value);
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>
        setPassword(event.target.value);
    const onConfirmPasswordChangeHandler = (
        event: ChangeEvent<HTMLInputElement>
    ) => setConfirmPassword(event.target.value);

    const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMsg("");

        try {
            await signup(email, username, password, confirmPassword);

            setSuccessMsg(
                "Account created successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                Array.isArray(error.response?.data?.errors)
            ) {
                const errorsData: ValidationError[] =
                    error.response.data.errors;

                const formatted = errorsData.map((err) => ({
                    path: err.path || "",
                    msg: err.msg || "Unknown error",
                }));
                setErrors(formatted);
            } else {
                setErrors([
                    {
                        path: "",
                        msg: "Something went wrong. Please try again.",
                    },
                ]);
            }
        }
    };

    const getErrorsFor = (field: string) =>
        errors.filter(
            (err) => err.path === field || (!err.path && field === "global")
        );

    return (
        <div className={classes.signupContainer}>
            <div className={classes.signupWrapper}>
                <form className={classes.signupForm} onSubmit={onSubmitHandler}>
                    <h1>Create an account</h1>
                    <div className={classes.inputFields}>
                        <div className={classes.inputBlock}>
                            <h2 className={classes.message}>
                                Email<span className={classes.required}>*</span>
                            </h2>
                            <input
                                className={`${classes.inputField} ${
                                    getErrorsFor("email").length
                                        ? classes.errorBorder
                                        : ""
                                }`}
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={onEmailChangeHandler}
                                autoComplete="username"
                            />

                            {getErrorsFor("email").length > 0 && (
                                <FieldError field="email" errors={errors} />
                            )}
                        </div>
                        <div className={classes.inputBlock}>
                            <h2 className={classes.message}>
                                Username
                                <span className={classes.required}>*</span>
                            </h2>
                            <input
                                className={`${classes.inputField} ${
                                    getErrorsFor("username").length
                                        ? classes.errorBorder
                                        : ""
                                }`}
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={onUsernameChangeHandler}
                                autoComplete="off"
                            />
                            {getErrorsFor("username").length > 0 && (
                                <FieldError field="username" errors={errors} />
                            )}
                        </div>
                        <div className={classes.inputBlock}>
                            <h2 className={classes.message}>
                                Password
                                <span className={classes.required}>*</span>
                            </h2>
                            <input
                                className={`${classes.inputField} ${
                                    getErrorsFor("password").length
                                        ? classes.errorBorder
                                        : ""
                                }`}
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={onPasswordChangeHandler}
                                autoComplete="current-password"
                            />
                            {getErrorsFor("password").length > 0 && (
                                <FieldError field="password" errors={errors} />
                            )}
                        </div>
                        <div className={classes.inputBlock}>
                            <h2 className={classes.message}>
                                Confirm Password
                                <span className={classes.required}>*</span>
                            </h2>
                            <input
                                className={`${classes.inputField} ${
                                    getErrorsFor("confirmPassword").length
                                        ? classes.errorBorder
                                        : ""
                                }`}
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={onConfirmPasswordChangeHandler}
                                autoComplete="off"
                            />
                            {getErrorsFor("confirmPassword").length > 0 && (
                                <FieldError
                                    field="confirmPassword"
                                    errors={errors}
                                />
                            )}
                        </div>

                        {successMsg && (
                            <motion.p
                                key="success-msg"
                                className={classes.successMessage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                            >
                                {successMsg}
                            </motion.p>
                        )}

                        <button className={classes.signupButton} type="submit">
                            Create Account
                        </button>
                        <Link to="/login" className={classes.loginButton}>
                            Already have an account? Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
