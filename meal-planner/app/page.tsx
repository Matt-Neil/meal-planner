"use client";

import React, { useEffect, useMemo, useState } from "react";
import moment, { Moment } from "moment";
import styles from "./page.module.css";
import { Meal } from "@/types/meal";
import MealCard from "@/components/MealCard";
import Keys from "@/components/Keys";
import AddMealModal from "@/widgets/AddMealModal";
import { useShowAddMealModalContext } from "@/contexts/showAddMealModalContext";
import { useShowToastContext } from "@/contexts/showToastContext";

const getMeals = async (startOfWeek: string, endOfWeek: string) => {
    try {
        const meals = await fetch(
            `https://${process.env.SUPABASE_BASE}.supabase.co/rest/v1/meals` +
                `?date=gte.${encodeURIComponent(
                    startOfWeek
                )}&date=lt.${encodeURIComponent(endOfWeek)}`,
            {
                method: "GET",
                headers: {
                    apikey: process.env.SUPABASE_API_KEY!,
                    Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return await meals.json();
    } catch (e) {
        console.log(e);
    }
};

const Planner = () => {
    const { hideAddMealModal, visibleAddMealModal, showAddMealModal } =
        useShowAddMealModalContext();
    const { showToast } = useShowToastContext();
    const [loading, setLoading] = useState(true);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [startOfWeek, setStartOfWeek] = useState<Moment>(moment().startOf("isoWeek"));
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const diff = moment().startOf("day").diff(startOfWeek.clone().startOf("day"), "days");
    const todayIndex = diff >= 0 && diff < 7 ? diff : null;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            const mealsData =
                (await getMeals(
                    startOfWeek.format("YYYY-MM-DD"),
                    moment(startOfWeek).add(7, "days").format("YYYY-MM-DD")
                )) ?? [];

            setMeals(mealsData);
            setLoading(false);
        }

        fetchData();
    }, [startOfWeek]);

    const formattedMonthYear = useMemo(() => {
        return moment(startOfWeek).format("MMMM YYYY");
    }, [startOfWeek && moment(startOfWeek).format("MMMM YYYY")]);

    const addMeal = async (name: string, type: string, date: Date, people: string[]) => {
        hideAddMealModal();
        showToast("Adding...");

        try {
            const response = await fetch(
                `https://${process.env.SUPABASE_BASE}.supabase.co/rest/v1/meals`,
                {
                    method: "POST",
                    headers: {
                        apikey: process.env.SUPABASE_API_KEY!,
                        Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
                        "Content-Type": "application/json",
                        Prefer: "return=representation",
                    },
                    body: JSON.stringify({
                        name,
                        type,
                        date: moment(date).format("YYYY/MM/DD"),
                        people,
                    }),
                }
            );

            const newMeal: Meal = (await response.json())[0];

            setMeals((meals: Meal[]) => [...meals, newMeal]);
            showToast("Meal added");
        } catch (e) {
            console.error(e);
            showToast("Error occurred");
        }
    };

    return (
        <>
            {visibleAddMealModal && (
                <AddMealModal
                    addMeal={addMeal}
                    date={visibleAddMealModal.date}
                    type={visibleAddMealModal.type}
                />
            )}
            <div className={styles.header}>
                <span className={styles.monthYear}>{formattedMonthYear}</span>
                <div className={styles.navigation}>
                    <button
                        className={styles.navigationButton}
                        onClick={() => {
                            setStartOfWeek(startOfWeek.clone().subtract(1, "week"));
                        }}
                    >
                        <img
                            className={styles.arrowIcon}
                            src="/arrow_back.svg"
                            alt="Previous week"
                            width="12"
                            height="12"
                        />
                    </button>
                    <button
                        className={styles.navigationButton}
                        onClick={() => {
                            setStartOfWeek(moment().startOf("isoWeek"));
                        }}
                        disabled={!!todayIndex}
                    >
                        Today
                    </button>
                    <button
                        className={styles.navigationButton}
                        onClick={() => {
                            setStartOfWeek(startOfWeek.clone().add(1, "week"));
                        }}
                    >
                        <img
                            className={styles.arrowIconFlipped}
                            src="/arrow_back.svg"
                            alt="Next week"
                            width="12"
                            height="12"
                        />
                    </button>
                </div>
            </div>
            {!loading && (
                <main>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th></th>
                                {days.map((day, i) => (
                                    <th
                                        className={styles.tableColumn}
                                        key={i}
                                    >
                                        {day}{" "}
                                        <span
                                            className={
                                                i === todayIndex ? styles.today : ""
                                            }
                                        >
                                            {moment(startOfWeek)
                                                .add(i, "days")
                                                .format("D")}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {["Snack", "Breakfast", "Lunch", "Dinner", "Dessert"].map(
                                (meal, i) => (
                                    <tr
                                        className={styles.tableRow}
                                        key={i}
                                    >
                                        <td>{meal}</td>
                                        {days.map((_, y) => {
                                            const cellDate = moment(startOfWeek).add(
                                                y,
                                                "days"
                                            );

                                            return (
                                                <td
                                                    className={styles.tableCell}
                                                    onClick={(e) => {
                                                        if (
                                                            e.target === e.currentTarget
                                                        ) {
                                                            showAddMealModal(
                                                                meal.toLowerCase() as
                                                                    | "snack"
                                                                    | "breakfast"
                                                                    | "lunch"
                                                                    | "dinner"
                                                                    | "dessert",
                                                                cellDate.toDate()
                                                            );
                                                        }
                                                    }}
                                                    key={y}
                                                >
                                                    <div className={styles.mealsList}>
                                                        {meals
                                                            .filter((mealObj) => {
                                                                const mealDate = moment(
                                                                    mealObj.date
                                                                );
                                                                return (
                                                                    mealObj.type.toLowerCase() ===
                                                                        meal.toLowerCase() &&
                                                                    mealDate.isSame(
                                                                        cellDate,
                                                                        "day"
                                                                    )
                                                                );
                                                            })
                                                            .map((meal, j) => (
                                                                <MealCard
                                                                    meal={meal}
                                                                    setMeals={setMeals}
                                                                    key={j}
                                                                />
                                                            ))}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </main>
            )}
            <Keys />
        </>
    );
};

export default Planner;
