import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Alert, Collapse, Stack, Typography } from "@mui/material";
import { deleteAccount } from "../../api/api";
import styles from "./profile.module.css";
import { useDispatch } from "react-redux";
import { clearToken } from "../../redux/authSlice";
import { SendButton } from "../../components/SendButton";

export const DeleteAccount = ({ userID }: { userID?: number; }) => {
    const [safetyFieldError, setSafetyFieldError] = useState("");
    const [failureDelete, setFailureDelete] = useState("");
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(clearToken());
    };

    const handleDeleteAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        setSafetyFieldError("");
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if (data.get("safety") !== "Delete Account") {
            setSafetyFieldError("Write 'Delete Account' to confirm");
            return;
        }
        try {
            await deleteAccount(userID);
            handleLogout();
        } catch (error) {
            console.error(error);
            setFailureDelete("Failed to delete account");
        }
    };

    return (
        <Stack component={"form"} onSubmit={handleDeleteAccount}>
            <Typography width={440}>Deleting your account is irreversible. This will delete all your data and activities. </Typography>
            <Typography margin={"20px 0 0 0"} fontWeight={"bold"}>To confirm, type "Delete Account" in the field below.</Typography>
            <TextField
                margin="normal"
                className={styles.input}
                id="safety"
                label="Delete Account*"
                name="safety"
                error={!!safetyFieldError}
                helperText={safetyFieldError} 
            />
            <Collapse in={failureDelete === ""}>
                <Alert sx={{ width: "fit-content" }} severity="warning">This action is permanent</Alert>
            </Collapse>
            <Collapse in={!!failureDelete}>
                <Alert sx={{ width: "fit-content" }} severity="error">{failureDelete}</Alert>
            </Collapse>
            <SendButton name="Delete Account" />
        </Stack>
    );
};
