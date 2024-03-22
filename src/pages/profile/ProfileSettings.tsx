import { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    Box,
    Tab,
} from "@mui/material";
import { fetchUserProfile } from "../../api/api";
import styles from "./profile.module.css";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import imageOptions from "../../constants/ImageOptions";
import { ChangePassword } from "./ChangePassword";
import { DeleteAccount } from "./DeleteAccount";
import { UserSettings } from "./UserSettings";

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
            setUserData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

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
                <Box className={styles.contentContainer}>
                    <TabContext value={chosenTab}>
                        <Box className={styles.profileContainer}>
                            <img
                                src={imageOptions.find((image) => image.name === userData.image)?.source}
                                className={styles.avatar}
                            />
                            <TabList onChange={handleChange} aria-label="Settings Tabs" orientation="vertical">
                                <Tab label="Edit Profile" value="1" className={styles.tab} />
                                <Tab label="Change Password" value="2" className={styles.tab} />
                                <Tab label="Delete Account" value="3" className={styles.tab} />
                            </TabList>
                        </Box>
                        <Box className={styles.settingsContainer}>
                            <TabPanel value="1">
                                <UserSettings userData={userData} refresh={getUserData} />
                            </TabPanel>
                            <TabPanel value="2">
                                <ChangePassword userData={userData} />
                            </TabPanel>
                            <TabPanel value="3">
                                <DeleteAccount userID={userData.id} />
                            </TabPanel>
                        </Box>
                    </TabContext>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
