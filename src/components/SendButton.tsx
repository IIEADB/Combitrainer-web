import Button from "@mui/material/Button";

export function SendButton({name }: { name: string; }) {
    return <Button type="submit" variant="contained" sx={{ width: "fit-content" }}>
        {name}
    </Button>;
}
