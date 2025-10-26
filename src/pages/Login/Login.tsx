import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";

import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { authenticate } from "../../services/authenticationService";
import { setUser } from "../../slices/authSlice";
import classes from "./Login.module.css";

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [navigate, user]);

    const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const user = await authenticate(email, password);
            dispatch(setUser(user));
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/");
        } catch (error: unknown) {
            let errorMsg;

            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.errors
                    ? error.response.data.errors[0].msg
                    : error.response?.data?.message || errorMsg;
            } else if (error instanceof Error) {
                errorMsg = error.message;
            }

            setErrorMsg(errorMsg);
            return;
        }
    };

    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>
        setEmail(event.target.value);
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>
        setPassword(event.target.value);

    return (
        <div className={classes.loginContainer}>
            <div className={classes.loginWrapper}>
                <form className={classes.loginForm} onSubmit={onSubmitHandler}>
                    <div className={classes.loginHeader}>
                        <h1>Welcome back!</h1>
                        <p>We're so excited to see you again!</p>
                    </div>
                    <div className={classes.inputFields}>
                        <div className={classes.inputBlock}>
                            <h2
                                className={`${classes.message} ${
                                    errorMsg ? classes.error : ""
                                }`}
                            >
                                Email
                                {errorMsg ? (
                                    <span className={classes.errorMessage}>
                                        {" "}
                                        - Login or password is invalid
                                    </span>
                                ) : (
                                    <span className={classes.required}>*</span>
                                )}
                            </h2>
                            <input
                                className={`${classes.inputField} ${
                                    errorMsg ? classes.errorBorder : ""
                                }`}
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={onEmailChangeHandler}
                                autoComplete="username"
                            />
                        </div>
                        <div className={classes.inputBlock}>
                            <h2
                                className={`${classes.message} ${
                                    errorMsg ? classes.error : ""
                                }`}
                            >
                                Password
                                <span className={classes.required}>*</span>
                            </h2>
                            <input
                                className={`${classes.inputField} ${
                                    errorMsg ? classes.errorBorder : ""
                                }`}
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={onPasswordChangeHandler}
                                autoComplete="current-password"
                            />
                        </div>

                        <button className={classes.loginButton} type="submit">
                            Log In
                        </button>
                        <div>
                            <span className={classes.needAccount}>
                                Need an account?
                            </span>
                            <Link
                                to="/signup"
                                className={classes.registerButton}
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
