import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken(state, action) {
            const { token, refreshToken, user } = action.payload;
            return {
                ...state,
                token,
                refreshToken,
                isAuthenticated: true,
                user,
            };
        },
        clearToken(state) {
            return {
                ...state,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                user: null,
            };
        },
    },
});
export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
