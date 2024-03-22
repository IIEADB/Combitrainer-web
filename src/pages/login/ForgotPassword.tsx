import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { CompanyLogo } from "../../components/CompanyLogo";
import { otpResend, otpVerify, passwordResetRequest, passwordResetVerifyAndChange } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { clearToken, setIsOTPVerified } from "../../redux/authSlice";
import { useState, useEffect } from "react";
import { RootState } from "../../redux/store";
import { Collapse, IconButton, Link, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PasswordInput } from "../../components/PasswordInput";
import { SendButton } from "../../components/SendButton";

const defaultTheme = createTheme();

export default function ForgotPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const SEND_SUCCESS = "A new code has been sent to your email address";

    const [hasSentMail, setHasSentMail] = useState(false); 
    const [emailAddress, setEmailAddress] = useState("");

    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");



    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (hasSentMail) {
            handleChangePassword(data.get("otp") as string, data.get("New Password") as string, emailAddress);
        }
        else {
            handleSendEmail(data.get("email") as string);
        }
    };

    const handleSendEmail = async (email: string) => {
        setErrorEmail("");
        setEmailAddress("");
        await passwordResetRequest({
            email: email,
        })
            .then(() => {
                setHasSentMail(true);
                setEmailAddress(email);
            })
            .catch((error: AxiosError) => {
                const responseData = error.response?.data as { message: string };
                if (responseData && responseData.message) {
                    setErrorEmail(responseData.message);
                } else {
                    setErrorEmail("Something went wrong, please try again");
                }
            });
    };

    const handleChangePassword = async (otp: string, password: string, email: string) => {
        setErrorPassword("");
        await passwordResetVerifyAndChange({
            otp: otp,
            email: email,
            password: password,
        })
            .then(() => {
                navigate("/");
            })
            .catch((error: AxiosError) => {
                const responseData = error.response?.data as { message: string };
                if (responseData && responseData.message) {
                    setErrorPassword(responseData.message);
                } else {
                    setErrorPassword("Something went wrong, please try again");
                }
            });
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <CompanyLogo />
                    <Typography>Enter your email address and we will send you a code to reset your password</Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, minWidth: "100%" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    autoComplete="email"
                                    name="email"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    autoFocus
                                    error={!!errorEmail}
                                    helperText={errorEmail}
                                    disabled={hasSentMail}
                                />
                            </Grid>
                        </Grid>
                        <Collapse in={hasSentMail}>
                            <Alert  severity="success">
                                A new code has been sent to your email address
                            </Alert>
                            <TextField
                                margin="normal"
                                autoComplete="otp"
                                name="otp"
                                required
                                fullWidth
                                id="otp"
                                label="OTP"
                            />
                            <PasswordInput
                                passwordError=""
                                name="New Password"
                            />
                            <Collapse in={errorPassword !== ""}>
                                <Alert severity="error">{errorPassword}</Alert>
                            </Collapse>
                        </Collapse>
                        <SendButton
                            fullWidth = {true}
                            name={hasSentMail ? "Change Password" : "Request Code"}
                        />
                            
                        
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/" sx={{ mt: 3, mb: 2 }}>
                                    Back to login
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
