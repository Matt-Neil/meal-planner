"use client";

import { useShowToastContext } from "@/contexts/showToastContext";
import React from "react";
import styles from "../styles/toast.module.css";

const Toast = () => {
    const { visibleToast } = useShowToastContext();

    return visibleToast && <div className={styles.toast}>{visibleToast}</div>;
};

export default Toast;
