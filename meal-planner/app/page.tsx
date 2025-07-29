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
                    {days.map((day, i) => (
                        <div key={i}>
                            <div>
                                {day} {moment(startOfWeek).add(i, "days").format("D")}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Planner;
