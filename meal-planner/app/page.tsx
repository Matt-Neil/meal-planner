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
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const [loading, setLoading] = useState(true);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [startOfWeek, setStartOfWeek] = useState<Moment>(moment().startOf("isoWeek"));
    const [tableData, setTableData] = useState(
        Array(5)
            .fill(null)
            .map(() => Array(7).fill(""))
    );

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

    const handleCellChange = (row: number, col: number, value: string) => {
        setTableData((prev) => {
            const updated = [...prev];
            updated[row] = [...updated[row]];
            updated[row][col] = value;
            return updated;
        });
    };

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

                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                {days.map((day, i) => (
                                    <th key={i}>
                                        {day}{" "}
                                        {moment(startOfWeek).add(i, "days").format("D")}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {["Snack", "Breakfast", "Lunch", "Dinner", "Dessert"].map(
                                (meal, i) => (
                                    <tr key={i}>
                                        <td>{meal}</td>
                                        {days.map((_, colIndex) => (
                                            <td key={colIndex}>
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
                                                                    colIndex,
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
