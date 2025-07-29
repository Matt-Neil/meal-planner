"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";

interface ShowAddMealModalContextType {
    visibleAddMealModal:
        | { type: "snack" | "breakfast" | "lunch" | "dinner" | "dessert"; date: Date }
        | false;
    hideAddMealModal: () => void;
    showAddMealModal: (
        type: "snack" | "breakfast" | "lunch" | "dinner" | "dessert",
        date: Date
    ) => void;
}

export const ShowAddMealModalContext = createContext<ShowAddMealModalContextType | null>(
    null
);

export const ShowAddMealModalContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [visibleAddMealModal, setVisibleAddMealModal] = useState<
        | { type: "snack" | "breakfast" | "lunch" | "dinner" | "dessert"; date: Date }
        | false
    >(false);

    const hideAddMealModal = () => {
        document.body.style.overflow = "";
        setVisibleAddMealModal(false);
    };

    const showAddMealModal = (
        type: "snack" | "breakfast" | "lunch" | "dinner" | "dessert",
        date: Date
    ) => {
        document.body.style.overflow = "hidden";
        setVisibleAddMealModal({ type, date });
    };

    return (
        <ShowAddMealModalContext.Provider
            value={{
                visibleAddMealModal,
                hideAddMealModal,
                showAddMealModal,
            }}
        >
            {children}
        </ShowAddMealModalContext.Provider>
    );
};

export const useShowAddMealModalContext = () => {
    const context = useContext(ShowAddMealModalContext);

    if (!context) {
        throw new Error(
            "useShowAddMealModalContext must be used inside the ShowAddMealModalContextProvider"
        );
    }

    return context;
};

export default ShowAddMealModalContextProvider;
