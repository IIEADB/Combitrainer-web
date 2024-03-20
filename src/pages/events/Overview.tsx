import { deleteEvent, fetchLeaderboard } from "../../api/api";
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import styles from "./events.module.css";

export const Overview = (props: { event?: any; navigate?: any }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const getLeaderboardData = async () => {
        try {
            const response = await fetchLeaderboard(props.event.id, "9999", 1);
            setLeaderboard(response.data.leaderboard);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getLeaderboardData();
    }, []);

    const handleDeleteEvent = async () => {
        try {
            await deleteEvent(props.event.id);
            props.navigate(`/dashboard/events/`, { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box>
            <h1 className={styles.title}>Leaderboard for {props.event.name} </h1>
            <Grid item>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        handleDeleteEvent();
                    }}
                >
                    Delete event
                </Button>
            </Grid>
            <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboard.length > 0 &&
                            leaderboard.map((user, index) => {
                                return (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.points}</TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
