import { CourseModel } from "../models/course.model";

export type CourseProgress = {
    completed: number;
    total: number;
    lastWatched: Date;
}

export enum Roles {
    Student = "student",
    Professor = "professor"
}
