import Button from "@mui/material/Button";

export function SendButton({ name, fullWidth = false }: { name: string; fullWidth?: boolean }) {
    return <Button type="submit" variant="contained" sx={{ width: fullWidth ? "100%" : "fit-content" }}>
        {name}
    </Button>;
}
