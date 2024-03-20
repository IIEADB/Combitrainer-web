import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createInvitation, deleteEvent, deleteInvitation, fetchInvitations } from "../../api/api";
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
import { UserList } from "./UserList";

export const Event = () => {
    const [participationList, setParticipationList] = useState([]);
    const [selected, setSelected] = useState([]);
    const [showUserList, setShowUserList] = useState(false);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const [valueToOrderBy, setValueToOrderBy] = useState<string>("name");
    const { eventId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const fetchEvent = async () => {
        try {
            setIsLoading(true);
            const response = await fetchInvitations(eventId);
            setParticipationList(
                response.data.sent_requests.accepted
                    .concat(response.data.received_requests.accepted)
                    .concat(response.data.sent_requests.pending.concat(response.data.received_requests.pending))
                    .concat(response.data.sent_requests.rejected.concat(response.data.received_requests.rejected))
            );
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
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
            const newSelecteds = participationList.map((n) => n.id);
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

    const handleDeleteEvent = async () => {
        try {
            await deleteEvent(eventId);
            navigate(`/dashboard/events/`, { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteUserInvitation = async () => {
        try {
            await Promise.all(
                selected.map(async (requestId) => {
                    let response = await deleteInvitation(requestId);
                    return response;
                })
            );
            navigate(0);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Grid container spacing={1} sx={{ margin: "10px" }}>
            <Grid item xs={6}>
                <h1 className={styles.title}>Event participation list</h1>
                <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            selected.length > 0 && selected.length < participationList.length
                                        }
                                        checked={
                                            participationList.length > 0 && selected.length === participationList.length
                                        }
                                        onChange={handleSelectAllClick}
                                    />
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
                                        Status
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {participationList.map((request) => {
                                const isItemSelected = isSelected(request.id);
                                return (
                                    <TableRow
                                        key={request.id}
                                        hover
                                        onClick={(event) => handleClick(event, request.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} />
                                        </TableCell>
                                        <TableCell>{request.joining_user.username}</TableCell>
                                        <TableCell>{request.status}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box>
                    {selected.length > 0 && (
                        <Button variant="contained" color="error" onClick={() => handleDeleteUserInvitation()}>
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
                </Box>
            </Grid>
            <Grid item xs={6}>
                {!isLoading && <UserList eventId={eventId} participationList={participationList} />}
            </Grid>
        </Grid>
    );
};
