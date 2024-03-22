import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { EditEventModal } from "./components/EditEventModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const Overview = (props: { event?: any; navigate?: any; onSubmit?: any; leaderboard?: any }) => {
    const authenticatedUser = useSelector((state: RootState) => state.user);

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
            <h1>Leaderboard for {props.event.name} </h1>
            <h2>
                {startDateFormatted} - {endDateFormatted}
            </h2>
            <Grid item>
                {authenticatedUser?.id === props.event.creator.id && (
                    <EditEventModal event={props.event} onSubmit={props.onSubmit}></EditEventModal>
                )}
            </Grid>
            <EventLeaderboard event={props.event} navigate={props.navigate} leaderboard={props.leaderboard} />
        </Box>
    );
};

function EventLeaderboard(props: { event?: any; navigate?: any; leaderboard: any }) {
    return (
        <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
            <Table>
                {props.event?.team_event ? (
                    <>
                        <TableHead>
                            <TableRow>
                                <TableCell>Rank</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell>Points</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.leaderboard?.length > 0 &&
                                props.leaderboard?.map((team: any, index: number) => {
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
                            {props.leaderboard?.length > 0 &&
                                props.leaderboard?.map((user: any, index: number) => {
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
    );
}
