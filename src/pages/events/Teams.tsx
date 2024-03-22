import { useEffect, useState } from "react";
import { deleteTeam, fetchTeams } from "../../api/api";
import {
    Checkbox,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { CreateTeamModal } from "./components/CreateTeamModal";

export const Teams = (props: { event: any; navigate: any }) => {
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const [valueToOrderBy, setValueToOrderBy] = useState<string>("name");
    const [selected, setSelected] = useState<number[]>([]);
    const [teamList, setTeamList] = useState<Team[]>([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const authenticatedUser = useSelector((state: RootState) => state.user);

    const handleGetTeamList = async () => {
        try {
            const response = await fetchTeams(props.event.id);
            setTeamList(response.data.teams);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleGetTeamList();
    }, [refresh]);

    const handleRequestSort = (property: string) => {
        const isAscending = valueToOrderBy === property && orderDirection === "asc";
        setValueToOrderBy(property);
        setOrderDirection(isAscending ? "desc" : "asc");
    };

    const handleSelectAllClick = (event: { target: { checked: boolean } }) => {
        if (event.target.checked) {
            const newSelecteds = teamList.map((n) => n.id!);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleConfirmDelete = async (id: number) => {
        setSelectedTeamId(id);
        setShowConfirmationDialog(true);
    };
    const handleDeleteTeam = async () => {
        try {
            await deleteTeam(selectedTeamId);
            setShowConfirmationDialog(false);
            setRefresh(!refresh);
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

    return (
        <Grid item xs={6}>
            <ConfirmationDialog
                open={showConfirmationDialog}
                onConfirm={handleDeleteTeam}
                onClose={() => setShowConfirmationDialog(false)}
            ></ConfirmationDialog>
            <CreateTeamModal onSubmit={() => setRefresh(!refresh)} eventId={props.event.id}></CreateTeamModal>
            <h1>Event team list</h1>
            <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < teamList.length}
                                    checked={teamList.length > 0 && selected.length === teamList.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>

                            <TableCell>
                                <TableSortLabel
                                    active={valueToOrderBy === "name"}
                                    direction={valueToOrderBy === "name" ? orderDirection : "asc"}
                                    onClick={() => handleRequestSort("name")}
                                >
                                    Team
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Delete event</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teamList.length > 0 &&
                            teamList.map((team: Team) => {
                                const isItemSelected = isSelected(team.id);
                                return (
                                    <TableRow
                                        key={team.id}
                                        hover
                                        onClick={(team: any) => handleClick(team.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} />
                                        </TableCell>
                                        <TableCell>{team.name}</TableCell>
                                        <TableCell>
                                            {authenticatedUser?.id === team.creator && (
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleConfirmDelete(team.id);
                                                    }}
                                                    aria-label="delete"
                                                    size="large"
                                                >
                                                    <DeleteIcon style={{ color: "red" }} />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
};
