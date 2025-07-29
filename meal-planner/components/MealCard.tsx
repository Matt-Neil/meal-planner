import { Meal } from "@/types/meal";
import React from "react";
import styles from "../styles/mealCard.module.css";

interface Props {
    meal: Meal;
}

const MealCard = ({ meal }: Props) => {
    return (
        <button
            className={`${styles.card} ${
                meal.people.length === 2
                    ? styles.shared
                    : meal.people.includes("Matt")
                    ? styles.singleM
                    : meal.people.includes("Ellie")
                    ? styles.singleE
                    : ""
            }`}
            onClick={(e) => {
                e.stopPropagation();
                alert("Edit meal");
            }}
        >
            <strong>{meal.name}</strong>
        </button>
    );
};

export default MealCard;
