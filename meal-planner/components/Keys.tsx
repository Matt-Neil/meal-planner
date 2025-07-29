import React from "react";
import styles from "../styles/keys.module.css";

const Keys = () => {
    return (
        <div className={styles.keys}>
            <div className={styles.keyPair}>
                <div className={styles.sharedKey} /> Shared
            </div>
            <div className={styles.keyPair}>
                <div className={styles.mattKey} /> Matt
            </div>
            <div className={styles.keyPair}>
                <div className={styles.ellieKey} /> Ellie
            </div>
        </div>
    );
};

export default Keys;
