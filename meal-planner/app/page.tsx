"use client";

import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import styles from "./page.module.css";
import { Meal } from "@/types/meal";

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

    return (
        <>
            {!loading && (
                <div>
                    <div>
                        <span>{moment(startOfWeek).format("MMMM YYYY")}</span>
                        <button
                            onClick={() => {
                                setStartOfWeek(startOfWeek.clone().subtract(1, "week"));
                            }}
                        >
                            Previous week
                        </button>
                        <button
                            onClick={() => {
                                setStartOfWeek(moment().startOf("isoWeek"));
                            }}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => {
                                setStartOfWeek(startOfWeek.clone().add(1, "week"));
                            }}
                        >
                            Next week
                        </button>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th></th>
                                {days.map((day, i) => (
                                    <th
                                        className={styles.tableHeader}
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
                                    <tr key={i}>
                                        <td>{meal}</td>
                                        {days.map((_, y) => (
                                            <td
                                                key={y}
                                                className={styles.tableCell}
                                            >
                                                {meals
                                                    .filter((mealObj) => {
                                                        const mealDate = moment(
                                                            mealObj.date
                                                        );
                                                        return (
                                                            mealObj.type.toLowerCase() ===
                                                                meal.toLowerCase() &&
                                                            mealDate.isSame(
                                                                moment(startOfWeek).add(
                                                                    y,
                                                                    "days"
                                                                ),
                                                                "day"
                                                            )
                                                        );
                                                    })
                                                    .map((meal, j) => (
                                                        <div key={j}>
                                                            <strong>{meal.name}</strong>
                                                            <div>
                                                                {meal.people.join(", ")}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </td>
                                        ))}
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default Planner;
