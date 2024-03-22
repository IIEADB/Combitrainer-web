import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useState } from "react";


export function PasswordInput({
    passwordError = "", 
    name,
    margin = "normal"
}: {
    passwordError?: string;
    name: string;
    margin?: "normal" | "dense" | "none";
}) {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <FormControl margin={margin} required variant="outlined" style={{width: 440, maxWidth: "100%"}}>
            <InputLabel htmlFor="password" error={!!passwordError}>
                {name}
            </InputLabel>
            <OutlinedInput
                id={name}
                label={name}
                name={name}
                autoComplete={name}
                type={showPassword ? "text" : "password"}
                error={!!passwordError}
                endAdornment={<InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>} />
            <FormHelperText id="password-helper-text" error={!!passwordError}>
                {passwordError}
            </FormHelperText>
        </FormControl>
    );
}
