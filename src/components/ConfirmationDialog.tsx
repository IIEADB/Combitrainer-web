import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export interface dialogProps {
    open: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export function ConfirmationDialog(props: dialogProps) {
    return (
        <Dialog sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }} maxWidth="xs" open={props.open}>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent dividers></DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => props.onConfirm()}>
                    Confirm
                </Button>
                <Button autoFocus onClick={() => props.onClose()}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
