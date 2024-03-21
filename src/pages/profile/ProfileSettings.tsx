import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Alert, Box, Collapse, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Tab } from "@mui/material";
import { fetchUserProfile, updateUserProfile } from "../../api/api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import styles from "./profile.module.css";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import imageOptions from "../../constants/ImageOptions";
import { AxiosError } from "axios";

const defaultTheme = createTheme();

export default function ProfileSettings() {

    const [userData, setUserData] = useState({
        id: undefined,
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        image: "",
        private: undefined,
        visible_on_leaderboard: undefined,
    } as Partial<User>);


    const getUserData = async () => {
        try {
            const response = await fetchUserProfile();
            console.log(response.data);
            setUserData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    const [chosenTab, setChosenTab] = useState("1");

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setChosenTab(newValue);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CssBaseline />
                <Box
                    className={styles.contentContainer}
                >
                    <TabContext value={chosenTab}>
                        <Box className={styles.profileContainer}>
                            <img src={imageOptions.find((image) => image.name === userData.image)?.source} className={styles.avatar}/>
                            <TabList onChange={handleChange} aria-label="Settings Tabs" orientation="vertical">
                                <Tab label="Edit Profile" value="1" className={styles.tab}/>
                                <Tab label="Change Password" value="2" className={styles.tab}/>
                            </TabList>
                        </Box>
                        <Box className={styles.settingsContainer}>
                            <TabPanel value="1">
                                <UserSettings 
                                    userData={userData}
                                    refresh={getUserData}
                                    />
                            </TabPanel>
                            <TabPanel value="2">
                                <ChangePassword 
                                    userData={userData}
                                />
                            </TabPanel>
                        </Box>
                    </TabContext>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

const ChangePassword = ({ userData }: {userData: Partial<User>}) => {
    
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
            })
            setSuccessUpdate("Password changed successfully");
        }
        catch (error) {
            const aError = error as AxiosError
            if (aError.response?.status === 400) {
                const message = aError.response?.data as { message: { [key: string]: string }};
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

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return <Stack component="form" onSubmit={handleSubmit} noValidate>
        <Collapse in={!!failureUpdate}>
            <Alert severity="error">{failureUpdate}</Alert>
        </Collapse>
        <Collapse in={!!successUpdate}>
            <Alert severity="success">{successUpdate}</Alert>
        </Collapse>
        <PasswordInput
            errorLogin={oldPasswordError}
            name="Old Password"
            showPassword={showPassword}
            handleClickShowPassword={handleClickShowPassword}
            handleMouseDownPassword={handleMouseDownPassword} />
        <PasswordInput
            errorLogin={newPasswordError}
            name="New Password"
            showPassword={showPassword}
            handleClickShowPassword={handleClickShowPassword}
            handleMouseDownPassword={handleMouseDownPassword} />
        <Button type="submit" variant="contained" className={styles.sendButton}>
            Save
        </Button>
    </Stack>;
}
const UserSettings = ({userData, refresh} : {userData: Partial<User>, refresh: () => void}) => {
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
            })
            setSuccessUpdate("User profile updated");
            refresh();
        }
        catch (error) {
            setFailureUpdate("Failed to update user profile");
        }


    };

    if (userData.id === undefined) {
        return <></>;
    }
    return <Stack component="form" onSubmit={handleSubmit} noValidate >
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
            autoFocus
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
                autoFocus
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
                autoFocus
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
            autoFocus
        />
        <Button type="submit" variant="contained" className={styles.sendButton}>
            Save
        </Button>
    </Stack>;
}

function PasswordInput(
    {
        errorLogin = "",
        showPassword,
        handleClickShowPassword,
        handleMouseDownPassword,
        name,
    }: { 
        errorLogin?: string,
        showPassword: boolean, 
        handleClickShowPassword: () => void, 
        handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => void,
        name: string 
    }
) {
    return (
        <FormControl 
            margin="normal" 
            required 
            variant="outlined"
            className={styles.input}
        >
            <InputLabel 
                htmlFor="password" 
                error={!!errorLogin}
            >
                {name}
            </InputLabel>
            <OutlinedInput
                id={name}
                label={name}
                name={name}
                autoComplete={name}
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
            <FormHelperText 
                id="password-helper-text" 
                error={!!errorLogin}
            >
                {errorLogin}
            </FormHelperText>
        </FormControl>
    );
}

