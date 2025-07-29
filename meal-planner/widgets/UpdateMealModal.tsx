"use client";

import { useState } from "react";
import moment from "moment";
import styles from "../styles/manageMeals.module.css";
import { useShowAddMealModalContext } from "@/contexts/showAddMealModalContext";

interface Props {
    addExpense: (
        name: string,
        amount: number,
        due: Date | null,
        monthlyFrequency: number | null,
        fixed: boolean,
        link: string | null
    ) => void;
}

const AddExpenseModal = ({ addExpense }: Props) => {
    const { hideAddMealModal } = useShowAddMealModalContext();
    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [due, setDue] = useState<Date | null>(null);
    const [monthlyFrequency, setMonthlyFrequency] = useState<string>("");
    const [fixed, setFixed] = useState<boolean>(true);
    const [link, setLink] = useState<string>("");

    return (
        <>
            <div className={styles.modal}>
                <span className={styles.header}>Add expense</span>
                <form
                    className={styles.body}
                    onSubmit={(e) => {
                        e.preventDefault();
                        addExpense(
                            name ?? "",
                            Number(amount),
                            moment(due).isValid() ? due ?? new Date() : null,
                            fixed ? Number(monthlyFrequency) ?? 1 : null,
                            fixed,
                            fixed ? null : link
                        );
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
                        <button
                            type="button"
                            onClick={() => {
                                setMonthlyFrequency("");
                                setLink("");
                                setFixed((previous) => !previous);
                            }}
                            className={styles.typeButton}
                        >
                            {fixed ? "Recurring" : "One-time"}
                        </button>
                    </div>
                    <div className={styles.inputRow}>
                        £
                        <input
                            className={`${styles.input} ${styles.amount}`}
                            type="text"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => {
                                let val = e.target.value;

                                if (val === "") {
                                    setAmount("");
                                    return;
                                }

                                if (/^(0|[1-9]\d*)(\.\d{0,2})?$/.test(val)) {
                                    setAmount(val);
                                }
                            }}
                            onBlur={() => {
                                if (amount === "" || isNaN(Number(amount))) {
                                    setAmount("0");
                                } else {
                                    setAmount(parseFloat(amount ?? "0").toFixed(2));
                                }
                            }}
                        />
                        <input
                            className={`${styles.input} ${styles.due}`}
                            placeholder="Due"
                            value={moment(due).format("YYYY-MM-DD")}
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDue(moment(e.target.value).toDate())}
                        />
                        {moment(due).isValid() && (
                            <button
                                type="button"
                                className={styles.clearDateButton}
                                onClick={() => setDue(null)}
                                aria-label="Clear due date"
                            >
                                <img
                                    src="/cancel.svg"
                                    alt="cancel start period"
                                    width={16}
                                    height={16}
                                />
                            </button>
                        )}
                    </div>
                    {fixed && (
                        <input
                            className={styles.input}
                            placeholder="Monthly frequency"
                            type="number"
                            required
                            min={1}
                            value={monthlyFrequency}
                            onChange={(e) => setMonthlyFrequency(e.target.value)}
                        />
                    )}
                    <input
                        className={styles.input}
                        placeholder="Link"
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <span className={styles.options}>
                        <button
                            type="button"
                            onClick={() => hideAddExpenseModal()}
                            className={styles.negativeButton}
                        >
                            Cancel
                        </button>
                        <button
                            className={styles.positiveButton}
                            disabled={amount === ""}
                        >
                            Add
                        </button>
                    </span>
                </form>
            </div>
            <div
                className={styles.background}
                onClick={() => hideAddExpenseModal()}
            ></div>
        </>
    );
};

export default AddExpenseModal;
