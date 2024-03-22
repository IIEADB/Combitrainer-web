import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { clearToken, setIsOTPVerified, setToken } from "../../redux/authSlice";
import { authenticate, refresh } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CompanyLogo } from "../../components/CompanyLogo";
import { RootState, store } from "../../redux/store";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { AxiosError } from "axios";

const defaultTheme = createTheme();

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorLogin, setErrorLogin] = useState("");

    const isAuthenticated = useSelector((state: RootState) => state.isAuthenticated);
    useEffect(() => {
        if (isAuthenticated) {
            handleRefreshToken();
        }
    });

    const handleRefreshToken = async () => {
        const refreshToken = store.getState().refreshToken;
        try {
            const response = await refresh({ refresh: refreshToken });
            const auth = store.getState();
            store.dispatch(
                setToken({
                    token: response.data.access,
                    refreshToken: auth.refreshToken,
                    user: auth.user,
                })
            );
            navigate("/dashboard/profile", { replace: true });
        } catch (error) {
            store.dispatch(clearToken());
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        handleLogin(data.get("username") as string, data.get("password") as string);
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = async (username: string, password: string) => {
        await authenticate({
            username: username,
            password: password,
        })
            .then((response) => {
                const isVerified = response.data.user.is_verified || false;

                dispatch(setIsOTPVerified(isVerified));
                dispatch(
                    setToken({
                        token: response.data.access,
                        refreshToken: response.data.refresh,
                        user: response.data.user,
                    })
                );
                navigate("/dashboard/profile", { replace: true });
            })
            .catch((error: AxiosError) => {
                const responseData = error.response?.data as { message: { [key: string]: string } };
                if (responseData && responseData.message) {
                    setErrorLogin("Credentials are not valid");
                } else {
                    setErrorLogin(error.message);
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
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            error={!!errorLogin}
                            helperText={errorLogin}
                        />
                        <FormControl margin="normal" required fullWidth variant="outlined">
                            <InputLabel htmlFor="password" error={!!errorLogin}>
                                Password
                            </InputLabel>
                            <OutlinedInput
                                id="password"
                                label="Password"
                                name="password"
                                autoComplete="password"
                                type={showPassword ? "text" : "password"}
                                error={!!errorLogin}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <FormHelperText id="password-helper-text" error={!!errorLogin}>
                                {errorLogin}
                            </FormHelperText>
                        </FormControl>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/forgotpassword" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
