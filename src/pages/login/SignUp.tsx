import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CompanyLogo } from "../../components/CompanyLogo";
import { signUp } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useState } from "react";

const defaultTheme = createTheme();

export default function SignUp() {
    const navigate = useNavigate();

    const [errorUsername, setErrorUsername] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        handleSignUp(data.get("username") as string, data.get("email") as string, data.get("password") as string);
    };

    const handleSignUp = async (username: string, email: string, password: string) => {
        setErrorUsername("");
        setErrorEmail("");
        setErrorPassword("");
        await signUp({
            username: username,
            email: email,
            password: password,
        })
            .then(() => {
                navigate("/", { replace: true });
            })
            .catch((error: AxiosError) => {
                const responseData = error.response?.data as { message: { [key: string]: string } };
                if (responseData && responseData.message) {
                    if ("username" in responseData.message) {
                        setErrorUsername(responseData.message.username);
                    }
                    if ("email" in responseData.message) {
                        setErrorEmail(responseData.message.email);
                    }
                    if ("password" in responseData.message) {
                        setErrorPassword(responseData.message.password);
                    }
                } else {
                    setErrorEmail("Something went wrong, please try again");
                    setErrorPassword("Something went wrong, please try again");
                    setErrorUsername("Something went wrong, please try again");
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
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="username"
                                    name="username"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoFocus
                                    error={!!errorUsername}
                                    helperText={errorUsername}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    error={!!errorEmail}
                                    helperText={errorEmail}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    error={!!errorPassword}
                                    helperText={errorPassword}
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
