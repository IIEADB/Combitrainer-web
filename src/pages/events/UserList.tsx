import {
    Box,
    Button,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
} from "@mui/material";
import styles from "./userlist.module.css";
import { useEffect, useState } from "react";
import { createInvitation, filteredUsers } from "../../api/api";
import { useNavigate } from "react-router-dom";

export const UserList = (props: { eventId?: string; participationList?: any }) => {
    const [userlist, setUserlist] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const [valueToOrderBy, setValueToOrderBy] = useState<string>("name");

    const navigate = useNavigate();

    const fetchUserList = async () => {
        try {
            const response = await filteredUsers(searchQuery);
            filterUserList(props.participationList, response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, [searchQuery]);

    const handleRequestSort = (property: string) => {
        const isAscending = valueToOrderBy === property && orderDirection === "asc";
        setValueToOrderBy(property);
        setOrderDirection(isAscending ? "desc" : "asc");
    };

    const handleSelectAllClick = (event: { target: { checked: boolean } }) => {
        if (event.target.checked) {
            const newSelecteds = userlist.map((n: { id: number }) => n.id!);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleAddUsers = async () => {
        try {
            await Promise.all(
                selected.map(async (userId) => {
                    const response = await createInvitation({
                        event: props.eventId,
                        to_user: userId,
                        joining_user: userId,
                    });
                    return response;
                })
            );
            navigate(0);
        } catch (error) {
            console.error(error);
        }
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
    const handleSearchInputChange = (event: { target: { value: string } }) => {
        setSearchQuery(event.target.value);
    };

    function filterUserList(invitationsData: any[], userList: User[]) {
        const updatedUserList = userList?.filter((user: Partial<User>) => {
            return !invitationsData.some(
                (request: Partial<EventParticipationRequest>) => request.joining_user?.id === user.id
            );
        });
        setUserlist(updatedUserList);
    }

    return (
        <Box>
            <Button
                variant="contained"
                color="info"
                onClick={() => {
                    setOpen(!open);
                }}
            >
                Add users
            </Button>
            {open && (
                <>
                    <h1 className={styles.title}>Add users</h1>
                    <Button disabled={selected.length === 0} variant="contained" onClick={() => handleAddUsers()}>
                        Send request to {selected.length} users
                    </Button>
                    <Box sx={{ backgroundColor: "white" }}>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <TextField
                                variant="outlined"
                                placeholder="Search..."
                                fullWidth
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                style={{ marginBottom: "20px" }} // Add some space below the search bar
                            />
                        </Box>
                        <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={selected.length > 0 && selected.length < userlist.length}
                                                checked={userlist.length > 0 && selected.length === userlist.length}
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userlist.map((user: User) => {
                                        const isItemSelected = isSelected(user.id);
                                        return (
                                            <TableRow
                                                key={user.id}
                                                hover
                                                onClick={() => handleClick(user.id)}
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
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            )}
        </Box>
    );
};
