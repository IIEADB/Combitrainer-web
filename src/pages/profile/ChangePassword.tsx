import { useState } from "react";
import { Alert, Collapse, Stack } from "@mui/material";
import { updateUserProfile } from "../../api/api";
import { AxiosError } from "axios";
import { PasswordInput } from "../../components/PasswordInput";
import { SendButton } from "../../components/SendButton";

export const ChangePassword = ({ userData }: { userData: Partial<User>; }) => {
    const [failureUpdate, setFailureUpdate] = useState("");
    const [successUpdate, setSuccessUpdate] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setSuccessUpdate("");
        setFailureUpdate("");
        setNewPasswordError("");
        setOldPasswordError("");
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            await updateUserProfile({
                username: userData.username,
                email: userData.email,
                oldPassword: data.get("Old Password") as string,
                password: data.get("New Password") as string,
            });
            setSuccessUpdate("Password changed successfully");
        } catch (error) {
            const aError = error as AxiosError;
            if (aError.response?.status === 400) {
                const message = aError.response?.data as { message: { [key: string]: string; }; };
                if ("password" in message.message) {
                    setNewPasswordError(message.message.password);
                }
            }
            if (aError.response?.status === 401) {
                setOldPasswordError("Wrong password");
            }
            console.error(error);
            setFailureUpdate("Failed to change password");
        }
    };

    return (
        <Stack component="form" onSubmit={handleSubmit} noValidate>
            <Collapse in={!!failureUpdate}>
                <Alert severity="error">{failureUpdate}</Alert>
            </Collapse>
            <Collapse in={!!successUpdate}>
                <Alert severity="success">{successUpdate}</Alert>
            </Collapse>
            <PasswordInput
                passwordError={oldPasswordError}
                name="Old Password"
            />
            <PasswordInput
                passwordError={newPasswordError}
                name="New Password"
            />
            <SendButton
                name="Save"
            />
        </Stack>
    );
};