import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField } from "@mui/material";

export const CreateEventModal = (props: { open: boolean; onClose: () => void; onSubmit: () => void }) => {
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <Paper>
                <DialogTitle>Create Event</DialogTitle>
                <DialogContent>
                    <TextField label="Event Name"></TextField>
                    <TextField label="Start Date"></TextField>
                    <TextField label="End Date"></TextField>
                    <DialogActions>
                        <Button onClick={props.onSubmit}>Create</Button>
                        <Button onClick={props.onClose}>Close</Button>
                    </DialogActions>
                </DialogContent>
            </Paper>
        </Dialog>
    );
};
