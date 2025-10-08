import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import { useAppDispatch } from "../../hooks/reduxHooks";
import { authenticate } from "../../services/authenticationService";
import classes from "./Login.module.css";
import { setToken } from "../../slices/authSlice";

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const user = await authenticate(email, password);
            dispatch(setToken(user.token));
            localStorage.setItem("userToken", user.token);
            localStorage.setItem("userRole", user.role);
            navigate("/home");
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
            console.error(error);
        }
    };

    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>
        setEmail(event.target.value);
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>
        setPassword(event.target.value);

    return (
        <div className={classes.loginContainer}>
            <form className={classes.loginForm} onSubmit={onSubmitHandler}>
                <div>
                    <h1>Welcome back!</h1>
                    <p>We're so excited to see you again!</p>
                </div>
                <div>
                    <div>
                        <p>
                            Email
                            {errorMsg ? (
                                <span> - Login or password is invalid</span>
                            ) : (
                                ""
                            )}
                        </p>
                        <input
                            className={classes.loginEmail}
                            name="email"
                            type="email"
                            required
                            placeholder="Email"
                            value={email}
                            onChange={onEmailChangeHandler}
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <p>Password</p>
                        <input
                            className={classes.loginPassword}
                            name="password"
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={onPasswordChangeHandler}
                            autoComplete="current-password"
                        />
                    </div>

                    <button className={classes.loginButton} type="submit">
                        Log In
                    </button>
                    <div>
                        <span>Need an account?</span>
                        <button type="button">Register</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
