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
import { createEvent } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export const CreateEventModal = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        team_event: true,
        start_date: dayjs(new Date()),
        end_date: dayjs(new Date()).add(1, "d"),
    });
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await createEvent(formData as any);
        setOpen(false);
        navigate("/dashboard/events", { replace: true });
    };
    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Create Event
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
                                required={true}
                                label="Event Name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            ></TextField>
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
                                        defaultValue={formData.start_date}
                                        label="Start Time"
                                        slotProps={{ textField: { required: true } }}
                                        onChange={(e: any) => setFormData({ ...formData, start_date: e.format() })}
                                    />
                                    <DatePicker
                                        defaultValue={formData.end_date}
                                        label="End Time"
                                        slotProps={{ textField: { required: true } }}
                                        onChange={(e: any) => setFormData({ ...formData, end_date: e.format() })}
                                    />
                                </LocalizationProvider>
                            </Box>
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
