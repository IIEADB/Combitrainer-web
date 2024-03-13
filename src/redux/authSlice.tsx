import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    refreshToken: string | "";
    isAuthenticated: boolean;
    user: any;
}

const initialState: AuthState = {
    token: null,
    refreshToken: "",
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<{ token: string; refreshToken: string; user: any }>) {
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
    },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
