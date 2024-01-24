import "./App.css";
import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./store/index";
import { Route, Routes, RouterProvider, createHashRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createHashRouter([{ path: "*", Component: Root }]);

function Root() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </PersistGate>
        </Provider>
    );
}

export default function App() {
    return <RouterProvider router={router} />;
}
