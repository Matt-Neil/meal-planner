"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";

interface ShowToastContextType {
    visibleToast: string | false;
    showToast: (message: string) => void;
}

export const ShowToastContext = createContext<ShowToastContextType | null>(null);

export const ShowToastContextProvider = ({ children }: { children: ReactNode }) => {
    const [visibleToast, setVisibleToast] = useState<string | false>(false);

    const showToast = (message: string) => {
        setVisibleToast(message);

        const timeoutId = setTimeout(() => {
            setVisibleToast(false);
        }, 2500);

        return () => clearTimeout(timeoutId);
    };

    return (
        <ShowToastContext.Provider value={{ visibleToast, showToast }}>
            {children}
        </ShowToastContext.Provider>
    );
};

export const useShowToastContext = () => {
    const context = useContext(ShowToastContext);

    if (!context) {
        throw new Error(
            "useShowToastContext must be used inside the ShowToastContextProvider"
        );
    }

    return context;
};

export default ShowToastContextProvider;
