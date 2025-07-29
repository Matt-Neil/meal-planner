"use client";

import { useState } from "react";
import moment from "moment";
import styles from "../styles/modal.module.css";
import { useShowAddMealModalContext } from "@/contexts/showAddMealModalContext";

interface Props {
    addMeal: (name: string, type: string, date: Date, people: string[]) => void;
    date: Date;
    type: "snack" | "breakfast" | "lunch" | "dinner" | "dessert";
}

const AddMealModal = ({ addMeal, date, type }: Props) => {
    const { hideAddMealModal } = useShowAddMealModalContext();
    const [name, setName] = useState<string>("");
    const [people, setPeople] = useState<string[]>([]);
    const options = ["Matt", "Ellie"];

    const togglePerson = (name: string) => {
        setPeople((prev) =>
            prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
        );
    };

    return (
        <>
            <div className={styles.modal}>
                <span className={styles.header}>
                    Add {type}: {moment(date).format("ddd D")}
                </span>
                <form
                    className={styles.body}
                    onSubmit={(e) => {
                        e.preventDefault();
                        addMeal(name, type, date, people);
                    }}
                >
                    <div className={styles.inputRow}>
                        <input
                            className={styles.inputName}
                            placeholder="Name"
                            value={name}
                            required
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputRow}>
                        {options.map((name) => (
                            <label
                                className={styles.inputPeople}
                                key={name}
                            >
                                <input
                                    type="checkbox"
                                    checked={people.includes(name)}
                                    onChange={() => togglePerson(name)}
                                />
                                {name}
                            </label>
                        ))}
                    </div>
                    <span className={styles.options}>
                        <button
                            type="button"
                            onClick={() => hideAddMealModal()}
                            className={styles.negativeButton}
                        >
                            Cancel
                        </button>
                        <button
                            className={styles.positiveButton}
                            disabled={name === ""}
                        >
                            Add
                        </button>
                    </span>
                </form>
            </div>
            <div
                className={styles.background}
                onClick={() => hideAddMealModal()}
            ></div>
        </>
    );
};

export default AddMealModal;
