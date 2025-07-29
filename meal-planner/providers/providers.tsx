"use client";

import ShowAddMealModalContextProvider from "@/contexts/showAddMealModalContext";
import ShowToastContextProvider from "@/contexts/showToastContext";
import ShowUpdateMealModalContextProvider from "@/contexts/showUpdateMealModalContext";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ShowToastContextProvider>
            <ShowAddMealModalContextProvider>
                <ShowUpdateMealModalContextProvider>
                    {children}
                </ShowUpdateMealModalContextProvider>
            </ShowAddMealModalContextProvider>
        </ShowToastContextProvider>
    );
}
