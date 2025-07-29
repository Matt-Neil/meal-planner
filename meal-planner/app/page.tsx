"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import styles from "./page.module.css";
import { Meal } from "@/types/meal";

const getMeals = async (startOfCurrentWeek: string, startOfNextWeek: string) => {
    try {
        const expenses = await fetch(
            `https://${process.env.SUPABASE_BASE}.supabase.co/rest/v1/meals` +
                `?date=gte.${encodeURIComponent(
                    startOfCurrentWeek
                )}&date=lt.${encodeURIComponent(startOfNextWeek)}`,
            {
                method: "GET",
                headers: {
                    apikey: process.env.SUPABASE_API_KEY!,
                    Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return await expenses.json();
    } catch (e) {
        console.log(e);
    }
};

const Planner = () => {
    const [loading, setLoading] = useState(true);
    const [meals, setMeals] = useState<Meal[]>([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const mealsData =
                (await getMeals(
                    moment().startOf("isoWeek").format("YYYY-MM-DD"),
                    moment().startOf("isoWeek").add(1, "week").format("YYYY-MM-DD")
                )) ?? [];

            setMeals(mealsData);
            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <>
            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : (
                <div>
                    {meals.map((meal, i) => {
                        return <span>{meal.name}</span>;
                    })}
                </div>
            )}
        </>
    );
};

export default Planner;
