"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";

interface ShowUpdateMealModalContextType {
    visibleUpdateMealModal: string | false;
    hideUpdateMealModal: () => void;
    showUpdateMealModal: (id: string) => void;
}

export const ShowUpdateMealModalContext =
    createContext<ShowUpdateMealModalContextType | null>(null);

export const ShowUpdateMealModalContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [visibleUpdateMealModal, setVisibleUpdateMealModal] = useState<string | false>(
        false
    );

    const hideUpdateMealModal = () => {
        document.body.style.overflow = "";
        setVisibleUpdateMealModal(false);
    };

    const showUpdateMealModal = (id: string) => {
        document.body.style.overflow = "hidden";
        setVisibleUpdateMealModal(id);
    };

    return (
        <ShowUpdateMealModalContext.Provider
            value={{
                visibleUpdateMealModal,
                hideUpdateMealModal,
                showUpdateMealModal,
            }}
        >
            {children}
        </ShowUpdateMealModalContext.Provider>
    );
};

export const useShowUpdateMealModalContext = () => {
    const context = useContext(ShowUpdateMealModalContext);

    if (!context) {
        throw new Error(
            "useShowUpdateMealModalContext must be used inside the ShowUpdateMealModalContextProvider"
        );
    }

    return context;
};

export default ShowUpdateMealModalContextProvider;
