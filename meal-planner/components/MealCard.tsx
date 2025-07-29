import { Meal } from "@/types/meal";
import React from "react";
import styles from "../styles/mealCard.module.css";
import UpdateMealModal from "@/widgets/UpdateMealModal";
import { useShowUpdateMealModalContext } from "@/contexts/showUpdateMealModalContext";
import moment from "moment";
import { useShowToastContext } from "@/contexts/showToastContext";

interface Props {
    meal: Meal;
    setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
}

const MealCard = ({ meal, setMeals }: Props) => {
    const { hideUpdateMealModal, visibleUpdateMealModal, showUpdateMealModal } =
        useShowUpdateMealModalContext();
    const { showToast } = useShowToastContext();

    const updateMeal = async (
        name: string,
        type: string,
        date: Date,
        people: string[]
    ) => {
        hideUpdateMealModal();
        showToast("Updating...");

        try {
            await fetch(
                `https://${process.env.SUPABASE_BASE}.supabase.co/rest/v1/meals?id=eq.${meal.id}`,
                {
                    method: "PATCH",
                    headers: {
                        apikey: process.env.SUPABASE_API_KEY!,
                        Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        type,
                        date: moment(date).format("YYYY/MM/DD"),
                        people,
                    }),
                }
            );

            setMeals((meals: Meal[]) => {
                return meals.map((item) => {
                    if (item.id === meal.id) {
                        return {
                            id: meal.id,
                            name,
                            type: type as
                                | "snack"
                                | "breakfast"
                                | "lunch"
                                | "dinner"
                                | "dessert",
                            date,
                            people,
                        };
                    }
                    return item;
                });
            });
            showToast("Meal updated");
        } catch (e) {
            console.error(e);
            showToast("Error occurred");
        }
    };

    const deleteMeal = async () => {
        hideUpdateMealModal();
        showToast("Deleting...");

        try {
            await fetch(
                `https://${process.env.SUPABASE_BASE}.supabase.co/rest/v1/meals?id=eq.${meal.id}`,
                {
                    method: "DELETE",
                    headers: {
                        apikey: process.env.SUPABASE_API_KEY!,
                        Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setMeals((value) => value.filter((item) => item.id !== meal.id));
            showToast("Meal deleted");
        } catch (e) {
            console.error(e);
            showToast("Error occurred");
        }
    };

    return (
        <>
            {visibleUpdateMealModal === meal.id && (
                <UpdateMealModal
                    meal={meal}
                    updateMeal={updateMeal}
                    deleteMeal={deleteMeal}
                />
            )}
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
                    showUpdateMealModal(meal.id);
                }}
            >
                {meal.name}
            </button>
        </>
    );
};

export default MealCard;
