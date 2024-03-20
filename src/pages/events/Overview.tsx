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
import { EditEventModal } from "./EditEventModal";
import { useSelector } from "react-redux";

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
    const authenticatedUser = useSelector((state: RootState) => state.user);

    useEffect(() => {
        getLeaderboardData();
    }, []);

    const startDateFormatted = new Date(props.event.start_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const endDateFormatted = new Date(props.event.end_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return (
        <Box>
            <h1 className={styles.title}>Leaderboard for {props.event.name} </h1>
            <h2>
                {startDateFormatted} - {endDateFormatted}
            </h2>
            <Grid item>
                {authenticatedUser.id === props.event.creator.id && (
                    <EditEventModal event={props.event} navigate={props.navigate}></EditEventModal>
                )}
            </Grid>
            <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
                <Table>
                    {props.event.team_event ? (
                        <>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Rank</TableCell>
                                    <TableCell>Team</TableCell>
                                    <TableCell>Points</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaderboard.length > 0 &&
                                    leaderboard.map((team, index) => {
                                        return (
                                            <TableRow key={team.id} hover>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{team.team_name}</TableCell>
                                                <TableCell>{team.points}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </Table>
            </TableContainer>
        </Box>
    );
};
