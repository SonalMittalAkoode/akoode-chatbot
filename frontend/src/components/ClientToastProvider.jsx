"use client";

import { ToastContainer } from "react-toastify";

export default function ClientToastProvider() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={4000}
            theme="light"
        />
    );
}
