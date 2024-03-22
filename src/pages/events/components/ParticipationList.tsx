import { useState } from "react";
import { deleteInvitation } from "../../../api/api";
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

export const ParticipationList = (props: { participationList: never[]; navigate: any; onSubmit?: any }) => {
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const [valueToOrderBy, setValueToOrderBy] = useState<string>("name");
    const [selected, setSelected] = useState<number[]>([]);

    const handleRequestSort = (property: string) => {
        const isAscending = valueToOrderBy === property && orderDirection === "asc";
        setValueToOrderBy(property);
        setOrderDirection(isAscending ? "desc" : "asc");
    };

    const handleSelectAllClick = (event: { target: { checked: boolean } }) => {
        if (event.target.checked) {
            const newSelecteds = props.participationList.map((n) => n.id!);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

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

    const handleDeleteUserInvitation = async () => {
        try {
            await Promise.all(
                selected.map(async (requestId) => {
                    const response = await deleteInvitation(requestId);
                    return response;
                })
            );
            props.onSubmit();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Grid item xs={6}>
            <h1>Event participation list</h1>
            <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={
                                        selected.length > 0 && selected.length < props.participationList.length
                                    }
                                    checked={
                                        props.participationList.length > 0 &&
                                        selected.length === props.participationList.length
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
                        {props.participationList.map(
                            (request: { id: number; joining_user: { username: string }; status: string }) => {
                                const isItemSelected = isSelected(request.id);
                                return (
                                    <TableRow
                                        key={request.id}
                                        hover
                                        onClick={() => handleClick(request.id)}
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
                            }
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box>
                {selected.length > 0 && (
                    <Button variant="contained" color="error" onClick={() => handleDeleteUserInvitation()}>
                        Remove {selected.length} user(s)
                    </Button>
                )}
            </Box>
        </Grid>
    );
};
