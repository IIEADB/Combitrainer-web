import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Alert, Collapse, Stack } from "@mui/material";
import { updateUserProfile } from "../../api/api";
import styles from "./profile.module.css";
import { SendButton } from "../../components/SendButton";

export const UserSettings = ({ userData, refresh }: { userData: Partial<User>; refresh: () => void; }) => {
    const [failureUpdate, setFailureUpdate] = useState("");
    const [successUpdate, setSuccessUpdate] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setFailureUpdate("");
        setSuccessUpdate("");
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            await updateUserProfile({
                username: data.get("Username") as string,
                first_name: data.get("FirstName") as string,
                last_name: data.get("LastName") as string,
                email: data.get("Email") as string,
            });
            setSuccessUpdate("User profile updated");
            refresh();
        } catch (error) {
            setFailureUpdate("Failed to update user profile");
        }
    };

    if (userData.id === undefined) {
        return <></>;
    }
    return (
        <Stack component="form" onSubmit={handleSubmit} noValidate>
            <Collapse in={failureUpdate !== ""}>
                <Alert severity="error">{failureUpdate}</Alert>
            </Collapse>
            <Collapse in={successUpdate !== ""}>
                <Alert severity="success">{successUpdate}</Alert>
            </Collapse>
            <TextField
                className={styles.input}
                defaultValue={userData.username}
                margin="normal"
                required
                id="Username"
                label="Username"
                name="Username"
                autoComplete="Username"
            />
            <div className={styles.row}>
                <TextField
                    className={styles.input}
                    defaultValue={userData.first_name}
                    margin="normal"
                    required
                    id="FirstName"
                    label="First Name"
                    name="FirstName"
                    autoComplete="FirstName"
                />
                <TextField
                    className={styles.input}
                    defaultValue={userData.last_name}
                    margin="normal"
                    required
                    id="LastName"
                    label="Last Name"
                    name="LastName"
                    autoComplete="LastName"
                />
            </div>
            <TextField
                className={styles.input}
                defaultValue={userData.email}
                margin="normal"
                required
                id="Email"
                label="Email"
                name="Email"
                autoComplete="Email"
            />
            <SendButton name="Update Profile" />
        </Stack>
    );
};
