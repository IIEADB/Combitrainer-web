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
    TextField,
} from "@mui/material";
import styles from "./userlist.module.css";
import { useEffect, useState } from "react";
import { filteredUsers } from "../api/api";

export const UserList = (props: { onSubmit: (ids: number[]) => void; onClose: () => void }) => {
    const [userlist, setUserlist] = useState([]);
    const [selected, setSelected] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const [valueToOrderBy, setValueToOrderBy] = useState<string>("name");

    const fetchUserList = async () => {
        try {
            const response = await filteredUsers(searchQuery);
            setUserlist(response.data);
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

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = userlist.map((n) => n.id);
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

    const isSelected = (id) => selected.indexOf(id) !== -1;
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <Box>
            <h1 className={styles.title}>Add users</h1>
            <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search..."
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        style={{ marginBottom: "20px" }} // Add some space below the search bar
                    />
                    <Button
                        disabled={selected.length === 0}
                        variant="contained"
                        onClick={() => props.onSubmit(selected)}
                    >
                        Add
                    </Button>
                </Box>
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
                        {userlist.map((user) => {
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
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
