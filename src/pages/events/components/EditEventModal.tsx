import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { createEvent, deleteEvent, editEvent } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ConfirmationDialog } from "../../../components/ConfirmationDialog";

export const EditEventModal = (props: { event: any; navigate?: any; onSubmit?: any }) => {
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: props.event.name,
        team_event: props.event.team_event,
        start_date: props.event.start_date,
        end_date: props.event.end_date,
    });
    const [open, setOpen] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedFields = {};

        Object.keys(formData).forEach((key) => {
            if (formData[key] !== props.event[key]) {
                updatedFields[key] = formData[key];
            }
        });

        if (Object.keys(updatedFields).length > 0) {
            await editEvent(updatedFields, props.event.id);
        }

        setOpen(false);
        props.onSubmit();
    };

    const handleDeleteEvent = async () => {
        try {
            await deleteEvent(props.event.id);
            setShowConfirmationDialog(false);
            props.onSubmit();
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmDelete = async () => {
        setShowConfirmationDialog(true);
    };
    return (
        <>
            <ConfirmationDialog
                open={showConfirmationDialog}
                onClose={() => setShowConfirmationDialog(false)}
                onConfirm={() => handleDeleteEvent()}
            />
            <Button variant="contained" onClick={() => setOpen(true)}>
                Edit Event
            </Button>
            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                onSubmit={(e) => handleSubmit(e)}
            >
                <Paper>
                    <DialogTitle>Create Event</DialogTitle>
                    <DialogContent>
                        <FormControl component={"form"} sx={{ gap: 4, padding: 2 }}>
                            <TextField
                                value={formData.name}
                                required={true}
                                label="Event Name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            ></TextField>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    handleConfirmDelete();
                                }}
                            >
                                Delete event
                            </Button>
                            <Box>
                                <FormLabel required id="demo-radio-buttons-group-label">
                                    Event Type
                                </FormLabel>
                                <RadioGroup
                                    row
                                    value={formData.team_event ? "team" : "solo"}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            team_event: e.target.value === "team" ? true : false,
                                        })
                                    }
                                >
                                    <FormControlLabel value={"team"} control={<Radio />} label="Team" />
                                    <FormControlLabel value={"solo"} control={<Radio />} label="Solo" />
                                </RadioGroup>
                            </Box>
                            <Box sx={{ flexDirection: "column", display: "flex", gap: 2 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        defaultValue={dayjs(formData.start_date)}
                                        label="Start Time"
                                        slotProps={{ textField: { required: true } }}
                                        onChange={(e: any) => setFormData({ ...formData, start_date: e.format() })}
                                    />
                                    <DatePicker
                                        defaultValue={dayjs(formData.end_date)}
                                        label="End Time"
                                        slotProps={{ textField: { required: true } }}
                                        onChange={(e: any) => setFormData({ ...formData, end_date: e.format() })}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                                <Button type="submit" variant="contained">
                                    Save
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
