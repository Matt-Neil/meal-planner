"use client";

import { useState } from "react";
import moment from "moment";
import styles from "../styles/modal.module.css";
import { useShowUpdateMealModalContext } from "@/contexts/showUpdateMealModalContext";
import { Meal } from "@/types/meal";

interface Props {
    updateMeal: (name: string, type: string, date: Date, people: string[]) => void;
    deleteMeal: () => void;
    meal: Meal;
}

const UpdateMealModal = ({ updateMeal, deleteMeal, meal }: Props) => {
    const { hideUpdateMealModal } = useShowUpdateMealModalContext();
    const [name, setName] = useState<string>(meal.name);
    const [type, setType] = useState<
        "snack" | "breakfast" | "lunch" | "dinner" | "dessert"
    >(meal.type);
    const [date, setDate] = useState<Date>(meal.date);
    const [people, setPeople] = useState<string[]>(meal.people);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const options = ["Matt", "Ellie"];
    const mealTypes = ["snack", "breakfast", "lunch", "dinner", "dessert"] as const;

    const togglePerson = (name: string) => {
        setPeople((prev) =>
            prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
        );
    };

    return (
        <>
            <div className={styles.modal}>
                <span className={styles.header}>
                    Update {type}: {moment(date).format("ddd D")}
                </span>
                <form
                    className={styles.body}
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateMeal(name, type, date, people);
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
                        <select
                            className={styles.inputType}
                            value={type}
                            onChange={(e) =>
                                setType(e.target.value as (typeof mealTypes)[number])
                            }
                        >
                            {mealTypes.map((mealType) => (
                                <option
                                    key={mealType}
                                    value={mealType}
                                >
                                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.inputRow}>
                        <input
                            className={`${styles.input} ${styles.date}`}
                            placeholder="Due"
                            value={moment(date).format("YYYY-MM-DD")}
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDate(moment(e.target.value).toDate())}
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
                            onClick={() => setConfirmDelete(true)}
                            className={styles.negativeButton}
                        >
                            Delete
                        </button>
                        <button
                            className={styles.positiveButton}
                            disabled={name === ""}
                        >
                            Update
                        </button>
                    </span>
                </form>
            </div>
            <div
                className={styles.background}
                onClick={() => hideUpdateMealModal()}
            />
            {confirmDelete && (
                <>
                    <div className={styles.modalConfirm}>
                        <span className={styles.header}>Confirm delete</span>
                        <div className={styles.body}>
                            <div className={styles.options}>
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className={styles.negativeButton}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteMeal()}
                                    className={styles.positiveButton}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        className={styles.backgroundConfirm}
                        onClick={() => setConfirmDelete(false)}
                    />
                </>
            )}
        </>
    );
};

export default UpdateMealModal;
