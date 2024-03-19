import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    refreshToken: string | "";
    isAuthenticated: boolean;
    user: Partial<User> | null;
    isOTPVerified: boolean;
}

const initialState: AuthState = {
    token: null,
    refreshToken: "",
    isAuthenticated: false,
    user: null,
    isOTPVerified: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<{ token: string; refreshToken: string; user: Partial<User> | null }>) {
            const { token, refreshToken, user } = action.payload;
            state.token = token;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
            state.user = user;
        },
        clearToken(state) {
            state.token = null;
            state.refreshToken = "";
            state.isAuthenticated = false;
            state.user = null;
        },
        setIsOTPVerified(state, action: PayloadAction<boolean>) {
            state.isOTPVerified = action.payload;
        },
    },
});

export const { setToken, clearToken, setIsOTPVerified } = authSlice.actions;
export default authSlice.reducer;
