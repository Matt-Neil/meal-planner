import { UUID } from "crypto";

export interface Meal {
    id: UUID;
    name: string;
    type: "snack" | "breakfast" | "lunch" | "dinner" | "dessert";
    date: Date;
    people: string[];
}
