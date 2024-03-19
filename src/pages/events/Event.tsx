import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createInvitation, deleteEvent, fetchLeaderboard } from "../../api/api";
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
    TableSortLabel,
} from "@mui/material";
import styles from "./events.module.css";
import { UserList } from "../../components/UserList";

export const Event = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [selected, setSelected] = useState([]);
    const [showUserList, setShowUserList] = useState(false);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const [valueToOrderBy, setValueToOrderBy] = useState<string>("name");
    const { eventId } = useParams();
    const navigate = useNavigate();
    const fetchEvent = async () => {
        try {
            const response = await fetchLeaderboard(eventId, 30, 1);
            setLeaderboard(response.data.leaderboard);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const handleRequestSort = (property: string) => {
        const isAscending = valueToOrderBy === property && orderDirection === "asc";
        setValueToOrderBy(property);
        setOrderDirection(isAscending ? "desc" : "asc");
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = leaderboard.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const handleAddUsers = async (userIds: number[]) => {
        try {
            userIds.map(async (id) => {
                Promise.all([await createInvitation(id)]);
            });
            setLeaderboard(response.data.leaderboard);
            setShowUserList(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteEvent = async () => {
        try {
            await deleteEvent(eventId);
            navigate(`/dashboard/events/`, { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Grid container spacing={1} sx={{ margin: "10px" }}>
            <Grid item xs={6}>
                <h1 className={styles.title}>Event Leaderboard</h1>
                <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < leaderboard.length}
                                        checked={leaderboard.length > 0 && selected.length === leaderboard.length}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={valueToOrderBy === "id"}
                                        direction={valueToOrderBy === "id" ? orderDirection : "asc"}
                                        onClick={() => handleRequestSort("id")}
                                    >
                                        ID
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={valueToOrderBy === "name"}
                                        direction={valueToOrderBy === "name" ? orderDirection : "asc"}
                                        onClick={() => handleRequestSort("name")}
                                    >
                                        Username
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={valueToOrderBy === "points"}
                                        direction={valueToOrderBy === "points" ? orderDirection : "asc"}
                                        onClick={() => handleRequestSort("points")}
                                    >
                                        Points
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaderboard.map((user) => {
                                const isItemSelected = isSelected(user.id);
                                return (
                                    <TableRow
                                        key={user.id}
                                        hover
                                        onClick={(event) => handleClick(event, user.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} />
                                        </TableCell>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.points}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box>
                    {selected.length > 0 && (
                        <Button variant="contained" color="error" onClick={() => {}}>
                            Remove {selected.length} user(s)
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteEvent();
                        }}
                    >
                        Delete event
                    </Button>
                    <Button
                        variant="contained"
                        color="info"
                        onClick={() => {
                            setShowUserList(!showUserList);
                        }}
                    >
                        Add users
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={6}>
                {showUserList && (
                    <UserList
                        onSubmit={(userList) => {
                            handleAddUsers(userList), setShowUserList(!showUserList);
                        }}
                        onClose={() => setShowUserList(false)}
                    />
                )}
            </Grid>
        </Grid>
    );
};
