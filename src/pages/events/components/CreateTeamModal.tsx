import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, Paper, TextField } from "@mui/material";
import { useState } from "react";
import { createTeam } from "../../../api/api";

export const CreateTeamModal = (props: { eventId: string; onSubmit?: any }) => {
    const [formData, setFormData] = useState({
        name: "",
    });
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await createTeam(formData as any, props.eventId);
        setOpen(false);
        props.onSubmit();
    };
    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Create Team
            </Button>
            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                onSubmit={(e) => handleSubmit(e)}
            >
                <Paper>
                    <DialogTitle>Create Team</DialogTitle>
                    <DialogContent>
                        <FormControl component={"form"} sx={{ gap: 4, padding: 2 }}>
                            <TextField
                                required={true}
                                label="Team Name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            ></TextField>

                            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                                <Button variant="contained" type="submit">
                                    Create
                                </Button>
                                <Button onClick={() => setOpen(false)} variant="contained">
                                    Close
                                </Button>
                            </Box>
                        </FormControl>
                    </DialogContent>
                </Paper>
            </Dialog>
        </>
    );
};
