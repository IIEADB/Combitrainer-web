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
import { otpResend, otpVerify } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { clearToken, setIsOTPVerified } from "../../redux/authSlice";
import { useState, useEffect } from "react";
import { RootState } from "../../redux/store";
import { Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const defaultTheme = createTheme();

export default function OTP() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const RESEND_SUCCESS = "OTP resent successfully";

    const isLoggedIn = useSelector((state: RootState) => state.isAuthenticated);
    const isVerified = useSelector((state: RootState) => state.isOTPVerified);

    const [message, setMessage] = useState("");

    useEffect(() => {
        if (isLoggedIn && isVerified) {
            navigate("/dashboard/profile", { replace: true });
        } else if (!isLoggedIn) {
            navigate("/", { replace: true });
        }
    });

    const [errorOTP, setErrorOTP] = useState("");
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        handleSignUp(data.get("otp") as string);
    };

    const handleSignUp = async (otp: string) => {
        setErrorOTP("");
        await otpVerify({
            otp: otp,
        })
            .then(() => {
                dispatch(setIsOTPVerified(true));
                navigate("/dashboard/profile", { replace: true });
            })
            .catch((error: AxiosError) => {
                const responseData = error.response?.data as { message: string };
                if (responseData && responseData.message) {
                    setErrorOTP(responseData.message);
                } else {
                    setErrorOTP("Something went wrong, please try again");
                }
            });
    };

    const handleLogout = () => {
        dispatch(clearToken());
        navigate("/", { replace: true });
    };

    const handleResendOTP = async () => {
        setErrorOTP("");
        await otpResend()
            .then(() => {
                setMessage(RESEND_SUCCESS);
            })
            .catch((error: AxiosError) => {
                const responseData = error.response?.data as { message: string };
                if (responseData && responseData.message) {
                    setMessage(responseData.message);
                } else {
                    setMessage("Something went wrong, please try again");
                }
            });
    };

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
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, minWidth: "100%" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="otp"
                                    name="otp"
                                    required
                                    fullWidth
                                    id="otp"
                                    label="OTP"
                                    autoFocus
                                    error={!!errorOTP}
                                    helperText={errorOTP}
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign Up
                        </Button>
                        <Collapse in={!!message}>
                            <Alert
                                icon={RESEND_SUCCESS == message && <CheckIcon fontSize="inherit" />}
                                severity={RESEND_SUCCESS == message ? "success" : "error"}
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setMessage("");
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                            >
                                {message}
                            </Alert>
                        </Collapse>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Button type="button" onClick={() => handleResendOTP()} sx={{ mt: 3, mb: 2 }}>
                                    Resend Code
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button type="button" onClick={() => handleLogout()} sx={{ mt: 3, mb: 2 }}>
                                    Log Out
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
