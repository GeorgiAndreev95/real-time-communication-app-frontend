import { Outlet } from "react-router";

import classes from "./AuthLayout.module.css";

export default function AuthLayout() {
    return (
        <div className={classes.container}>
            <div className={classes.card}>
                <Outlet />
            </div>
        </div>
    );
}
